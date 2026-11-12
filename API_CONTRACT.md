# Safe Meds — Backend API Contract & Specification

This document defines the REST API contract for the Node.js + Express backend supporting the **Safe Meds** healthcare assistance web application.

Frontend Configuration:
```env
# Frontend .env
VITE_API_BASE_URL=http://localhost:5000/api/v1
# In production:
# VITE_API_BASE_URL=https://api.safemeds.example.com/api/v1
```

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "fullName": "Jane Doe",
    "phone": "+91 98765 43210",
    "city": "Noida"
  }
  ```
- **Success Response** (`201 Created`):
  ```json
  {
    "success": true,
    "user": {
      "id": "usr_94821",
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "role": "user"
    },
    "token": "jwt_token_string"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"message": "Validation failed: invalid email or password too short"}`
  - `409 Conflict`: `{"message": "An account with this email already exists"}`

### 1.2 User Login
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "user": {
      "id": "usr_94821",
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "role": "user"
    },
    "token": "jwt_token_string"
  }
  ```
- **Error Response** (`401 Unauthorized`):
  ```json
  {"message": "Invalid email or password"}
  ```

### 1.3 Forgot Password
- **Endpoint**: `/auth/forgot-password`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**: `{"email": "user@example.com"}`
- **Success Response** (`200 OK`):
  ```json
  {"message": "Password reset instructions sent to email if account exists"}
  ```

### 1.4 Current User Profile
- **Endpoint**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Success Response** (`200 OK`):
  ```json
  {
    "id": "usr_94821",
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "phone": "+91 98765 43210",
    "city": "Noida",
    "role": "user"
  }
  ```

---

## 2. Doctor Directory & Appointment Endpoints

### 2.1 Get Verified Doctors
- **Endpoint**: `/doctors`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `specialty` (optional): e.g. `Cardiology`, `Pediatrics`, `General Medicine`
  - `city` (optional): e.g. `Noida`, `New Delhi`, `Gurugram`
  - `search` (optional): search string for name/hospital
- **Success Response** (`200 OK`):
  ```json
  [
    {
      "id": "DOC-101",
      "name": "Dr. Sarah Sharma",
      "specialty": "Cardiology",
      "qualifications": "MBBS, MD, DM (Cardiology)",
      "hospital": "Fortis Escorts Heart Institute",
      "city": "New Delhi",
      "phone": "+91 98765 43211",
      "verified": true,
      "experienceYears": 14,
      "consultationFee": 1200,
      "rating": 4.9,
      "availableSlots": ["10:00 AM", "11:30 AM", "03:00 PM"]
    }
  ]
  ```

### 2.2 Get Doctor Slots
- **Endpoint**: `/doctors/:id/slots`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**: `date` (`YYYY-MM-DD`)
- **Success Response** (`200 OK`):
  ```json
  {
    "doctorId": "DOC-101",
    "date": "2026-11-02",
    "slots": [
      { "time": "10:00 AM", "available": true },
      { "time": "11:30 AM", "available": true },
      { "time": "03:00 PM", "available": false }
    ]
  }
  ```

### 2.3 Book Appointment
- **Endpoint**: `/appointments`
- **Method**: `POST`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "doctorId": "DOC-101",
    "doctorName": "Dr. Sarah Sharma",
    "specialty": "Cardiology",
    "appointmentDate": "2026-11-02",
    "appointmentTime": "10:00 AM",
    "patientName": "Jane Doe",
    "patientPhone": "+91 98765 43210",
    "consultationType": "In-Person",
    "notes": "Follow-up consultation"
  }
  ```
- **Success Response** (`201 Created`):
  ```json
  {
    "id": "APT-77821",
    "status": "confirmed",
    "doctorName": "Dr. Sarah Sharma",
    "appointmentDate": "2026-11-02",
    "appointmentTime": "10:00 AM",
    "patientName": "Jane Doe",
    "createdAt": "2026-10-31T20:00:00.000Z"
  }
  ```

### 2.4 Cancel Appointment
- **Endpoint**: `/appointments/:id/cancel`
- **Method**: `PATCH`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "reason": "Schedule conflict"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "id": "APT-77821",
    "status": "cancelled",
    "cancelledAt": "2026-10-31T20:30:00.000Z"
  }
  ```

---

## 3. Pharmacy Directory Endpoints

### 3.1 Get Verified Pharmacies
- **Endpoint**: `/pharmacies`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `city` (optional): Filter by city
  - `search` (optional): Search pharmacy name or area
- **Success Response** (`200 OK`):
  ```json
  [
    {
      "id": "PHARM-201",
      "name": "Apollo Lifeline Chemist",
      "address": "Shop 14, Main Market, Sector 18, Noida",
      "city": "Noida",
      "operatingHours": "8:00 AM - 11:00 PM",
      "phone": "+91 98765 43210",
      "verified": true,
      "rating": 4.8
    }
  ]
  ```

---

## 4. AI Assistant Endpoint

### 4.1 Chat Assistance
- **Endpoint**: `/ai/chat`
- **Method**: `POST`
- **Auth Required**: Yes or session token
- **Request Body**:
  ```json
  {
    "message": "How do I book an appointment with a cardiologist?",
    "history": [
      { "role": "user", "content": "Hello" },
      { "role": "assistant", "content": "Hello! I am Aarogya AI..." }
    ],
    "language": "en"
  }
  ```
- **Safety / System Prompt Rules on Server**:
  1. Do NOT diagnose medical conditions or recommend specific drug doses.
  2. For personal health advice, direct the patient to a licensed physician.
  3. Assist users in website navigation, finding doctors, locating pharmacies, and understanding account features.
  4. Always attach standard healthcare disclaimer.
- **Success Response** (`200 OK`):
  ```json
  {
    "reply": "To book an appointment with a cardiologist, visit the Doctors section, choose Cardiology filter, select an available date and time slot, and click Book Appointment.",
    "disclaimer": "Safe Meds AI provides navigation and educational support. It does not replace professional medical advice."
  }
  ```
- **Error Response** (`500 Internal Server Error`):
  ```json
  {"message": "AI service temporarily unavailable. Please try again later."}
  ```

---

## 5. Security & Privacy Standards
1. **Never transmit sensitive medical records in unencrypted query parameters.**
2. **CORS Configuration**: Restrict allowed origins to frontend domain(s).
3. **Rate Limiting**: Apply express-rate-limit to `/auth/*` and `/ai/*`.
4. **JWT Expiration**: Set standard access token expiration (e.g., 2 hours) with refresh token mechanism.
