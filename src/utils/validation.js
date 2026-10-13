// Validation utility functions for Safe Meds prototype

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Basic validation: 10 digits or with +91 prefix
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
};

export const isValidPinCode = (pin) => {
  if (!pin || typeof pin !== 'string') return false;
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(pin.trim());
};

export const validateLoginForm = ({ emailOrPhone, password }) => {
  const errors = {};
  if (!emailOrPhone || !emailOrPhone.trim()) {
    errors.emailOrPhone = 'Email or phone number is required';
  } else {
    const val = emailOrPhone.trim();
    if (val.includes('@')) {
      if (!isValidEmail(val)) errors.emailOrPhone = 'Please enter a valid email address';
    } else {
      if (!isValidPhone(val)) errors.emailOrPhone = 'Please enter a valid 10-digit mobile number';
    }
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (data) => {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Full name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Mobile number is required';
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid 10-digit mobile number';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.agreeTerms) {
    errors.agreeTerms = 'You must accept the terms of service and privacy policy';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAppointmentForm = (data, existingSlots = []) => {
  const errors = {};

  if (!data.patientName || !data.patientName.trim()) {
    errors.patientName = 'Patient full name is required';
  }

  if (!data.contactNumber || !data.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required';
  } else if (!isValidPhone(data.contactNumber)) {
    errors.contactNumber = 'Enter a valid 10-digit contact number';
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address or leave blank';
  }

  if (!data.appointmentType) {
    errors.appointmentType = 'Please select a consultation type';
  }

  if (!data.appointmentDate) {
    errors.appointmentDate = 'Please select an appointment date';
  } else {
    const selected = new Date(data.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.appointmentDate = 'Appointment date cannot be in the past';
    }
  }

  if (!data.appointmentTime) {
    errors.appointmentTime = 'Please select an available time slot';
  }

  // Check duplicate booking
  if (data.appointmentDate && data.appointmentTime && data.doctorId) {
    const isSlotTaken = existingSlots.some(
      (apt) =>
        apt.doctorId === data.doctorId &&
        apt.appointmentDate === data.appointmentDate &&
        apt.appointmentTime === data.appointmentTime &&
        apt.status !== 'Cancelled'
    );
    if (isSlotTaken) {
      errors.appointmentTime = 'This slot has already been booked in the demo. Please pick another time.';
    }
  }

  if (!data.confirmed) {
    errors.confirmed = 'Please confirm the appointment details';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateEmergencyForm = (data) => {
  const errors = {};

  if (!data.category) {
    errors.category = 'Emergency category is required';
  }

  if (!data.location || !data.location.trim()) {
    errors.location = 'Location or current demo address is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePrescriptionFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'Please select a prescription file (image or PDF)' };
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Unsupported file format. Please upload JPG, PNG, WEBP, or PDF.'
    };
  }

  const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: 'File size exceeds the 5 MB limit. Please upload a smaller file.'
    };
  }

  return { isValid: true, error: null };
};

export const validateAddressForm = (data) => {
  const errors = {};

  if (!data.recipientName || !data.recipientName.trim()) {
    errors.recipientName = 'Recipient name is required';
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Enter a valid 10-digit phone number';
  }

  if (!data.house || !data.house.trim()) {
    errors.house = 'House or flat/building number is required';
  }

  if (!data.street || !data.street.trim()) {
    errors.street = 'Street or area is required';
  }

  if (!data.city || !data.city.trim()) {
    errors.city = 'City is required';
  }

  if (!data.state || !data.state.trim()) {
    errors.state = 'State is required';
  }

  if (!data.pinCode || !data.pinCode.trim()) {
    errors.pinCode = 'Postal PIN code is required';
  } else if (!isValidPinCode(data.pinCode)) {
    errors.pinCode = 'Enter a valid 6-digit PIN code';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateContactForm = (data) => {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Contact name is required';
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Enter a valid 10-digit phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSupportForm = (data) => {
  const errors = {};

  if (!data.name || !data.name.trim()) errors.name = 'Full name is required';
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!data.topic) errors.topic = 'Please select a topic';
  if (!data.subject || !data.subject.trim()) errors.subject = 'Subject is required';
  if (!data.message || !data.message.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Please provide at least 10 characters describing your feedback';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
