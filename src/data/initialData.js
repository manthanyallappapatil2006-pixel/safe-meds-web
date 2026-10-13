// Default demonstration dataset for Safe Meds prototype

export const defaultUser = {
  id: 'USR-801',
  name: 'Manthan Sharma',
  email: 'manthan.demo@safemeds.internal',
  phone: '9876543210',
  city: 'Noida',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  isGuest: false,
  preferredLanguage: 'English'
};

export const defaultAddresses = [
  {
    id: 'ADDR-1',
    label: 'Home',
    recipientName: 'Manthan Sharma',
    phone: '9876543210',
    house: 'Flat 402, Tower B, Blossom Greens',
    street: 'Sector 143B, Expressway',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pinCode: '201305',
    isDefault: true
  },
  {
    id: 'ADDR-2',
    label: 'College Campus / Work',
    recipientName: 'Manthan Sharma',
    phone: '9876543210',
    house: 'Tech Block 3, Student Project Hub',
    street: 'Knowledge Park III',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    pinCode: '201306',
    isDefault: false
  }
];

export const defaultEmergencyContacts = [
  {
    id: 'EMGC-1',
    name: 'Sunita Sharma (Mother)',
    relationship: 'Parent',
    phone: '9811223344',
    isPrimary: true
  },
  {
    id: 'EMGC-2',
    name: 'Rajesh Sharma (Father)',
    relationship: 'Parent',
    phone: '9822334455',
    isPrimary: false
  }
];

export const defaultAppointments = [
  {
    id: 'APT-1001',
    patientName: 'Manthan Sharma',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Ananya Sharma',
    specialty: 'General Physician',
    appointmentDate: '2026-10-14',
    appointmentTime: '11:00 AM',
    consultationType: 'In-person consultation',
    reason: 'Seasonal viral fever check-up and general fatigue consultation.',
    status: 'Upcoming',
    notes: 'Please bring recent CBC blood report if available.',
    fee: 499,
    createdAt: '2026-10-09'
  },
  {
    id: 'APT-1002',
    patientName: 'Manthan Sharma',
    doctorId: 'DOC-103',
    doctorName: 'Dr. Priya Nambiar',
    specialty: 'Dermatology',
    appointmentDate: '2026-09-22',
    appointmentTime: '04:00 PM',
    consultationType: 'Online consultation',
    reason: 'Seasonal allergy skin rash follow-up.',
    status: 'Completed',
    notes: 'Prescribed topical soothing gel and recommended mild cleanser.',
    fee: 600,
    createdAt: '2026-09-20'
  },
  {
    id: 'APT-1003',
    patientName: 'Manthan Sharma',
    doctorId: 'DOC-106',
    doctorName: 'Dr. Tanvi Mehta',
    specialty: 'Dentistry',
    appointmentDate: '2026-08-15',
    appointmentTime: '10:00 AM',
    consultationType: 'In-person consultation',
    reason: 'Routine dental scaling and cleaning.',
    status: 'Cancelled',
    notes: 'Cancelled due to college exam schedule.',
    fee: 400,
    createdAt: '2026-08-10'
  }
];

export const defaultOrders = [
  {
    id: 'ORD-5001',
    items: [
      {
        id: 'MED-301',
        name: 'Paracetamol 650mg Tablets',
        indicativePrice: 35,
        quantity: 2,
        packaging: 'Strip of 15 tablets',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'MED-304',
        name: 'Complete Home First Aid Kit',
        indicativePrice: 450,
        quantity: 1,
        packaging: 'Standard Waterproof Box',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300'
      }
    ],
    pharmacyId: 'PHARM-201',
    pharmacyName: 'Apollo Lifeline Chemist',
    deliveryAddress: {
      recipientName: 'Manthan Sharma',
      phone: '9876543210',
      house: 'Flat 402, Tower B, Blossom Greens',
      street: 'Sector 143B, Expressway',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pinCode: '201305'
    },
    subtotal: 520,
    deliveryFee: 30,
    discount: 50,
    total: 500,
    paymentMethod: 'Cash on Delivery (Demo)',
    demoStatus: 'Out for Delivery',
    prescriptionStatus: 'Not Required',
    deliveryPartner: {
      name: 'Ramesh Kumar (Demo Partner)',
      phone: '+91 98990 01122',
      vehicle: 'Two Wheeler (UP 16 AB 4040)'
    },
    estimatedDelivery: '30-45 mins (Simulated)',
    createdAt: '2026-10-10 13:30'
  },
  {
    id: 'ORD-5002',
    items: [
      {
        id: 'MED-309',
        name: 'Vitamin D3 60,000 IU Chewable Capsules',
        indicativePrice: 190,
        quantity: 1,
        packaging: 'Bottle of 8 capsules',
        image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300'
      }
    ],
    pharmacyId: 'PHARM-202',
    pharmacyName: 'MedPlus City Pharmacy',
    deliveryAddress: {
      recipientName: 'Manthan Sharma',
      phone: '9876543210',
      house: 'Flat 402, Tower B, Blossom Greens',
      street: 'Sector 143B, Expressway',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pinCode: '201305'
    },
    subtotal: 190,
    deliveryFee: 30,
    discount: 0,
    total: 220,
    paymentMethod: 'Simulated Online Payment',
    demoStatus: 'Delivered in Demo',
    prescriptionStatus: 'Not Required',
    deliveryPartner: {
      name: 'Sunil Verma (Demo Partner)',
      phone: '+91 98112 00334',
      vehicle: 'Electric Scooter (DL 4C 8821)'
    },
    estimatedDelivery: 'Delivered on 04 Oct 2026',
    createdAt: '2026-10-04 11:15'
  }
];

