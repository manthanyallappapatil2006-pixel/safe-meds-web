// Sample Medicine & Healthcare Product Dataset (demonstration data only)

export const initialMedicines = [
  // Fever and Pain Relief
  {
    id: 'MED-301',
    name: 'Paracetamol 650mg Tablets',
    category: 'Fever and Pain Relief',
    packaging: 'Strip of 15 tablets',
    indicativePrice: 35,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock',
    dosage: '650mg per tablet',
    manufacturer: 'HealthCore Labs',
    description: 'Relieves mild to moderate pain and helps reduce fever. Over-the-counter general relief for fever and body aches.'
  },
  {
    id: 'MED-302',
    name: 'Ibuprofen 400mg Softgels',
    category: 'Fever and Pain Relief',
    packaging: 'Pack of 10 capsules',
    indicativePrice: 65,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock',
    dosage: '400mg per capsule',
    manufacturer: 'ReliefPharma Ltd',
    description: 'Non-steroidal anti-inflammatory product for pain relief associated with headaches, muscle strains, and dental discomfort.'
  },
  {
    id: 'MED-303',
    name: 'Amoxicillin 500mg Antibiotic',
    category: 'Fever and Pain Relief',
    packaging: 'Strip of 10 capsules',
    indicativePrice: 120,
    requiresPrescription: true, // Requires RX!
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock (Prescription Required)',
    dosage: '500mg per capsule',
    manufacturer: 'Biogenics India',
    description: 'Broad-spectrum antibiotic for bacterial infections. Requires a qualified physician prescription review before order completion.'
  },

  // First Aid
  {
    id: 'MED-304',
    name: 'Complete Home First Aid Kit',
    category: 'First Aid',
    packaging: 'Standard Waterproof Box (42 items)',
    indicativePrice: 450,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock',
    dosage: 'Not applicable',
    manufacturer: 'CuraFirst Safety',
    description: 'Essential emergency kit containing sterile gauze bandages, adhesive strips, antiseptic wipes, burn gel, scissors, and micropore tape.'
  },
  {
    id: 'MED-305',
    name: 'Povidone Iodine Antiseptic Ointment 5%',
    category: 'First Aid',
    packaging: 'Tube of 20g',
    indicativePrice: 75,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock',
    dosage: '5% w/w topical',
    manufacturer: 'BioCure Pharma',
    description: 'Topical microbicidal solution for treatment of minor cuts, abrasions, burns, and wound disinfection.'
  },
  {
    id: 'MED-306',
    name: 'Sterile Elastic Crepe Bandage (10cm)',
    category: 'First Aid',
    packaging: 'Roll of 4 meters',
    indicativePrice: 110,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock',
    dosage: '10cm x 4m roll',
    manufacturer: 'OrthoWrap Safety',
    description: 'Provides firm pressure and compression support for joint sprains, tendon strains, and muscular swelling.'
  },

  // Personal Care
  {
    id: 'MED-307',
    name: 'Hydrating Gentle Skin Cleanser',
    category: 'Personal Care',
    packaging: 'Pump Bottle 250ml',
    indicativePrice: 320,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock',
    dosage: 'Topical Daily Wash',
    manufacturer: 'Dermacare Labs',
    description: 'Soap-free, hypoallergenic cleanser formulated for sensitive and dry skin types with ceramides and hyaluronic acid.'
  },
  {
    id: 'MED-308',
    name: 'Oral Electrolyte Rehydration Salts (ORS)',
    category: 'Personal Care',
    packaging: 'Pack of 5 sachets (21.8g each)',
    indicativePrice: 85,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock',
    dosage: 'WHO formulation standard',
    manufacturer: 'VitaHydrate',
    description: 'WHO-recommended rehydration formula to restore vital fluids and electrolytes lost due to dehydration or heat exhaustion.'
  },

  // General Healthcare
  {
    id: 'MED-309',
    name: 'Vitamin D3 60,000 IU Chewable Capsules',
    category: 'General Healthcare',
    packaging: 'Bottle of 8 capsules',
    indicativePrice: 190,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock',
    dosage: '60,000 IU weekly dose',
    manufacturer: 'SunVita Wellness',
    description: 'High-potency cholecalciferol supplement for maintaining healthy bone mineral density and immune resilience.'
  },
  {
    id: 'MED-310',
    name: 'Amlodipine 5mg Blood Pressure Tablets',
    category: 'General Healthcare',
    packaging: 'Strip of 30 tablets',
    indicativePrice: 95,
    requiresPrescription: true, // Requires RX!
    image: 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock (Prescription Required)',
    dosage: '5mg once daily',
    manufacturer: 'CardioCure Meds',
    description: 'Calcium channel blocker indicated for the clinical management of hypertension. Requires prescription verification.'
  },

  // Medical Supplies
  {
    id: 'MED-311',
    name: 'Digital Upper Arm Blood Pressure Monitor',
    category: 'Medical Supplies',
    packaging: 'Device Kit with Large Cuff',
    indicativePrice: 1450,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'Limited Stock',
    dosage: 'Oscillometric digital measuring',
    manufacturer: 'OmniHealth Tech',
    description: 'Automatic digital sphygmomanometer with memory recall for 90 readings, irregular heartbeat detection, and LCD display.'
  },
  {
    id: 'MED-312',
    name: 'Fingertip Pulse Oximeter with OLED Display',
    category: 'Medical Supplies',
    packaging: 'Device with Lanyard & 2x AAA',
    indicativePrice: 890,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300',
    sampleAvailability: 'In Stock',
    dosage: 'SpO2 & Pulse Rate Monitor',
    manufacturer: 'BioPulse Instruments',
    description: 'Non-invasive device for quick spot-checks of blood oxygen saturation (SpO2) and pulse rate levels.'
  }
];


