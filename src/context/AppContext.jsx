import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

import {
    defaultUser,
    defaultAddresses,
    defaultEmergencyContacts,
    defaultAppointments,
    defaultOrders,
    defaultPrescriptions,
    defaultEmergencyHistory,
    defaultNotifications,
    defaultFamilyMembers,
    defaultMedicineReminders,
    defaultHealthRecords,
} from '../data/initialData';
import { initialMedicines, pharmacyInventory } from '../data/medicines';
import { initialDoctors } from '../data/doctors';
import { initialPharmacies } from '../data/pharmacies';
import { isSupabaseConfigured } from '../services/supabase';
import { getTranslation } from '../utils/translations';
const AppContext = createContext(null);

const STORAGE_KEYS = {
    LANGUAGE: 'safemeds_language',
    SAVED_MEDICINES: 'safemeds_saved_medicines',
    USER: 'safemeds_user',
    CART: 'safemeds_cart',
    APPOINTMENTS: 'safemeds_appointments',
    DISCOUNT: 'safemeds_discount',
};

export const AppProvider = ({ children }) => {
    // ─── User / Auth state ───────────────────────────────────────
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.USER);
            return saved ? JSON.parse(saved) : null;
        } catch (_) {
            return null;
        }
    });

    // ─── Language state ──────────────────────────────────────────
    const [language, setLanguageState] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
            return saved && ['en', 'hi', 'mr'].includes(saved) ? saved : 'en';
        } catch (_) {
            return 'en';
        }
    });

    const setLanguage = useCallback((lang) => {
        const valid = ['en', 'hi', 'mr'].includes(lang) ? lang : 'en';
        setLanguageState(valid);
        try {
            localStorage.setItem(STORAGE_KEYS.LANGUAGE, valid);
        } catch (_) {
            // ignore
        }
    }, []);

    const t = useCallback((key, fallback) => {
        return getTranslation(language, key, fallback);
    }, [language]);

    // ─── Toast state ─────────────────────────────────────────────
    const [toast, setToast] = useState(null);
    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type, id: Date.now() });
        setTimeout(() => setToast(null), 3800);
    }, []);

    // ─── Core data state ─────────────────────────────────────────
    const [appointments, setAppointments] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
            return saved ? JSON.parse(saved) : defaultAppointments;
        } catch (_) {
            return defaultAppointments;
        }
    });
    const [orders, setOrders] = useState(defaultOrders);
    const [medicines, setMedicines] = useState(initialMedicines);
    const [doctors, setDoctors] = useState(initialDoctors);
   const [pharmacies, setPharmacies] = useState(() => {
    try {
        const savedPharmacies = localStorage.getItem('safemeds_pharmacies');

        return savedPharmacies
            ? JSON.parse(savedPharmacies)
            : initialPharmacies;
    } catch (error) {
        return initialPharmacies;
    }
});
useEffect(() => {
    try {
        localStorage.setItem(
            'safemeds_pharmacies',
            JSON.stringify(pharmacies)
        );
    } catch (error) {
        console.error('Failed to save pharmacies:', error);
    }
}, [pharmacies]);
    const [inventory, setInventory] = useState(() => {
    try {
        const savedInventory = localStorage.getItem('safemeds_pharmacy_inventory');

        return savedInventory
            ? JSON.parse(savedInventory)
            : pharmacyInventory.map((item) => ({ ...item }));
    } catch (error) {
        return pharmacyInventory.map((item) => ({ ...item }));
    }
});
useEffect(() => {
    try {
        localStorage.setItem(
            'safemeds_pharmacy_inventory',
            JSON.stringify(inventory)
        );
    } catch (error) {
        console.error('Failed to save pharmacy inventory:', error);
    }
}, [inventory]);
  
    // ─── Cart state (non-medication supplies only) ───────────────
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.CART);
            return saved ? JSON.parse(saved) : [];
        } catch (_) {
            return [];
        }
    });

    // ─── Saved medicines (informational reference list) ──────────
    const [savedMedicines, setSavedMedicines] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.SAVED_MEDICINES);
            return saved ? JSON.parse(saved) : [];
        } catch (_) {
            return [];
        }
    });

   const [prescriptions, setPrescriptions] = useState(() => {
    try {
        const saved = localStorage.getItem('safemeds_prescriptions');
        return saved ? JSON.parse(saved) : defaultPrescriptions;
    } catch (_) {
        return defaultPrescriptions;
    }
});
    const [emergencyHistory, setEmergencyHistory] = useState(() => {
    try {
        const savedHistory = localStorage.getItem('safemeds_emergency_history');
        return savedHistory ? JSON.parse(savedHistory) : defaultEmergencyHistory;
    } catch (error) {
        console.error('Failed to load emergency history:', error);
        return defaultEmergencyHistory;
    }
});
  const [emergencyContacts, setEmergencyContacts] = useState(defaultEmergencyContacts);
