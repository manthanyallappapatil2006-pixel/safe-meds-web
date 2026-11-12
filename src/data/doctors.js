
// Safe Meds – Indian Doctor Directory
// 1,000 fictional academic demonstration profiles.
// 100 sample profiles in each of 10 specialties.
// These are NOT real or verified medical practitioners.

const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Rohan',
  'Rahul', 'Karan', 'Vivek', 'Amit', 'Akash',
  'Siddharth', 'Nikhil', 'Sagar', 'Omkar', 'Sai',
  'Naveen', 'Varun', 'Karthik', 'Aravind', 'Suresh',
  'Meera', 'Isha', 'Sneha', 'Pooja', 'Kavita',
  'Nisha', 'Riya', 'Neha', 'Aditi', 'Prajakta',
  'Vaishnavi', 'Rutuja', 'Kavya', 'Ananya', 'Divya',
  'Lakshmi', 'Priya', 'Sravani', 'Meenakshi', 'Anjali'
];

const lastNames = [
  'Sharma', 'Verma', 'Kapoor', 'Malhotra', 'Mehta',
  'Patil', 'Deshmukh', 'Kulkarni', 'Joshi', 'Shah',
  'Desai', 'Pawar', 'Jadhav', 'Shinde', 'Rao',
  'Reddy', 'Naidu', 'Shetty', 'Gowda', 'Hegde',
  'Nair', 'Iyer', 'Krishnan', 'Kumar', 'Subramanian'
];



const specialties = [
  {
    name: 'General Physician',
    qualification: 'MBBS, MD (General Medicine)',
    experience: 10,
    fee: 500,
    bio: 'Fictional sample profile for general healthcare and routine consultations.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Cardiologist',
    qualification: 'MBBS, MD, DM (Cardiology)',
    experience: 14,
    fee: 1000,
    bio: 'Fictional sample profile for cardiovascular consultation demonstrations.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 9,
    fee: 700,
    bio: 'Fictional sample profile for dermatology consultation demonstrations.',
    image: 'https://images.unsplash.com/photo-1594824813633-87999a0a030f?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 12,
    fee: 600,
    bio: 'Fictional sample profile for pediatric consultation demonstrations.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Orthopedic Specialist',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 15,
    fee: 900,
    bio: 'Fictional sample profile for orthopedic consultation demonstrations.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Gynecologist',
    qualification: 'MBBS, MS (Obstetrics & Gynecology)',
    experience: 11,
    fee: 800,
    bio: 'Fictional sample profile for women’s health consultation demonstrations.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Dentist',
    qualification: 'BDS, MDS',
    experience: 8,
    fee: 450,
    bio: 'Fictional sample profile for dental consultation demonstrations.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Ophthalmologist',
    qualification: 'MBBS, MS (Ophthalmology)',
    experience: 10,
    fee: 550,
    bio: 'Fictional sample profile for eye care consultation demonstrations.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'ENT Specialist',
    qualification: 'MBBS, MS (ENT)',
    experience: 13,
    fee: 650,
    bio: 'Fictional sample profile for ENT consultation demonstrations.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Neurologist',
    qualification: 'MBBS, MD, DM (Neurology)',
    experience: 16,
    fee: 1100,
    bio: 'Fictional sample profile for neurology consultation demonstrations.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300'
  }
];

