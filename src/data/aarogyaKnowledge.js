
/**
 * aarogyaKnowledge.js
 *
 * Central knowledge base for Aarogya AI.
 * Describes Safe Meds features, workflows, limitations and safety rules.
 *
 * This file contains application information only.
 * Never add real patient records, passwords, API keys or private tokens here.
 */

export const aarogyaKnowledge = {
  app: {
    name: 'Safe Meds',
    assistantName: 'Aarogya AI',
    description:
      'Safe Meds is a healthcare assistance platform that brings together doctor appointments, pharmacy information, medicine catalogues, prescriptions, medicine orders and emergency assistance features.',
    supportedLanguages: ['English', 'Hindi', 'Marathi'],
    purpose:
      'Help users navigate healthcare-related services and understand the features available on the Safe Meds website.',
  },

  userRoles: {
    patient: {
      description: 'A person using Safe Meds to access healthcare-related services.',
      capabilities: [
        'Browse doctor profiles.',
        'Book and view appointments.',
        'View and upload prescriptions.',
        'Browse pharmacies and medicines.',
        'Manage a medicine shopping cart.',
        'Place and view medicine orders.',
        'Manage their profile.',
        'Manage saved emergency contacts.',
        'Create a demonstration emergency request.',
      ],
    },

    doctor: {
      description: 'A doctor using the doctor dashboard.',
      capabilities: [
        'View relevant appointments.',
        'Manage appointment information.',
        'Issue prescriptions.',
        'Edit prescriptions.',
        'View relevant prescription information.',
      ],
    },

    admin: {
      description: 'An administrator who manages application information.',
      capabilities: [
        'Access the administration dashboard.',
        'Manage pharmacy information.',
        'Manage pharmacy activation status.',
        'Manage medicine inventory.',
        'Update medicine prices and stock information.',
      ],
    },
  },

  navigation: [
    {
      name: 'Home',
      purpose: 'View the Safe Meds home page.',
      route: '/home',
    },
    {
      name: 'Find Doctors',
      purpose: 'Browse doctor profiles and find doctors.',
      route: '/doctors',
    },
    {
      name: 'Appointments',
      purpose: 'View and manage appointment information.',
      route: '/appointments',
    },
    {
      name: 'Pharmacies',
      purpose: 'Browse pharmacy information.',
      route: '/pharmacies',
    },
    {
      name: 'Medicines',
      purpose: 'Browse available medicine catalogue items.',
      route: '/medicines',
    },
    {
      name: 'Prescriptions',
      purpose: 'View and upload prescription information.',
      route: '/prescriptions',
    },
    {
      name: 'Orders',
      purpose: 'View medicine order information.',
      route: '/orders',
    },
    {
      name: 'Reminders',
      purpose: 'Access the reminders section.',
      route: '/reminders',
    },
    {
      name: 'Family',
      purpose: 'Access family-related features.',
      route: '/family',
    },
    {
      name: 'Health Records',
      purpose: 'Access health record features.',
      route: '/health-records',
    },
    {
      name: 'AI Assistant',
      purpose: 'Access the AI assistant.',
      route: '/ai-assistant',
    },
    {
      name: 'Profile',
      purpose: 'Access profile information.',
      route: '/profile',
    },
    {
      name: 'Help',
      purpose: 'Access help and support information.',
      route: '/help',
    },
    {
      name: 'Admin Dashboard',
      purpose: 'Access administrator features when authorised.',
      route: '/admin-demo',
    },
  ],

  features: {
    doctorAppointments: {
      description:
        'Patients can browse doctors, select appointment slots and submit appointment bookings. Doctors can view relevant appointment records in their dashboard.',
      workflow: [
        'Open Find Doctors.',
        'Browse the available doctor profiles.',
        'Select a doctor.',
        'Choose an available date and time.',
        'Submit the appointment booking.',
        'Open Appointments to view the booking.',
      ],
      currentStatus:
        'The frontend appointment workflow has been tested. Appointment records currently use browser-side application storage. Shared backend integration is pending.',
    },

    prescriptions: {
      description:
        'Patients can upload prescriptions and view prescription information. Doctors can issue and edit prescriptions.',
      workflow: [
        'Open Prescriptions.',
        'Choose the upload option to select a prescription file.',
        'View the uploaded prescription.',
        'Doctors can issue or edit prescriptions through their dashboard.',
        'Prescription approval and rejection workflows are available in the frontend.',
      ],
      currentStatus:
        'The frontend prescription workflows have been tested. Secure server-side file storage and access control still require backend integration.',
    },

    pharmacies: {
      description:
        'The pharmacy directory displays pharmacy information and supports pharmacy-specific medicine catalogues.',
      workflow: [
        'Open Pharmacies.',
        'Browse the listed pharmacies.',
        'Select a pharmacy.',
        'View its medicine catalogue.',
      ],
      currentStatus:
        'The frontend contains sample pharmacy information and pharmacy management features. Do not describe sample pharmacies as independently verified real-world providers.',
    },

    medicines: {
      description:
        'Users can browse medicine catalogue items and view pharmacy-specific prices and stock information.',
      workflow: [
        'Open Medicines or select a pharmacy.',
        'Browse the available catalogue.',
        'Review the displayed price and stock information.',
        'Add eligible items to the cart.',
      ],
      currentStatus:
        'The frontend catalogue and inventory interactions have been tested. Live supplier inventory synchronization is not connected.',
    },

    medicineOrders: {
      description:
        'The medicine ordering interface supports a cart, pharmacy-specific checkout, order details, demo tracking and cancellation.',
      workflow: [
        'Browse the medicine catalogue.',
        'Add items to the cart.',
        'Review quantities and prices.',
        'Continue to checkout for the selected pharmacy.',
        'Review the order confirmation.',
        'View order details and demonstration tracking information.',
      ],
      currentStatus:
        'The frontend ordering workflow has been tested. Real payment processing, pharmacy fulfilment and live delivery tracking are not connected.',
    },

    pharmacyAdministration: {
      description:
        'The admin interface supports pharmacy information management and medicine inventory updates.',
      capabilities: [
        'Add pharmacy information.',
        'Edit pharmacy information.',
        'Activate or deactivate a pharmacy.',
        'Manage medicine prices.',
        'Manage stock information.',
      ],
      currentStatus:
        'These management features currently operate through frontend application state. Secure server-side administrator permissions are still required.',
    },

    emergencyAssistance: {
      description:
        'The emergency interface records a demonstration emergency request and can display saved emergency contact information.',
      capabilities: [
        'Create a demonstration SOS request.',
        'Display emergency request history.',
        'Save emergency contacts with a request.',
        'Display the recorded request location.',
        'Show the demonstration request status.',
      ],
      currentStatus:
        'The current SOS workflow is a frontend demonstration. Actual SMS delivery, ambulance dispatch, hospital coordination and live emergency response are not connected.',
      realEmergencyInstruction:
        'For a real emergency in India, call 112 immediately. Do not depend on the Safe Meds demonstration SOS feature.',
    },

    aarogyaAI: {
      description:
        'Aarogya AI is the conversational assistant for Safe Meds. It helps users understand the website, navigate its features and ask general informational questions.',
      currentCapabilities: [
        'Answer prepared Safe Meds navigation questions.',
        'Explain supported frontend workflows.',
        'Provide basic educational guidance.',
      ],
      plannedCapabilities: [
        'Answer general questions using a connected AI model.',
        'Understand the Safe Meds knowledge base.',
        'Answer authorised questions about the logged-in user.',
        'Use conversation history to understand follow-up questions.',
        'Respond in the selected application language.',
      ],
      currentStatus:
        'The current frontend uses prepared keyword-based responses when the AI backend is unavailable. General AI model responses and personalised account-data access require backend integration.',
    },
  },

  applicationLimitations: [
    'The frontend is not proof that a healthcare service is connected to a live provider.',
    'Some pharmacy, doctor and inventory information may be demonstration data.',
    'Browser localStorage is not a shared database between different users or devices.',
    'Backend integration is required for reliable shared records.',
    'Actual payment processing is not connected.',
    'Actual pharmacy delivery is not connected.',
    'Actual emergency SMS and ambulance dispatch are not connected.',
    'Secure server-side authentication and authorisation must be enforced by the backend.',
  ],

  personalisationAndPrivacy: {
    description:
      'Aarogya AI may answer questions about the currently authenticated user only when the backend securely provides the relevant authorised information.',

    rules: [
      'Never assume access to a users private account information.',
      'Never request passwords, OTPs, API keys or private authentication tokens.',
      'Do not trust a user ID supplied directly in a chat message.',
      'The backend must identify the account using validated authentication.',
      'The backend must retrieve only records the authenticated user is authorised to access.',
      'Never reveal another patients appointments, prescriptions, orders or health records.',
      'Send only the minimum personal information needed to answer a question.',
      'Do not place private medical records in this static knowledge file.',
      'Do not include private patient information in AI conversation logs unnecessarily.',
    ],

    exampleQuestions: [
      'When is my next appointment?',
      'How many appointments do I have?',
      'What is the status of my order?',
      'Can I view my prescription?',
      'What doctors have I booked?',
    ],

    backendRequirement:
      'Personalised answers require authenticated backend APIs that enforce user-level access permissions. The static frontend knowledge base cannot answer these questions by itself.',
  },

  healthAndSafety: {
    allowedSupport: [
      'Explain general health terminology in simple language.',
      'Provide general health education.',
      'Explain how to use Safe Meds features.',
      'Suggest contacting a qualified healthcare professional for personal medical concerns.',
    ],

    restrictions: [
      'Do not diagnose a persons medical condition.',
      'Do not prescribe medicines.',
      'Do not recommend medicine dosages or changes to prescribed treatment.',
      'Do not claim that an AI response replaces a doctor.',
      'Do not delay emergency care by asking unnecessary questions.',
      'For emergencies in India, direct users to call 112.',
      'Encourage younger users to involve a trusted adult when seeking medical care.',
    ],

    disclaimer:
      'Aarogya AI provides educational information and website guidance. It does not replace a qualified healthcare professional.',
  },

  responseGuidelines: {
    tone: 'Friendly, professional, clear and beginner-friendly.',
    formatting:
      'Use short paragraphs and numbered steps when explaining a workflow.',
    languages: ['English', 'Hindi', 'Marathi'],
    instructions: [
      'Understand the users actual question before answering.',
      'Use Safe Meds knowledge when the question is about the website.',
      'Answer general non-medical questions when connected to a suitable AI model.',
      'Never invent a website feature or claim an unconnected service is operational.',
      'Clearly explain when a feature is still a demonstration.',
      'Do not claim to have accessed personal account data unless authorised data was actually supplied by the backend.',
      'Ask one short clarification question when essential information is missing.',
    ],
  },
};

export default aarogyaKnowledge;