useEffect(() => {
    try {
        localStorage.setItem(
            'safemeds_emergency_history',
            JSON.stringify(emergencyHistory)
        );
    } catch (error) {
        console.error('Failed to save emergency history:', error);
    }
}, [emergencyHistory]);
    const [notifications, setNotifications] = useState(defaultNotifications);
    const [addresses, setAddresses] = useState(defaultAddresses);
    const [familyMembers, setFamilyMembers] = useState(defaultFamilyMembers);
    const [medicineReminders, setMedicineReminders] = useState(defaultMedicineReminders);
    const [healthRecords, setHealthRecords] = useState(defaultHealthRecords);

    // Coupon discount state
    const [discountCode, setDiscountCode] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.DISCOUNT);
            if (!saved) return '';
            return JSON.parse(saved).code || '';
        } catch (_) {
            return '';
        }
    });
    const [discountPercent, setDiscountPercent] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.DISCOUNT);
            if (!saved) return 0;
            return Number(JSON.parse(saved).percent) || 0;
        } catch (_) {
            return 0;
        }
    });

    // Sync to localStorage
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            } else {
                localStorage.removeItem(STORAGE_KEYS.USER);
            }
        } catch (_) {}
    }, [user]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        } catch (_) {}
    }, [cart]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.DISCOUNT, JSON.stringify({ code: discountCode, percent: discountPercent }));
        } catch (_) {}
    }, [discountCode, discountPercent]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.SAVED_MEDICINES, JSON.stringify(savedMedicines));
        } catch (_) {}
    }, [savedMedicines]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
        } catch (_) {}
    }, [appointments]);
    useEffect(() => {
    try {
        localStorage.setItem(
            'safemeds_prescriptions',
            JSON.stringify(prescriptions)
        );
    } catch (_) {}
}, [prescriptions]);
    // Sync appointments when another browser tab updates localStorage
