
import { createContext, useContext, useState } from 'react';

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

import { isSupabaseConfigured } from '../services/supabase';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [appointments, setAppointments] = useState(
        defaultAppointments
    );
    const [orders, setOrders] = useState(defaultOrders);
    const [doctors, setDoctors] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [emergencyContacts, setEmergencyContacts] = useState(
        defaultEmergencyContacts
    );

    const [cart, setCart] = useState([]);
    const [prescriptions, setPrescriptions] = useState(
        defaultPrescriptions
    );
    const [emergencyHistory, setEmergencyHistory] = useState(
        defaultEmergencyHistory
    );
    const [notifications, setNotifications] = useState(
        defaultNotifications
    );
    const [addresses, setAddresses] = useState(defaultAddresses);
    const [familyMembers, setFamilyMembers] = useState(
        defaultFamilyMembers
    );
    const [medicineReminders, setMedicineReminders] = useState(
        defaultMedicineReminders
    );
    const [healthRecords, setHealthRecords] = useState(
        defaultHealthRecords
    );

    // Normal login: update the current demo or authenticated user.
    const login = (userData) => {
        setUser(userData);
    };

    // Guest login: allow the user to explore the demo.
    const guestLogin = () => {
        setUser({
            id: 'guest-demo',
            name: 'Guest User',
            email: 'guest@demo.local',
            phone: '',
            city: '',
            isGuest: true,
        });
    };

    const logout = () => {
        setUser(null);
        setCart([]);
    };

    const addToCart = (item) => {
        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (cartItem) => cartItem.id === item.id
            );

            if (existingItem) {
                return currentCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? {
                            ...cartItem,
                            quantity: (Number(cartItem.quantity) || 0) + 1,
                        }
                        : cartItem
                );
            }

            return [...currentCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart((currentCart) =>
            currentCart.filter((item) => item.id !== itemId)
        );
    };

    const updateCartQuantity = (itemId, quantity) => {
        const safeQuantity = Number(quantity);

        if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart((currentCart) =>
            currentCart.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: safeQuantity }
                    : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const unreadNotificationsCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const markNotificationRead = (notificationId) => {
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const value = {
        user,
        setUser,
        login,
        guestLogin,
        logout,

        appointments,
        setAppointments,
        orders,
        setOrders,
        doctors,
        setDoctors,
        pharmacies,
        setPharmacies,
        emergencyContacts,
        setEmergencyContacts,

        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        prescriptions,
        setPrescriptions,
        emergencyHistory,
        setEmergencyHistory,
        notifications,
        setNotifications,
        unreadNotificationsCount,
        markNotificationRead,

        addresses,
        setAddresses,
        familyMembers,
        setFamilyMembers,
        medicineReminders,
        setMedicineReminders,
        healthRecords,
        setHealthRecords,

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
        throw new Error(
            'useApp must be used within an AppProvider'
        );
    }

    return context;
};