// Pharmacy-specific inventory (sample data for development)
export const pharmacyInventory = [
  { medicineId: 'MED-301', pharmacyId: 'PHARM-201', price: 35, stock: 50 },
  { medicineId: 'MED-301', pharmacyId: 'PHARM-202', price: 38, stock: 30 },
  { medicineId: 'MED-301', pharmacyId: 'PHARM-203', price: 36, stock: 0 },

  { medicineId: 'MED-302', pharmacyId: 'PHARM-201', price: 65, stock: 25 },
  { medicineId: 'MED-302', pharmacyId: 'PHARM-202', price: 68, stock: 40 },

  { medicineId: 'MED-303', pharmacyId: 'PHARM-201', price: 120, stock: 15 },
  { medicineId: 'MED-303', pharmacyId: 'PHARM-203', price: 125, stock: 10 },

  { medicineId: 'MED-304', pharmacyId: 'PHARM-201', price: 450, stock: 12 },
  { medicineId: 'MED-304', pharmacyId: 'PHARM-202', price: 440, stock: 8 },

  { medicineId: 'MED-305', pharmacyId: 'PHARM-202', price: 75, stock: 20 },
  { medicineId: 'MED-305', pharmacyId: 'PHARM-204', price: 80, stock: 15 },

  { medicineId: 'MED-306', pharmacyId: 'PHARM-201', price: 110, stock: 18 },
  { medicineId: 'MED-306', pharmacyId: 'PHARM-205', price: 105, stock: 10 },

  { medicineId: 'MED-307', pharmacyId: 'PHARM-202', price: 320, stock: 14 },
  { medicineId: 'MED-307', pharmacyId: 'PHARM-204', price: 310, stock: 9 },

  { medicineId: 'MED-308', pharmacyId: 'PHARM-201', price: 85, stock: 40 },
  { medicineId: 'MED-308', pharmacyId: 'PHARM-203', price: 88, stock: 25 },

  { medicineId: 'MED-309', pharmacyId: 'PHARM-202', price: 190, stock: 16 },
  { medicineId: 'MED-309', pharmacyId: 'PHARM-204', price: 195, stock: 12 },

  { medicineId: 'MED-310', pharmacyId: 'PHARM-201', price: 95, stock: 20 },
  { medicineId: 'MED-310', pharmacyId: 'PHARM-203', price: 100, stock: 15 },

  { medicineId: 'MED-311', pharmacyId: 'PHARM-204', price: 1450, stock: 5 },
  { medicineId: 'MED-311', pharmacyId: 'PHARM-205', price: 1490, stock: 3 },

  { medicineId: 'MED-312', pharmacyId: 'PHARM-201', price: 890, stock: 7 },
  { medicineId: 'MED-312', pharmacyId: 'PHARM-205', price: 870, stock: 0 }
];


export const medicineCategories = [
  'All Categories',
  'Fever and Pain Relief',
  'First Aid',
  'Personal Care',
  'General Healthcare',
  'Medical Supplies'
];