useEffect(() => {
    const handleStorageChange = (event) => {
        if (event.key === STORAGE_KEYS.APPOINTMENTS && event.newValue) {
            try {
                const updatedAppointments = JSON.parse(event.newValue);
                setAppointments(updatedAppointments);
            } catch (error) {
                console.error('Failed to sync appointments:', error);
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
}, []);

    // ─── Auth actions ────────────────────────────────────────────
    const login = (userData) => {
        setUser(userData);
    };

    const guestLogin = () => {
        setUser({
            id: 'guest-demo',
            name: 'Guest User',
            email: 'guest@demo.local',
            phone: '+91 98765 43210',
            city: 'New Delhi',
            isGuest: true,
        });
        showToast('Logged in as Guest user (demo session).', 'info');
    };

    const updateProfile = (profileData) => {
        setUser((prev) => ({
            ...(prev || {}),
            ...profileData,
        }));
        showToast('Profile updated successfully!', 'success');
    };

    const logout = async () => {
        const { authService } = await import('../services/supabase');
        try {
            await authService.signOut();
        } catch (_) {
            // non-fatal
        }
        setUser(null);
        setCart([]);
        try {
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.CART);
        } catch (_) {}
        showToast('You have been signed out.', 'info');
    };

    // ─── Cart actions (safe math & quantity management) ─────────
    const addToCart = (item, quantity = 1) => {
        if (!item || !item.id) return;
        const safeQty = Math.max(1, Math.floor(Number(quantity) || 1));
        const normalizedPrice = Number(item.indicativePrice ?? item.price) || 0;
        setCart((currentCart) => {
            const existingItem = currentCart.find(
    (cartItem) =>
        cartItem.id === item.id &&
        cartItem.pharmacyId === item.pharmacyId
);
            if (existingItem) {
                return currentCart.map((cartItem) =>
    cartItem.id === item.id &&
    cartItem.pharmacyId === item.pharmacyId
        ? {
            ...cartItem,
            quantity: (Number(cartItem.quantity) || 0) + safeQty,
            price: normalizedPrice
        }
        : cartItem
);
            }
            return [
                ...currentCart,
                {
                    ...item,
                    price: normalizedPrice,
                    indicativePrice: normalizedPrice,
                    quantity: safeQty,
                },
            ];
        });
        showToast(`${item.name || 'Item'} added to cart`, 'success');
    };

const removeFromCart = (itemId, pharmacyId) => {
    setCart((currentCart) =>
        currentCart.filter(
            (item) =>
                !(item.id === itemId && item.pharmacyId === pharmacyId)
        )
    );
};

const updateCartQuantity = (itemId, pharmacyId, quantity) => {
    const safeQuantity = Number(quantity);

    if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
        removeFromCart(itemId, pharmacyId);
        return;
    }

    setCart((currentCart) =>
        currentCart.map((item) =>
            item.id === itemId && item.pharmacyId === pharmacyId
                ? { ...item, quantity: Math.floor(safeQuantity) }
                : item
        )
    );
};

    const updateQuantity = updateCartQuantity; // alias

    const clearCart = () => setCart([]);

    // Cart calculations
    const cartSubtotal = useMemo(() => {
        if (!Array.isArray(cart) || cart.length === 0) return 0;
        return cart.reduce((sum, item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            return sum + price * qty;
        }, 0);
    }, [cart]);

    const deliveryFee = useMemo(() => {
        if (!Array.isArray(cart) || cart.length === 0) return 0;
        return cartSubtotal >= 500 ? 0 : 49;
    }, [cart, cartSubtotal]);

    const discountAmount = useMemo(() => {
        if (discountPercent <= 0) return 0;
        return Math.round((cartSubtotal * discountPercent) / 100);
    }, [cartSubtotal, discountPercent]);

    const cartTotal = useMemo(() => {
        if (!Array.isArray(cart) || cart.length === 0) return 0;
        return Math.max(0, cartSubtotal - discountAmount + deliveryFee);
    }, [cart, cartSubtotal, discountAmount, deliveryFee]);

    const hasPrescriptionItems = useMemo(() => {
        if (!Array.isArray(cart)) return false;
        return cart.some((item) => item.requiresPrescription === true);
    }, [cart]);

    const applyDiscount = (code) => {
        const normalized = (code || '').trim().toUpperCase();
        if (!normalized) {
            setDiscountCode('');
            setDiscountPercent(0);
            return;
        }
        if (normalized === 'SAFEMEDS10') {
            setDiscountCode('SAFEMEDS10');
            setDiscountPercent(10);
            showToast('Coupon SAFEMEDS10 applied! 10% off', 'success');
        } else if (normalized === 'HEALTH20') {
            setDiscountCode('HEALTH20');
            setDiscountPercent(20);
            showToast('Coupon HEALTH20 applied! 20% off', 'success');
        } else if (normalized === 'WELCOME') {
            setDiscountCode('WELCOME');
            setDiscountPercent(15);
            showToast('Coupon WELCOME applied! 15% off', 'success');
        } else {
            showToast('Invalid or expired coupon code.', 'error');
        }
    };

    // ─── Saved Medicines (Informational Reference List) ─────────
    const isMedicineSaved = useCallback((medicineId) => {
        return savedMedicines.some((m) => m.id === medicineId);
    }, [savedMedicines]);

    const toggleSaveMedicine = (medicine) => {
        if (!medicine || !medicine.id) return;
        setSavedMedicines((prev) => {
            const exists = prev.some((m) => m.id === medicine.id);
            if (exists) {
                showToast(`Removed "${medicine.name}" from personal reference list`, 'info');
                return prev.filter((m) => m.id !== medicine.id);
            } else {
                showToast(`Saved "${medicine.name}" to personal reference list for reference`, 'success');
                return [...prev, medicine];
            }
        });
    };

    const removeSavedMedicine = (medicineId) => {
        setSavedMedicines((prev) => prev.filter((m) => m.id !== medicineId));
        showToast('Removed from reference list', 'info');
    };

    // ─── Appointments actions ────────────────────────────────────
    const bookAppointment = (appointmentData) => {
        console.log(
    "BOOKING DOCTOR ID:",
    appointmentData.doctorId,
    appointmentData.doctor?.id
);
        const newApt = {
            id: `apt-${Date.now()}`,
            patientId: appointmentData.patientId || user?.id || null,
            doctorId: appointmentData.doctorId || appointmentData.doctor?.id || null,
            doctorName: appointmentData.doctorName || appointmentData.doctor?.name || appointmentData.doctor || 'Dr. Assigned',
            specialty: appointmentData.specialty || appointmentData.doctor?.specialty || 'General Physician',
            hospital: appointmentData.hospital || appointmentData.clinicName || appointmentData.doctor?.hospitalName || 'Safe Meds Partner Clinic',
            hospitalAddress: appointmentData.hospitalAddress || appointmentData.doctor?.clinicAddress || 'Sector 62, Noida, Uttar Pradesh',
            appointmentDate: appointmentData.appointmentDate || appointmentData.date || new Date().toISOString().split('T')[0],
            appointmentTime: appointmentData.appointmentTime || appointmentData.time || '10:00 AM',
            consultationType: appointmentData.consultationType || appointmentData.appointmentType || 'In-Person consultation',
            patientName: appointmentData.patientName || user?.name || 'Patient',
            patientPhone: appointmentData.patientPhone || appointmentData.contactNumber || user?.phone || '',
            patientAge: appointmentData.patientAge || 30,
            email: appointmentData.email || user?.email || '',
            symptoms: appointmentData.symptoms || appointmentData.reason || '',
            reason: appointmentData.reason || appointmentData.symptoms || '',
            fee: appointmentData.fee || appointmentData.doctor?.consultationFee || 500,
            status: 'Upcoming',
            createdAt: new Date().toISOString(),
        };

        setAppointments((prev) => [newApt, ...prev]);

        // Add a notification
        const aptNotification = {
            id: `notif-apt-${Date.now()}`,
            type: 'appointment',
            title: 'Appointment Scheduled',
            message: `Confirmed with ${newApt.doctorName} on ${newApt.appointmentDate} at ${newApt.appointmentTime}.`,
            timestamp: 'Just now',
            read: false,
        };
        setNotifications((prev) => [aptNotification, ...prev]);

        return newApt;
    };

    const cancelAppointment = (appointmentId, reason = 'User requested cancellation') => {
        setAppointments((prev) =>
            prev.map((apt) =>
                apt.id === appointmentId
                    ? { ...apt, status: 'Cancelled', cancellationReason: reason }
                    : apt
            )
        );
        showToast('Appointment cancelled successfully.', 'info');
    };

    const rescheduleAppointment = (appointmentId, newDate, newTime) => {
        setAppointments((prev) =>
            prev.map((apt) =>
                apt.id === appointmentId
                    ? { ...apt, appointmentDate: newDate, appointmentTime: newTime, status: 'Rescheduled' }
                    : apt
            )
        );
        showToast(`Appointment rescheduled to ${newDate} at ${newTime}`, 'success');
    };

    // ─── Orders actions ──────────────────────────────────────────
    const placeOrder = (orderData) => {
        const newOrder = {
            id: `ORD-${Date.now().toString().slice(-6)}`,
            createdAt: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
            deliveryDate: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
            items: [...cart],
            subtotal: cartSubtotal,
            deliveryFee: deliveryFee,
            discount: discountAmount,
            totalAmount: cartTotal,
            paymentMethod: orderData.paymentMethod || 'UPI / Cash on Delivery',
            deliveryAddress: orderData.deliveryAddress || addresses[0]?.addressLine || 'Home Delivery',
            pharmacyName: orderData.pharmacyName || 'Apollo Pharmacy, Sector 62',
            demoStatus: 'Demo Order Placed',
            trackingSteps: [
                { title: 'Order Placed', time: 'Just now', completed: true },
                { title: 'Prescription Verified', time: 'Pending', completed: false },
                { title: 'Packed at Pharmacy', time: 'Pending', completed: false },
                { title: 'Out for Delivery', time: 'Pending', completed: false },
                { title: 'Delivered', time: 'Pending', completed: false },
            ],
        };

        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        setDiscountCode('');
        setDiscountPercent(0);

        // Add order notification
        const orderNotification = {
            id: `notif-ord-${Date.now()}`,
            type: 'order',
            title: 'Order Placed',
            message: `Order #${newOrder.id} has been placed successfully.`,
            timestamp: 'Just now',
            read: false,
        };
        setNotifications((prev) => [orderNotification, ...prev]);

        return newOrder;
    };

    const cancelOrder = (orderId, reason = 'Customer request') => {
        setOrders((prev) =>
            prev.map((ord) =>
                ord.id === orderId
                    ? { ...ord, demoStatus: 'Cancelled', cancelReason: reason }
                    : ord
            )
        );
        showToast('Order cancelled.', 'info');
    };

    const reorder = (orderId) => {
        const existing = orders.find((o) => o.id === orderId);
        if (existing && Array.isArray(existing.items)) {
            existing.items.forEach((item) => addToCart(item, item.quantity || 1));
            showToast('Items from previous order added to cart.', 'success');
        }
    };

    // ─── Prescriptions actions ───────────────────────────────────
    
const submitPrescription = (rxData) => {
    const isDoctorIssued = rxData.type === 'doctor-issued';

    const newRx = {
        id: `rx-${Date.now()}`,
        createdAt: new Date().toISOString(),

        date: new Date().toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }),

        type: isDoctorIssued ? 'doctor-issued' : 'patient-uploaded',

        doctorId: rxData.doctorId || null,
        doctorName: rxData.doctorName || 'Doctor Prescription',

        patientId: isDoctorIssued
    ? (rxData.patientId || null)
    : (rxData.patientId || user?.id || null),
        patientName: rxData.patientName || user?.name || 'Patient',
        patientEmail: rxData.patientEmail || user?.email || '',

        appointmentId: rxData.appointmentId || null,

        fileName: rxData.fileName || (
            isDoctorIssued ? 'doctor_prescription' : 'prescription_upload.jpg'
        ),

        fileUrl: rxData.fileUrl || '',

        prescriptionDetails: rxData.prescriptionDetails || '',
        notes: rxData.notes || '',

        validUntil: new Date(Date.now() + 86400000 * 90).toLocaleDateString(
            'en-IN',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }
        ),

        demoStatus: isDoctorIssued
            ? 'Issued'
            : 'Submitted - Pending Review',

        reviewNote: isDoctorIssued
            ? 'Issued by doctor'
            : 'Pending pharmacist review',
    };

    setPrescriptions((prev) => [newRx, ...prev]);

    showToast(
        isDoctorIssued
            ? 'Prescription created successfully.'
            : 'Prescription submitted for pharmacist verification.',
        'success'
    );

    return newRx;
};
const updatePrescription = (prescriptionId, updates) => {
    const existingPrescription = prescriptions.find(
        (rx) => rx.id === prescriptionId
    );

    if (
        !existingPrescription ||
        existingPrescription.type !== 'doctor-issued' ||
        existingPrescription.doctorId !== user?.doctorId
    ) {
        return false;
    }

    setPrescriptions((prev) =>
        prev.map((rx) =>
            rx.id === prescriptionId
                ? {
                    ...rx,
                    prescriptionDetails: updates.prescriptionDetails,
                    notes: updates.notes,
                    updatedAt: new Date().toISOString(),
                }
                : rx
        )
    );

    return true;
};

    // ─── Emergency actions ───────────────────────────────────────
  
