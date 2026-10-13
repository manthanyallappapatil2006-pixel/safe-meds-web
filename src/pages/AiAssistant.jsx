import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  PhoneCall,
  Languages,
  BookOpen,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiAssistant = () => {
  const { language, setLanguage, user } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 'msg-0',
      sender: 'bot',
      text:
        language === 'mr'
          ? 'नमस्कार! मी आरोग्य AI (Aarogya AI), आपला सेफ मेड्स शैक्षणिक आरोग्य सहाय्यक आहे. मी वैद्यकीय संज्ञा सोप्या भाषेत समजावून सांगू शकतो, डॉक्टरांना विचारण्यासाठी प्रश्न तयार करण्यात मदत करू शकतो आणि सेफ मेड्स फीचर्स समजावून सांगू शकतो. कृपया लक्षात घ्या की मी डॉक्टर नाही.'
          : language === 'hi'
          ? 'नमस्ते! मैं आरोग्य AI (Aarogya AI) हूँ, आपका सेफ मेड्स स्वास्थ्य गाइड। मैं सामान्य स्वास्थ्य शब्दों को सरल भाषा में समझा सकता हूँ, डॉक्टर से परामर्श के लिए सवाल तैयार करने में सहायता कर सकता हूँ और ऐप फीचर्स समझा सकता हूँ। ध्यान दें कि मैं कोई डॉक्टर नहीं हूँ।'
          : 'Hello! I am Aarogya AI, your Safe Meds educational healthcare guide. I can explain common medical terms in simple language, help you prepare questions for your doctor, and guide you through Safe Meds. Please note that I am an AI guide, not a medical doctor.',
      timestamp: 'Just now'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const presetPrompts = [
    {
      en: 'What is High Blood Pressure (Hypertension)?',
      hi: 'उच्च रक्तचाप (High BP) क्या है?',
      mr: 'उच्च रक्तदाब (High BP) म्हणजे काय?'
    },
    {
      en: 'Questions to ask my doctor during a visit',
      hi: 'डॉक्टर से परामर्श के दौरान क्या सवाल पूछें?',
      mr: 'डॉक्टरांना तपासणीवेळी काय प्रश्न विचारावेत?'
    },
    {
      en: 'How to upload doctor prescriptions in Safe Meds?',
      hi: 'सेफ मेड्स में डॉक्टर का पर्चा कैसे अपलोड करें?',
      mr: 'सेफ मेड्समध्ये डॉक्टरांचे प्रिस्क्रिप्शन कसे अपलोड करावे?'
    },
    {
      en: 'What should I do during a medical emergency?',
      hi: 'चिकित्सा आपातकाल में क्या करें?',
      mr: 'वैद्यकीय आणीबाणीच्या वेळी काय करावे?'
    }
  ];

  // Verified educational responses for safe client-side educational fallback
  const getEducationalResponse = (query, lang) => {
    const q = query.toLowerCase();

    // Emergency queries
    if (
      q.includes('emergency') ||
      q.includes('heart attack') ||
      q.includes('chest pain') ||
      q.includes('severe pain') ||
      q.includes('bleeding') ||
      q.includes('आपात') ||
      q.includes('तातडी')
    ) {
      if (lang === 'mr') {
        return '⚠️ तातडीची सूचना: जर तुम्हाला छातीत तीव्र दुखणे, श्वास घेण्यास अडचण किंवा गंभीर दुखापत होत असेल, तर चॅटबॉटवर अवलंबून राहू नका. भारतात त्वरित १०२ किंवा ११२ वर कॉल करा किंवा जवळच्या आपत्कालीन रुग्णालयात पोहोचा.';
      } else if (lang === 'hi') {
        return '⚠️ आपातकालीन चेतावनी: यदि आपको सीने में तेज दर्द, सांस लेने में अत्यधिक कठिनाई या गंभीर रक्तस्राव हो रहा है, तो तुरंत 112 डायल करें या नजदीकी आपातकालीन अस्पताल जाएं। AI केवल सामान्य जानकारी के लिए है।';
      }
      return '⚠️ IMMEDIATE EMERGENCY WARNING: If you or anyone around you is experiencing severe chest pain, breathing difficulty, sudden weakness, or intense injury, do NOT wait for an AI response. Immediately call India National Emergency 112 or visit the nearest emergency department.';
    }

    // Blood Pressure
    if (q.includes('blood pressure') || q.includes('hypertension') || q.includes('bp') || q.includes('रक्तदाब') || q.includes('रक्तचाप')) {
      if (lang === 'mr') {
        return 'उच्च रक्तदाब (Hypertension): जेव्हा रक्तवाहिन्यांच्या भिंतींवर रक्ताचा दाब सतत सामान्यपेक्षा (120/80 mmHg पेक्षा जास्त) राहतो, तेव्हा त्याला उच्च रक्तदाब म्हणतात. मीठ कमी खाणे, नियमित व्यायाम करणे, ताणतणाव कमी करणे आणि डॉक्टरांच्या सल्ल्यानुसार योग्य औषध वेळेवर घेणे आवश्यक आहे.';
      } else if (lang === 'hi') {
        return 'उच्च रक्तचाप (Hypertension): जब रक्त वाहिकाओं में रक्त का दबाव सामान्य सीमा (120/80 mmHg) से लगातार अधिक रहता है, तो इसे हाइपरटेंशन कहते हैं। सोडियम (नमक) का सेवन सीमित रखना, 30 मिनट टहलना और डॉक्टर द्वारा बताई गई दवाइयां समय पर लेना बहुत महत्वपूर्ण है।';
      }
      return 'High Blood Pressure (Hypertension) occurs when the force of blood against your artery walls is consistently higher than normal (typically above 120/80 mmHg). Lifestyle measures include reducing dietary sodium, 30 minutes of daily physical activity, avoiding smoking, and strictly taking prescribed antihypertensives under clinical supervision.';
    }

    // Questions to ask doctor
    if (q.includes('question') || q.includes('ask') || q.includes('सवाल') || q.includes('प्रश्न')) {
      if (lang === 'mr') {
        return 'डॉक्टरांना विचारण्यासाठी महत्त्वाचे प्रश्न:\n1. माझ्या लक्षणांचे मुख्य कारण काय आहे?\n2. मला हे औषध किती दिवस आणि केव्हा घ्यावे लागेल?\n3. काही अन्न किंवा पथ्य पाळण्याची गरज आहे का?\n4. मला पुन्हा कधी फॉलो-अप तपासणीसाठी यावे लागेल?';
      } else if (lang === 'hi') {
        return 'डॉक्टर परामर्श के लिए मुख्य सवाल:\n1. मेरे लक्षणों का संभावित कारण क्या है?\n2. मुझे यह दवा कब और कितने समय तक लेनी होगी?\n3. क्या मुझे भोजन या व्यायाम में कोई विशेष परहेज करना है?\n4. क्या मुझे कोई जांच (ब्लड टेस्ट/एक्स-रे) करवानी चाहिए?';
      }
      return 'Productive questions for your doctor consultation:\n1. What is the likely cause of my current symptoms?\n2. What is the intended effect of each prescribed medication, and what are common side effects?\n3. Are there specific dietary restrictions or physical limits I should follow?\n4. When should I return for a follow-up visit or order repeat lab tests?';
    }

    // Prescriptions in Safe Meds
    if (q.includes('prescription') || q.includes('upload') || q.includes('पर्चा') || q.includes('प्रिस्क्रिप्शन')) {
      if (lang === 'mr') {
        return 'सेफ मेड्समध्ये प्रिस्क्रिप्शन कसे अपलोड करावे:\n1. डाव्या मेनूमधून "Prescriptions" वर जा.\n2. ५ MB पर्यंतची JPG, PNG किंवा PDF फाईल निवडा.\n3. रुग्णाचे नाव व टीप जोडून सबमिट करा.\n४. कॉलेज डेमोसाठी Admin Demo मधून तत्काळ मंजुरीची चाचणी घेता येते.';
      } else if (lang === 'hi') {
        return 'सेफ मेड्स में पर्चा अपलोड करने के चरण:\n1. साइड मेनू में "Prescriptions" पर क्लिक करें।\n2. अपने फोन से पर्चे की 5MB तक की फोटो या PDF चुनें।\n3. नाम दर्ज करें और सहमति चेकबॉक्स टिक करें।\n4. कॉलेज प्रेजेंटेशन के दौरान Admin Demo से एक क्लिक में इसे "Approved in Demo" किया जा सकता है।';
      }
      return 'How to upload prescriptions in Safe Meds:\n1. Navigate to the "Prescriptions" section from the sidebar or header.\n2. Select your doctor prescription file (JPG, PNG, or PDF up to 5MB).\n3. Enter the patient full name and pharmacist notes, then submit.\n4. In this college demo, evaluators can test instant approvals using the "One-Click Approve in Admin Demo" button!';
    }

    // Default general response
    if (lang === 'mr') {
      return 'मी आपल्या प्रश्नाची नोंद घेतली आहे. निरोगी जीवनशैलीसाठी पुरेसे पाणी पिणे, समतोल आहार घेणे, दररोज ७-८ तास झोप घेणे आणि वेळोवेळी आरोग्य तपासणी करणे फायदेशीर ठरते. वैयक्तिक औषधोपचारासाठी कृपया नोंदणीकृत डॉक्टरांशी संपर्क साधा.';
    } else if (lang === 'hi') {
      return 'मैंने आपका प्रश्न नोट कर लिया है। सामान्य स्वास्थ्य के लिए पर्याप्त पानी पीना, संतुलित आहार लेना, 7-8 घंटे की नींद और नियमित स्वास्थ्य जांच जरूरी है। किसी भी दवा को शुरू करने से पहले योग्य डॉक्टर से परामर्श अवश्य लें।';
    }
    return 'Thank you for your question. As an educational healthcare assistant, I recommend maintaining adequate hydration, balanced nutrition, 7-8 hours of restful sleep, and regular preventative checkups. For specific medical diagnoses or medication changes, always consult a certified medical practitioner.';
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getEducationalResponse(text, language);
      const botMsg = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold mb-2 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Aarogya AI Healthcare Guide</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Healthcare Assistant
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
              Accessible wellness education, medical terminology explanation, and appointment preparation in English, Hindi, and Marathi.
            </p>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs p-1 rounded-2xl border border-white/20 self-start sm:self-center">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिंदी' },
              { code: 'mr', label: 'मराठी' }
            ].map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  language === l.code
                    ? 'bg-white text-teal-950 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Notice Callout (Strict Clinical Guardrail) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-amber-900">Important Medical AI Guardrails</p>
          <p className="leading-relaxed">
            Aarogya AI provides general health information only. It is <strong>NOT a licensed physician</strong>, does <strong>not diagnose</strong> conditions, and <strong>cannot prescribe medicines</strong> or dispatch ambulances. In an emergency in India, immediately dial <strong>112</strong>.
          </p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-gradient-to-br from-teal-800 to-slate-900 text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[82%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isUser
                      ? 'bg-teal-700 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                  <span
                    className={`block text-[10px] mt-1.5 font-medium ${
                      isUser ? 'text-teal-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-teal-800 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs text-slate-500 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1">Formulating educational explanation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-slate-100/70 border-t border-slate-200 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Suggested:
          </span>
          {presetPrompts.map((p, idx) => {
            const promptText = p[language] || p.en;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(promptText)}
                className="px-3 py-1 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {promptText}
              </button>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'आरोग्य संज्ञा किंवा सेफ मेड्सबद्दल विचारा...'
                  : language === 'hi'
                  ? 'स्वास्थ्य संबंधी सवाल या सेफ मेड्स फीचर्स पूछें...'
                  : 'Ask about health terms, doctor questions, or Safe Meds...'
              }
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Client Educational Mode (Secure Proxy Ready)</span>
            <span>Zero private data leaked to external servers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
