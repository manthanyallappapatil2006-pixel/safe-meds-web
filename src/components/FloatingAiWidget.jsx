import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Bot,
  X,
  Send,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Info,
  ServerOff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { getTranslation } from '../utils/translations';

export const FloatingAiWidget = () => {
  const { language = 'en', user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं सेफ मेड्स का आरोग्य AI सहायक हूँ। मैं आपको डॉक्टर खोजने, अपॉइंटमेंट बुक करने या वेबसाइट उपयोग करने में मदद कर सकता हूँ।'
          : language === 'mr'
          ? 'नमस्कार! मी सेफ मेड्सचा आरोग्य AI सहाय्यक आहे. मी तुम्हाला डॉक्टर शोधण्यात किंवा अपॉइंटमेंट बुक करण्यात मदत करू शकतो.'
          : 'Hello! I am Aarogya AI, your Safe Meds website guide. I can help you navigate doctors, book appointments, or find informational catalogues.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isBackendConnected = aiService.isConfigured();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const quickPrompts = [
    { label: 'How to book a doctor?', query: 'How do I book an appointment with a doctor?' },
    { label: 'Find a pharmacy', query: 'Where can I find verified pharmacies nearby?' },
    { label: 'Prescription upload', query: 'How do I upload a prescription?' },
    { label: 'Emergency Help', query: 'What should I do in an emergency?' },
  ];

  // Verified navigation and educational response generator for offline/unconfigured fallback
  
const getOfflineGuidance = (query) => {
  const q = query.toLowerCase();

  if (
    q.includes('emergency') ||
    q.includes('112') ||
    q.includes('chest pain') ||
    q.includes('breathing') ||
    q.includes('accident')
  ) {
    return {
      reply:
        '🚨 EMERGENCY HELP\n\n' +
        '1. For an actual emergency in India, call 112 immediately.\n' +
        '2. Do not wait for an app confirmation before seeking help.\n' +
        '3. Safe Meds currently records demo emergency requests and saved emergency contacts. Actual SMS alerts, ambulance dispatch and live emergency services are not connected yet.',
      disclaimer:
        'Safe Meds SOS is currently a demonstration feature, not an emergency dispatch service.',
    };
  }

  if (
    q.includes('appointment') ||
    q.includes('book') ||
    q.includes('doctor')
  ) {
    return {
      reply:
        'DOCTOR APPOINTMENTS\n\n' +
        'You can use Safe Meds to:\n' +
        '1. Open the Find Doctors section.\n' +
        '2. Browse available doctor profiles.\n' +
        '3. Select a doctor and an available appointment slot.\n' +
        '4. Submit your booking.\n' +
        '5. View your appointment in the Appointments section.\n\n' +
        'Doctors can view relevant appointment records in their dashboard. Current frontend records are stored locally; shared backend functionality is still pending.',
      disclaimer:
        'Displayed doctor profiles and appointment availability may be demonstration data.',
    };
  }

  if (
    q.includes('pharmacy') ||
    q.includes('chemist') ||
    q.includes('medicine store')
  ) {
    return {
      reply:
        'PHARMACY DIRECTORY\n\n' +
        '1. Open Pharmacies from the sidebar.\n' +
        '2. Browse the listed pharmacy information.\n' +
        '3. Select a pharmacy to view its available medicine catalogue.\n' +
        '4. Check the displayed prices and stock information.\n\n' +
        'The website includes pharmacy management features for administrators. Actual pharmacy verification and live inventory synchronization require backend integration.',
      disclaimer:
        'Some pharmacy and inventory information is demonstration data.',
    };
  }

  if (
    q.includes('prescription') ||
    q.includes('upload') ||
    q.includes('scan')
  ) {
    return {
      reply:
        'PRESCRIPTIONS\n\n' +
        '1. Open Prescriptions from the sidebar.\n' +
        '2. Use the upload option to select a prescription file.\n' +
        '3. View your uploaded prescriptions.\n' +
        '4. Doctors can issue or update prescriptions through their dashboard.\n' +
        '5. Prescription approval and rejection workflows are available in the frontend.\n\n' +
        'Secure server-side storage and access control still need backend integration.',
      disclaimer:
        'Only upload medical documents you are authorised to share. Consult a qualified doctor about prescriptions.',
    };
  }

  if (
    q.includes('order') ||
    q.includes('cart') ||
    q.includes('checkout') ||
    q.includes('delivery')
  ) {
    return {
      reply:
        'MEDICINE ORDERS\n\n' +
        'Safe Meds includes:\n' +
        '1. Pharmacy-specific medicine catalogues.\n' +
        '2. Shopping cart and quantity management.\n' +
        '3. Pharmacy-specific checkout.\n' +
        '4. Order confirmation and order details.\n' +
        '5. Demo order tracking and cancellation.\n\n' +
        'The current frontend uses local data. Real payment processing, pharmacy fulfilment and live delivery tracking are not connected.',
      disclaimer:
        'Order and delivery statuses shown in the current frontend are demonstration features.',
    };
  }

  if (
    q.includes('login') ||
    q.includes('register') ||
    q.includes('account') ||
    q.includes('profile')
  ) {
    return {
      reply:
        'ACCOUNT AND PROFILE\n\n' +
        'Safe Meds provides user account, profile and administrator interfaces.\n\n' +
        'Use the appropriate login or registration page to access your account. If you have a login problem, describe the error without sharing your password or verification codes.',
      disclaimer:
        'Account security and server-side authentication must be verified through the backend.',
    };
  }

  if (
    q.includes('admin') ||
    q.includes('dashboard')
  ) {
    return {
      reply:
        'ADMIN DASHBOARD\n\n' +
        'The Safe Meds administration interface includes management features for pharmacy information, medicine inventory and other application data.\n\n' +
        'Administrators should use the authorised admin login. The demo interface should not be treated as production-level access control until backend authentication and permissions are implemented.',
      disclaimer:
        'Never share administrator passwords or private credentials.',
    };
  }

  if (
    q.includes('language') ||
    q.includes('translate')
  ) {
    return {
      reply:
        'LANGUAGE SUPPORT\n\n' +
        'Safe Meds includes language selection and translation support. The application currently has English, Hindi and Marathi language options.',
      disclaimer:
        'Some newly added content may not yet have translations.',
    };
  }

  return {
    reply:
      'Hello! I am Aarogya AI, the Safe Meds assistant.\n\n' +
      'I can currently provide basic guidance about:\n\n' +
      '• Doctor appointments\n' +
      '• Pharmacy directory\n' +
      '• Medicines and inventory\n' +
      '• Prescriptions\n' +
      '• Cart and medicine orders\n' +
      '• Emergency SOS features\n' +
      '• Login, profiles and admin dashboard\n' +
      '• Website navigation\n\n' +
      'For general questions and personalised account information, the secure backend AI integration is still required.',
    disclaimer:
      'I provide educational and website guidance, not medical diagnosis or treatment.',
  };
};


  const handleSend = async (messageText = input) => {
    const text = messageText.trim();
    if (!text) return;

    const userMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      if (isBackendConnected) {
        const response = await aiService.sendMessage(text, messages, language);
        if (response.data?.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: 'ai_' + Date.now(),
              role: 'assistant',
              content: response.data.reply,
              disclaimer: response.data.disclaimer,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        } else {
          // Backend returned error or empty response
          const guidance = getOfflineGuidance(text);
          setMessages((prev) => [
            ...prev,
            {
              id: 'ai_' + Date.now(),
              role: 'assistant',
              content: guidance.reply,
              disclaimer: guidance.disclaimer,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      } else {
        // Backend not configured: provide immediate trusted offline navigation assistance
        // along with clearly labelled setup status
        setTimeout(() => {
          const guidance = getOfflineGuidance(text);
          setMessages((prev) => [
            ...prev,
            {
              id: 'ai_' + Date.now(),
              role: 'assistant',
              content: guidance.reply,
              disclaimer: guidance.disclaimer,
              isFallback: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsTyping(false);
        }, 600);
        return;
      }
    } catch (err) {
      const guidance = getOfflineGuidance(text);
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: guidance.reply,
          disclaimer: guidance.disclaimer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: 'Conversation cleared. How can I assist you with Safe Meds today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      {/* Floating Launcher Button */}
      <motion.button
        id="btn-floating-ai"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-700 to-teal-900 text-white shadow-xl hover:shadow-2xl flex items-center justify-center border-2 border-white focus:outline-none focus:ring-4 focus:ring-teal-400 transition-shadow relative"
        aria-label="Open Aarogya AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot-icon"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
             <img
  src="https://miro.medium.com/1*KqVeyzLPdBj74GAuGEJkBQ.png"
  alt="Aarogya AI"
  className="w-10 h-10 rounded-full object-cover"
/>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-teal-800 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-teal-800 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-window"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 15 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-96 max-h-[82vh] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white p-3.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-700/60 border border-teal-500/40 flex items-center justify-center text-teal-100 shadow-inner">
                  <Bot className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold leading-tight">Aarogya AI</h3>
                    <span className="text-[10px] bg-teal-600/80 text-teal-100 font-semibold px-1.5 py-0.2 rounded-full">
                      Guide
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Navigation & Health Assistance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 text-teal-200 hover:text-white hover:bg-teal-700/60 rounded-lg transition-colors text-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 text-teal-200 hover:text-white hover:bg-teal-700/60 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Backend status indicator if unconfigured */}
            {!isBackendConnected && (
              <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-amber-800">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Backend AI in setup mode. Using verified local guides.</span>
                </div>
              </div>
            )}

            {/* Safety Disclaimer Banner */}
            <div className="bg-teal-50/70 border-b border-teal-100 px-3 py-1.5 text-[10px] text-teal-800 flex items-start gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
              <span>
                Educational guide only. Never replaces doctor consultation. In emergency, call 112.
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm whitespace-pre-line leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-teal-800 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                    {msg.disclaimer && (
                      <p className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 italic">
                        {msg.disclaimer}
                      </p>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-medium">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 w-fit px-3 py-2 rounded-2xl rounded-tl-none shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length < 3 && (
              <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(p.query)}
                    className="shrink-0 text-[11px] font-medium bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                id="floating-ai-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about doctors, booking, medicines..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center hover:bg-teal-900 disabled:opacity-40 transition-opacity shrink-0 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingAiWidget;