const createEmergencyRequest = (reqData) => {
    const newReq = {
        id: `EMG-${Date.now().toString().slice(-4)}`,
        category: reqData.category || 'General emergency',
        location: reqData.location || 'Current GPS Location',

        contactName: reqData.contactName || emergencyContacts[0]?.name || 'Primary Contact',

        emergencyContacts: emergencyContacts.map((contact) => ({
            id: contact.id,
            name: contact.name,
            phone: contact.phone,
            relationship: contact.relationship,
        })),

        status: 'Demo Request Created',
        createdAt: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        }),
        additionalNotes: reqData.additionalNotes || '',
    };

    setEmergencyHistory((prev) => [newReq, ...prev]);

    showToast('Emergency SOS alert recorded for both contacts!', 'error');

    return newReq;
};

const updateEmergencyRequestLocation = (requestId, location) => {
    setEmergencyHistory((prev) =>
        prev.map((request) =>
            request.id === requestId
                ? { ...request, location }
                : request
        )
    );
};


    const cancelEmergencyRequest = (reqId) => {
        setEmergencyHistory((prev) =>
            prev.map((r) => (r.id === reqId ? { ...r, status: 'Cancelled' } : r))
        );
        showToast('Emergency request cancelled.', 'info');
    };

    const advanceEmergencyStatus = (reqId, newStatus) => {
        setEmergencyHistory((prev) =>
            prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
        );
    };

    // ─── Notifications actions ───────────────────────────────────
    const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

    const markNotificationRead = (notificationId) => {
        setNotifications((current) =>
            current.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
    };

    const markAsRead = markNotificationRead; // alias

    const markAllAsRead = () => {
        setNotifications((current) => current.map((n) => ({ ...n, read: true })));
        showToast('All notifications marked as read', 'info');
    };

    const deleteNotification = (notificationId) => {
        setNotifications((current) => current.filter((n) => n.id !== notificationId));
    };

    // ─── Addresses actions ───────────────────────────────────────
    const addAddress = (addr) => {
        const newAddress = {
            id: `addr-${Date.now()}`,
            ...addr,
        };
        setAddresses((prev) => [...prev, newAddress]);
        showToast('Address added successfully.', 'success');
    };

    const updateAddress = (id, updated) => {
        setAddresses((prev) =>
            prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
        );
        showToast('Address updated.', 'success');
    };

    const deleteAddress = (id) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        showToast('Address deleted.', 'info');
    };

    // ─── Emergency Contacts actions ──────────────────────────────
    const addEmergencyContact = (contact) => {
        const newContact = {
            id: `emg-${Date.now()}`,
            ...contact,
        };
        setEmergencyContacts((prev) => [...prev, newContact]);
        showToast('Emergency contact added.', 'success');
    };

    const updateEmergencyContact = (id, updated) => {
        setEmergencyContacts((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
        );
        showToast('Emergency contact updated.', 'success');
    };

    const deleteEmergencyContact = (id) => {
        setEmergencyContacts((prev) => prev.filter((c) => c.id !== id));
        showToast('Emergency contact removed.', 'info');
    };

    // ─── Family Members actions ──────────────────────────────────
    const addFamilyMember = (member) => {
        const newMember = {
            id: `fam-${Date.now()}`,
            ...member,
        };
        setFamilyMembers((prev) => [...prev, newMember]);
        showToast('Family member added.', 'success');
    };

    const updateFamilyMember = (id, updated) => {
        setFamilyMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
        );
        showToast('Family profile updated.', 'success');
    };

    const deleteFamilyMember = (id) => {
        setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
        showToast('Family member profile removed.', 'info');
    };

    // ─── Medicine Reminders actions ──────────────────────────────
    const addMedicineReminder = (rem) => {
        const newRem = {
            id: `rem-${Date.now()}`,
            active: true,
            ...rem,
        };
        setMedicineReminders((prev) => [...prev, newRem]);
        showToast('Medicine reminder created.', 'success');
    };

    const updateMedicineReminder = (id, updated) => {
        setMedicineReminders((prev) =>
            prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
        );
        showToast('Medicine reminder updated.', 'success');
    };

    const deleteMedicineReminder = (id) => {
        setMedicineReminders((prev) => prev.filter((r) => r.id !== id));
        showToast('Medicine reminder deleted.', 'info');
    };

    const toggleReminderStatus = (id) => {
        setMedicineReminders((prev) =>
            prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
        );
    };

    const takeMedicineDose = (id) => {
        setMedicineReminders((prev) =>
            prev.map((r) =>
                r.id === id
                    ? {
                          ...r,
                          remainingDoses: Math.max(0, (r.remainingDoses || 1) - 1),
                          lastTaken: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      }
                    : r
            )
        );
        showToast('Dose recorded as taken.', 'success');
    };

    // ─── Health Records actions ──────────────────────────────────
    const addHealthRecord = (rec) => {
        const newRec = {
            id: `rec-${Date.now()}`,
            ...rec,
        };
        setHealthRecords((prev) => [newRec, ...prev]);
        showToast('Health record uploaded.', 'success');
    };

    const deleteHealthRecord = (id) => {
        setHealthRecords((prev) => prev.filter((r) => r.id !== id));
        showToast('Health record removed.', 'info');
    };

    // ─── Admin simulation actions ─────────────────────────────────
    const updateAppointmentStatus = (appointmentId, newStatus) => {
        setAppointments((current) =>
            current.map((apt) =>
                apt.id === appointmentId ? { ...apt, status: newStatus } : apt
            )
        );
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders((current) =>
            current.map((order) =>
                order.id === orderId ? { ...order, demoStatus: newStatus } : order
            )
        );
    };
    const updateInventoryItem = (medicineId, pharmacyId, updates) => {
    setInventory((currentInventory) =>
        currentInventory.map((item) =>
            item.medicineId === medicineId &&
            item.pharmacyId === pharmacyId
                ? { ...item, ...updates }
                : item
        )
    );
};
const addPharmacy = (pharmacyData) => {
    const newPharmacy = {
        ...pharmacyData,
        id: `PHARM-${Date.now()}`,
        isActive: true,
        rating: 0,
        verifiedSample: false,
    };

    setPharmacies((current) => [...current, newPharmacy]);
};

