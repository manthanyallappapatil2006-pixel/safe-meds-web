# Safe Meds — Healthcare, All in One Place
> **College Field Project Prototype**  
> **Student:** Manthan Sharma  
> **Domain:** Mobile App Development & Unified Digital Health Systems

---

## 1. Project Overview

**Safe Meds** is a complete, responsive mobile-first healthcare web application prototype designed to streamline patient access to critical medical services.

### Core Objectives
1. **SOS Emergency Assistance**: Rapid emergency triage simulation, GPS-assisted location logging, and direct guidance for calling the national emergency helpline (**112** in India).
2. **Doctor Directory & Appointments**: Discovery across 8+ medical specialties, profile inspections, and booking of in-person clinic or online video consultations.
3. **Neighborhood Pharmacy & Medicine Access**: Digital catalog of essential OTC and prescription supplies, local chemist routing, and prescription upload verification.
4. **End-to-End Demonstration Lifecycle**: Live order tracking timeline, interactive status advancing, and an Admin Demo Console for academic evaluators.

---

## 2. Technology Stack

- **Framework**: React 19 with Vite
- **Routing**: React Router DOM v7 (28+ active routes)
- **Styling**: Tailwind CSS v4 & Modern CSS Design Tokens
- **Icons**: Lucide React
- **State Management**: React Context API (`AppContext.jsx`) with defensive `localStorage` persistence
- **Validation**: Modular regex & rule helpers (`validation.js`)

---

## 3. Brand Identity & Color Palette

- **Primary Teal**: `#0F766E` (Medical credibility, trustworthiness)
- **Secondary Blue**: `#2563EB` (Clinical consultations & video visits)
- **Light Teal**: `#CCFBF1` (Badges and soft accents)
- **Main Background**: `#F8FAFC` (Clean, sterile slate)
- **Card Background**: `#FFFFFF` (High-contrast surface)
- **Main Text**: `#0F172A` (Crisp readability)
- **Secondary Text**: `#64748B` (Subtle metadata)
- **Success**: `#16A34A` (Approved & delivered statuses)
- **Warning**: `#F59E0B` (Pending review alerts)
- **Emergency Red**: `#DC2626` (SOS emergency triggers & 112 hotlines)
- **Borders**: `#E2E8F0` (Consistent structural division)

---

## 4. Key Demonstration Flows for Evaluators

### A. Quick Start as Guest (Teacher Mode)
1. Open the application. On the welcome screen, click **"Continue as Guest Demo"**.
2. Alternatively, visit `/login` and click **"Auto-fill Demo"** to authenticate instantly.

### B. SOS Emergency Simulation (`/emergency`)
1. Select emergency category (*General emergency*, *Injury*, *Other urgent concern*).
2. Click **"Simulate GPS Fix"** to populate mock coordinates.
3. Submit and observe the confirmation modal, simulated vehicle assignment (`Safe Meds Demo Unit #07`), and interactive 3-step timeline.
4. Review past requests in **Emergency History** (`/emergency/history`).

### C. Booking a Doctor Appointment (`/doctors`)
1. Filter by specialty (*Cardiology*, *Dermatology*, *General Physician*, etc.) or consultation format (*Online Video* vs *In-Person*).
2. Select a doctor to view their profile, clinic address, and available slots.
3. Fill the booking form with duplicate slot protection, verify date rules, and confirm.
4. Manage, reschedule, or cancel bookings in **My Appointments** (`/appointments`).

### D. Ordering Medicines & Prescription Check (`/medicines`)
1. Browse medicines or filter by **Rx Required** vs **OTC Only**.
2. Add items to the cart. If a prescription medicine (e.g., *Amoxicillin 500mg*) is added, the cart warns that prescription approval is needed.
3. Test promo code **`SAFEMEDS10`** in the Cart to apply a 10% demo discount.
4. Go to **Prescriptions** (`/prescriptions`) to upload an image/PDF (validated up to 5 MB).
5. Open the **Admin Demo** (`/admin-demo`) to simulate one-click **"Approve in Demo"**.
6. Return to **Checkout** (`/checkout`), choose a saved address or enter a new one, select simulated payment (Cash on Delivery or UPI Demo), and place the order.
7. Open **Order Details** (`/orders/:orderId`) and click **"Advance Demo Status"** to step through the 5 delivery stages live!

### E. Evaluator Console (`/admin-demo`)
- Overview statistics of all appointments, orders, and pharmacies.
- One-click prescription approvals/rejections.
- State changers for delivery pipelines.
- **"Reset All Demo Data"** button to restore initial sample state at any point.

---

## 5. How to Run Locally

```bash
# 1. Navigate to project directory
cd safe-meds

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Or build for production
npm run build
npm run preview
```

---

## 6. Safety & Academic Disclaimer

> **IMPORTANT:** Safe Meds is a student demonstration prototype and **not** a licensed healthcare, clinical, or emergency dispatch provider. No actual ambulances are contacted, and no real medications are dispensed. In a genuine medical emergency in India, please contact local emergency authorities directly by dialing **112**.
