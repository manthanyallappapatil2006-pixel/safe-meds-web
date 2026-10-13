-- ============================================================================
-- SAFE MEDS — PRODUCTION POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (SUPABASE)
-- ============================================================================
-- Domain: Healthcare Mobile Platform (India)
-- Tables: Profiles, Doctors, Clinics, Availability, Appointments, Pharmacies,
--         Medicines, Cart, Orders, Addresses, Emergency Contacts, Family,
--         Medicine Reminders, Health Records, Prescriptions, Support
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    city TEXT DEFAULT 'Delhi',
    profile_image_url TEXT,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'mr')),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCTORS & CLINICS
CREATE TABLE IF NOT EXISTS public.doctors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience_years INT NOT NULL,
    registration_number TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    city TEXT NOT NULL,
    clinic_address TEXT NOT NULL,
    consultation_types TEXT[] NOT NULL DEFAULT '{"In-person consultation"}',
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    available_slots TEXT[] NOT NULL,
    image_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.80,
    reviews_count INT DEFAULT 0,
    languages TEXT[] DEFAULT '{"English", "Hindi"}',
    verification_status TEXT DEFAULT 'Verified' CHECK (verification_status IN ('Verified', 'Pending Verification', 'Sample Demo Profile')),
    sample_availability TEXT DEFAULT 'Available Today',
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPOINTMENTS
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id TEXT REFERENCES public.doctors(id) ON DELETE RESTRICT,
    doctor_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    consultation_type TEXT NOT NULL,
    fee NUMERIC(10, 2) NOT NULL,
    reason TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Completed', 'Cancelled')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PHARMACIES
CREATE TABLE IF NOT EXISTS public.pharmacies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    operating_hours TEXT NOT NULL,
    delivery_areas TEXT[] NOT NULL,
    sample_availability TEXT DEFAULT 'Open Now',
    rating NUMERIC(3, 2) DEFAULT 4.70,
    phone TEXT,
    delivery_time TEXT DEFAULT '30-45 mins',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MEDICINES
CREATE TABLE IF NOT EXISTS public.medicines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    packaging TEXT NOT NULL,
    indicative_price NUMERIC(10, 2) NOT NULL,
    requires_prescription BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    sample_availability TEXT DEFAULT 'In Stock',
    dosage TEXT,
    manufacturer TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS & ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    pharmacy_id TEXT REFERENCES public.pharmacies(id),
    pharmacy_name TEXT NOT NULL,
    delivery_address JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    demo_status TEXT DEFAULT 'Demo Order Placed' CHECK (demo_status IN (
        'Demo Order Placed', 'Pharmacy Reviewing', 'Preparing Order', 'Out for Delivery', 'Delivered in Demo', 'Cancelled'
    )),
    prescription_status TEXT DEFAULT 'Not Required',
    delivery_partner JSONB,
    estimated_delivery TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    medicine_id TEXT REFERENCES public.medicines(id),
    name TEXT NOT NULL,
    indicative_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0)
);

-- 8. SAVED ADDRESSES
CREATE TABLE IF NOT EXISTS public.saved_addresses (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    house TEXT NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EMERGENCY CONTACTS
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT,
    phone TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FAMILY MEMBERS PROFILES
CREATE TABLE IF NOT EXISTS public.family_members (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    blood_group TEXT,
    age INT,
    date_of_birth DATE,
    allergies TEXT,
    chronic_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MEDICINE REMINDERS
CREATE TABLE IF NOT EXISTS public.medicine_reminders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    time_of_day TEXT NOT NULL,
    meal_timing TEXT DEFAULT 'After Food',
    frequency TEXT DEFAULT 'Daily',
    remaining_doses INT DEFAULT 30,
    refill_alert_threshold INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. HEALTH RECORDS ORGANIZER
CREATE TABLE IF NOT EXISTS public.health_records (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Lab Report', 'Prescription', 'Immunization', 'Discharge Summary', 'Doctor Note')),
    doctor_or_hospital TEXT,
    record_date DATE NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PRESCRIPTION VERIFICATION QUEUE
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    related_order_id TEXT,
    file_name TEXT NOT NULL,
    file_url TEXT,
    patient_name TEXT NOT NULL,
    notes TEXT,
    demo_status TEXT DEFAULT 'Pending Review' CHECK (demo_status IN ('Pending Review', 'Approved in Demo', 'Rejected in Demo')),
    review_note TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    link TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SUPPORT INQUIRIES
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public readable directories
CREATE POLICY "Public read doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Public read pharmacies" ON public.pharmacies FOR SELECT USING (true);
CREATE POLICY "Public read medicines" ON public.medicines FOR SELECT USING (true);

-- Admin management policies for catalogue
CREATE POLICY "Admin manage doctors" ON public.doctors FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage pharmacies" ON public.pharmacies FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage medicines" ON public.medicines FOR ALL USING (public.is_admin());

-- User Private Row Access Policies
CREATE POLICY "User profiles self" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "User appointments self" ON public.appointments FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User orders self" ON public.orders FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User order items self" ON public.order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "User addresses self" ON public.saved_addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User emergency contacts self" ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User family members self" ON public.family_members FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User medicine reminders self" ON public.medicine_reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User health records self" ON public.health_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User prescriptions self" ON public.prescriptions FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "User notifications self" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User support tickets self" ON public.support_tickets FOR ALL USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_doctors_city ON public.doctors(city);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON public.medicines(category);
CREATE INDEX IF NOT EXISTS idx_health_records_user ON public.health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_medicine_reminders_user ON public.medicine_reminders(user_id);