const updatePharmacy = (pharmacyId, updates) => {
    setPharmacies((current) =>
        current.map((pharmacy) =>
            pharmacy.id === pharmacyId
                ? { ...pharmacy, ...updates }
                : pharmacy
        )
    );
};

const togglePharmacyStatus = (pharmacyId) => {
    setPharmacies((current) =>
        current.map((pharmacy) =>
            pharmacy.id === pharmacyId
                ? { ...pharmacy, isActive: pharmacy.isActive === false }
                : pharmacy
        )
    );
};

    const updatePrescriptionStatus = (prescriptionId, newStatus, reviewNote) => {
        
        setPrescriptions((current) =>
            current.map((rx) =>
                rx.id === prescriptionId
                    ? { ...rx, demoStatus: newStatus, reviewNote: reviewNote || rx.reviewNote }
                    : rx
            )
        );
    };

    const resetDemoData = () => {
        setAppointments(defaultAppointments);
        setOrders(defaultOrders);
        setPrescriptions(defaultPrescriptions);
        setEmergencyHistory(defaultEmergencyHistory);
        setNotifications(defaultNotifications);
        setCart([]);
        setDiscountCode('');
        setDiscountPercent(0);
        setSavedMedicines([]);
        try {
            localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
            localStorage.removeItem(STORAGE_KEYS.CART);
            localStorage.removeItem(STORAGE_KEYS.DISCOUNT);
            localStorage.removeItem(STORAGE_KEYS.SAVED_MEDICINES);
        } catch (_) {}
        showToast('Demo data has been reset to factory defaults.', 'success');
    };

    // ─── Context value ────────────────────────────────────────────
    const value = {
        // Auth
        user,
        setUser,
        login,
        guestLogin,
        logout,
        updateProfile,

        // Language & Translation
        language,
        setLanguage,
        t,

        // Toast
        toast,
        setToast,
        showToast,

        // Data
        appointments,
        setAppointments,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        orders,
        setOrders,
        placeOrder,
        cancelOrder,
        reorder,
        medicines,
        setMedicines,
        savedMedicines,
        toggleSaveMedicine,
        isMedicineSaved,
        removeSavedMedicine,
        doctors,
        setDoctors,
        pharmacies,
setPharmacies,
addPharmacy,
updatePharmacy,
togglePharmacyStatus,
inventory,
updateInventoryItem,
        emergencyContacts,
        setEmergencyContacts,
        addEmergencyContact,
        updateEmergencyContact,
        deleteEmergencyContact,

        // Cart
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateQuantity,
        clearCart,
        cartSubtotal,
        deliveryFee,
        discountCode,
        discountPercent,
        discountAmount,
        cartTotal,
        hasPrescriptionItems,
        applyDiscount,

        // Prescriptions & records
        prescriptions,
        setPrescriptions,
        submitPrescription,
        updatePrescription,
        emergencyHistory,
        setEmergencyHistory,
        createEmergencyRequest,
        updateEmergencyRequestLocation,
        cancelEmergencyRequest,
        advanceEmergencyStatus,
        notifications,
        setNotifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addresses,
        setAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        familyMembers,
        setFamilyMembers,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        medicineReminders,
        setMedicineReminders,
        addMedicineReminder,
        updateMedicineReminder,
        deleteMedicineReminder,
        toggleReminderStatus,
        takeMedicineDose,
        healthRecords,
        setHealthRecords,
        addHealthRecord,
        deleteHealthRecord,

        // Admin simulation
        updateAppointmentStatus,
        updateOrderStatus,
        updatePrescriptionStatus,
        resetDemoData,

        // Supabase config flag
        isSupabaseConfigured,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