const availableSlots = [
  ['09:30 AM', '11:00 AM', '02:30 PM', '04:30 PM'],
  ['10:00 AM', '12:00 PM', '03:30 PM', '05:30 PM'],
  ['09:00 AM', '11:30 AM', '02:00 PM', '06:00 PM']
];
export const indianCitiesList = [
  'All Cities',

  // Andhra Pradesh
  'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
  'Tirupati', 'Rajamahendravaram', 'Kakinada', 'Anantapur', 'Eluru',

  // Arunachal Pradesh
  'Itanagar', 'Naharlagun', 'Pasighat', 'Namsai',

  // Assam
  'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon',
  'Tinsukia', 'Tezpur', 'Bongaigaon',

  // Bihar
  'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia',
  'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar',

  // Chhattisgarh
  'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon',
  'Jagdalpur', 'Ambikapur',

  // Goa
  'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda',

  // Gujarat
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
  'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari',

  // Haryana
  'Faridabad', 'Gurugram (Gurgaon)', 'Panipat', 'Ambala',
  'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula',

  // Himachal Pradesh
  'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Bilaspur', 'Una',

  // Jharkhand
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City',
  'Deoghar', 'Hazaribagh', 'Giridih',

  // Karnataka
  'Bengaluru (Bangalore)', 'Hubballi-Dharwad', 'Mysore',
  'Mangaluru (Mangalore)', 'Belagavi', 'Kalaburagi',
  'Davanagere', 'Ballari', 'Shivamogga', 'Tumakuru',

  // Kerala
  'Thiruvananthapuram (Trivandrum)', 'Kochi (Cochin)',
  'Kozhikode (Calicut)', 'Kollam', 'Thrissur', 'Alappuzha',
  'Palakkad', 'Kannur', 'Kottayam',

  // Madhya Pradesh
  'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain',
  'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa',

  // Maharashtra
  'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Pimpri-Chinchwad',
  'Nashik', 'Kalyan-Dombivli', 'Vasai-Virar',
  'Aurangabad (Chhatrapati Sambhajinagar)', 'Navi Mumbai',
  'Solapur', 'Amravati', 'Kolhapur',

  // Manipur
  'Imphal', 'Thoubal', 'Kakching',

  // Meghalaya
  'Shillong', 'Tura', 'Jowai',

  // Mizoram
  'Aizawl', 'Lunglei', 'Champhai',

  // Nagaland
  'Dimapur', 'Kohima', 'Mokokchung',

  // Odisha
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur',
  'Sambalpur', 'Puri', 'Balasore',

  // Punjab
  'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala',
  'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot',

  // Rajasthan
  'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer',
  'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar',

  // Sikkim
  'Gangtok', 'Namchi', 'Geyzing',

  // Tamil Nadu
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli',
  'Salem', 'Tiruppur', 'Erode', 'Vellore',
  'Tirunelveli', 'Thoothukudi',

  // Telangana
  'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam',
  'Karimnagar', 'Ramagundam', 'Mahbubnagar',

  // Tripura
  'Agartala', 'Dharmanagar', 'Udaipur',

  // Uttar Pradesh
  'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut',
  'Varanasi', 'Prayagraj (Allahabad)', 'Bareilly',
  'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur',
  'Noida', 'Firozabad', 'Jhansi',

  // Uttarakhand
  'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani',
  'Rudrapur', 'Kashipur',

  // West Bengal
  'Kolkata', 'Howrah', 'Asansol', 'Siliguri',
  'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Kharagpur'
];

const cities = indianCitiesList
  .filter((city) => city !== 'All Cities')
  .map((city) => ({
    name: city,
    language: 'English',
    area: 'Sample demo area'
  }));
// Generate one fictional demo doctor for every
// specialty in every city.
export const initialDoctors = specialties.flatMap(
  (specialty, specialtyIndex) =>
    cities.map((cityInfo, cityIndex) => {
      const globalIndex =
        specialtyIndex * cities.length + cityIndex;

      const firstName =
        firstNames[Math.floor(globalIndex / lastNames.length) % firstNames.length];

      const lastName =
        lastNames[globalIndex % lastNames.length];

      const fee = specialty.fee + (cityIndex % 6) * 50;

      return {
        id: `DOC-DEMO-${specialtyIndex + 1}-${String(cityIndex + 1).padStart(3, '0')}`,
        name: `Dr. ${firstName} ${lastName}`,
        specialty: specialty.name,
        qualification: specialty.qualification,
        experience: `${specialty.experience + (cityIndex % 8)} years experience`,
        registrationNumber: 'SAMPLE DEMO RECORD – NOT VERIFIED',
        hospitalName: `Safe Meds Demo Clinic – ${cityInfo.name}`,
        city: cityInfo.name,
        clinicAddress: `Sample clinic location, ${cityInfo.area}, ${cityInfo.name} (Demo only)`,
        consultationTypes:
          cityIndex % 2 === 0
            ? ['In-person consultation', 'Online consultation']
            : ['In-person consultation'],
        consultationFee: Number(fee),
        availableSlots: availableSlots[cityIndex % availableSlots.length],
        image: `https://randomuser.me/api/portraits/${globalIndex % 2 === 0 ? 'men' : 'women'}/${Math.floor(globalIndex / 2) % 100}.jpg`,
        rating: Number((4.5 + (cityIndex % 5) * 0.1).toFixed(1)),
        reviewsCount: 25 + (cityIndex % 50),
        sampleAvailability:
          cityIndex % 2 === 0 ? 'Available Today' : 'Available Tomorrow',
        languages: ['English', 'Hindi', cityInfo.language],
        phone: '',
        verificationStatus: 'Sample Demo Profile',
        bio: specialty.bio
      };
    })
);

export const specialtiesList = [
  'All Specialties',
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic Specialist',
  'Gynecologist',
  'Dentist',
  'Ophthalmologist',
  'ENT Specialist',
  'Neurologist'
];

export const languagesList = [
  'All Languages',
  'English',
  'Marathi',
  'Hindi',
  'Kannada',
  'Telugu',
  'Tamil'
];