export const defaultPrescriptions = [
  {
    id: 'RX-901',
    relatedOrderId: 'ORD-5001',
    fileName: 'physician_prescription_dr_ananya.pdf',
    previewUrl: null,
    patientName: 'Manthan Sharma',
    notes: 'Prescribed dosage for seasonal flu and mild throat inflammation.',
    submittedAt: '2026-10-09 18:20',
    demoStatus: 'Approved in Demo',
    reviewNote: 'Simulated review: Approved for 1 strip of Paracetamol 650mg and First Aid kit.'
  },
  {
    id: 'RX-902',
    relatedOrderId: null,
    fileName: 'clinic_record_routine_check.jpg',
    previewUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300',
    patientName: 'Manthan Sharma',
    notes: 'Cardiologist prescription for blood pressure management.',
    submittedAt: '2026-10-10 10:00',
    demoStatus: 'Pending Review',
    reviewNote: 'Simulated pending state: Reviewer will verify doctor stamp in demo simulation.'
  }
];

export const defaultEmergencyHistory = [
  {
    id: 'EMG-701',
    category: 'Injury',
    location: 'Sector 62 Metro Station, Gate 2, Noida',
    additionalNotes: 'Simulated road ankle twist during evening commute.',
    emergencyContact: 'Sunita Sharma (Mother)',
    status: 'Demo Completed',
    createdAt: '2026-09-28 19:40',
    eta: 'Simulated response completed'
  }
];

export const defaultNotifications = [
  {
    id: 'NOTIF-1',
    title: 'Upcoming Appointment Reminder',
    message: 'You have a doctor consultation scheduled with Dr. Ananya Sharma on 14 Oct 2026 at 11:00 AM.',
    type: 'appointment',
    link: '/appointments',
    createdAt: '10 mins ago',
    read: false
  },
  {
    id: 'NOTIF-2',
    title: 'Order Out for Delivery (Demo)',
    message: 'Your Safe Meds order ORD-5001 is out for delivery with demo partner Ramesh Kumar.',
    type: 'order',
    link: '/orders/ORD-5001',
    createdAt: '1 hour ago',
    read: false
  },
  {
    id: 'NOTIF-3',
    title: 'Prescription Review Approved',
    message: 'Your uploaded prescription RX-901 has been marked as Approved in Demo simulation.',
    type: 'prescription',
    link: '/prescriptions',
    createdAt: 'Yesterday',
    read: true
  },
  {
    id: 'NOTIF-4',
    title: 'Emergency Contact Health Alert',
    message: 'Keep your emergency contacts updated in your profile for fast access during critical situations.',
    type: 'announcement',
    link: '/profile',
    createdAt: '3 days ago',
    read: true
  }
];

export const healthTips = [
  {
    id: 'TIP-1',
    title: 'Keeping Emergency Contacts Updated',
    summary: 'Ensure at least two reliable local contacts are saved with accurate mobile numbers in case of an emergency.',
    tag: 'Emergency Preparedness',
    readTime: '2 min read'
  },
  {
    id: 'TIP-2',
    title: 'Follow Certified Medical Guidance',
    summary: 'Never alter prescribed dosages or stop antibiotic cycles prematurely without consulting your registered medical practitioner.',
    tag: 'Medication Safety',
    readTime: '3 min read'
  },
  {
    id: 'TIP-3',
    title: 'Organize Your Prescriptions',
    summary: 'Store legible copies of prescriptions with doctor registration numbers and dates for seamless pharmacy dispensing.',
    tag: 'Records & Rx',
    readTime: '2 min read'
  },
  {
    id: 'TIP-4',
    title: 'Preparing for a Doctor Visit',
    summary: 'Write down symptoms, onset timeline, and existing medications before your consultation to make the session productive.',
    tag: 'Doctor Consult',
    readTime: '3 min read'
  },
  {
    id: 'TIP-5',
    title: 'Understanding Medicine Labels',
    summary: 'Carefully check expiry dates, storage instructions (cool dry place/refrigerated), and whether food is required before intake.',
    tag: 'Drug Awareness',
    readTime: '2 min read'
  }
];

export const faqsList = [
  {
    q: 'How do I book an appointment with a doctor?',
    a: 'Navigate to the Doctors section, select a specialty or search by doctor name, pick your preferred consultation type (In-person or Online), choose an available slot, and confirm the booking.'
  },
  {
    q: 'How does the prescription upload feature work?',
    a: 'Go to the Prescriptions tab or during checkout for prescription-only items. Upload a JPG, PNG, or PDF file (under 5MB). In this student demo, status changes can be simulated or approved from the Admin Demo dashboard.'
  },
  {
    q: 'Is the SOS Emergency feature connected to real ambulances?',
    a: 'No. Safe Meds is an academic college field prototype. It does not contact real emergency services or dispatch actual vehicles. In a genuine medical emergency, dial 112 immediately in India.'
  },
  {
    q: 'How can I test order tracking?',
    a: 'Place an order through the Cart and Checkout flow. Then open the Order Details page where you can inspect the interactive timeline and use the "Advance Demo Status" button to simulate each delivery milestone.'
  },
  {
    q: 'What is the Admin Demo Dashboard?',
    a: 'The Admin Demo tab (/admin-demo) is designed specifically for students and teachers to inspect sample statistics, approve or reject pending prescriptions, change appointment statuses, and reset demo data with a single click.'
  }
];

export const defaultFamilyMembers = [
  {
    id: 'FAM-01',
    name: 'Manthan Sharma (Self)',
    relationship: 'Self',
    bloodGroup: 'B+',
    age: 22,
    dateOfBirth: '2004-05-14',
    allergies: 'None reported',
    chronicConditions: 'None'
  },
  {
    id: 'FAM-02',
    name: 'Sunita Sharma',
    relationship: 'Mother',
    bloodGroup: 'O+',
    age: 48,
    dateOfBirth: '1978-08-20',
    allergies: 'Sulfa antibiotics',
    chronicConditions: 'Mild Hypertension (Managed)'
  },
  {
    id: 'FAM-03',
    name: 'Rajesh Sharma',
    relationship: 'Father',
    bloodGroup: 'B+',
    age: 52,
    dateOfBirth: '1974-03-11',
    allergies: 'Dust mites',
    chronicConditions: 'Type 2 Diabetes (Under medication)'
  }
];

export const defaultMedicineReminders = [
  {
    id: 'REM-101',
    medicineName: 'Amlodipine 5mg (BP)',
    dosage: '1 Tablet',
    timeOfDay: '08:30 AM',
    mealTiming: 'After Breakfast',
    frequency: 'Daily',
    remainingDoses: 18,
    refillAlertThreshold: 5,
    isActive: true
  },
  {
    id: 'REM-102',
    medicineName: 'Vitamin D3 60,000 IU',
    dosage: '1 Chewable Capsule',
    timeOfDay: '10:00 AM (Sunday)',
    mealTiming: 'After Meal',
    frequency: 'Weekly',
    remainingDoses: 3,
    refillAlertThreshold: 2,
    isActive: true
  },
  {
    id: 'REM-103',
    medicineName: 'Paracetamol 650mg',
    dosage: '1 Tablet as needed',
    timeOfDay: '02:00 PM',
    mealTiming: 'After Lunch',
    frequency: 'SOS / As needed',
    remainingDoses: 12,
    refillAlertThreshold: 4,
    isActive: false
  }
];

export const defaultHealthRecords = [
  {
    id: 'REC-201',
    title: 'Comprehensive Lipid Profile Report',
    category: 'Lab Report',
    doctorOrHospital: 'Dr. Lal PathLabs, Noida',
    recordDate: '2026-09-15',
    fileName: 'lipid_profile_test_sep2026.pdf',
    fileUrl: null,
    notes: 'Normal cholesterol and HDL levels. Triglycerides slightly elevated; recommended brisk morning walk.'
  },
  {
    id: 'REC-202',
    title: 'Consultation Prescription & Diet Advice',
    category: 'Prescription',
    doctorOrHospital: 'Dr. Ananya Sharma, Safe Meds Clinic',
    recordDate: '2026-08-28',
    fileName: 'prescription_dr_ananya_aug2026.pdf',
    fileUrl: null,
    notes: 'Prescribed seasonal fever medication and hydration salts. Follow-up after 10 days if symptoms persist.'
  },
  {
    id: 'REC-203',
    title: 'COVID-19 Booster Vaccination Certificate',
    category: 'Immunization',
    doctorOrHospital: 'Government District Hospital, Noida',
    recordDate: '2025-11-10',
    fileName: 'cowin_vaccination_certificate.pdf',
    fileUrl: null,
    notes: 'Precaution dose administered without adverse reactions.'
  }
];

