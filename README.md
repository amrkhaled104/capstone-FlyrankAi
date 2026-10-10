# Home Services AI

## Project Brief
Home Services AI is a web platform connecting customers with verified home service professionals. Users can describe home issues to the AI assistant for troubleshooting; if professional help is needed, the platform recommends available technicians. Customers track bookings via their dashboard, while providers manage incoming work and display their services.

## Core User Flows

### Customer Flow
1. Sign up or log in as a customer.
2. Chat with the AI assistant for initial troubleshooting tips and maintenance guidance.
3. Browse recommended service categories and verified technicians (Plumbing, Electrical, HVAC, Appliance Repair, Deep Cleaning).
4. Book an appointment with a chosen specialist.
5. Track active appointments and review completed service history in the customer dashboard.

### Provider Flow
1. Sign up or log in as a service professional.
2. Configure profile details, including trade category, years of experience, hourly rate, and professional bio.
3. List trade services and availability in the platform directory.
4. Review incoming customer service requests, accept or decline jobs, and track earnings and completed repairs in the provider dashboard.

## Architecture Overview

### Frontend
- Next.js (App Router) for modular page structure and server-side performance.
- Tailwind CSS for a minimalist, responsive user interface with support for both light and dark modes.
- Lucide React for lightweight, accessible interface icons.

### Backend and Database
- Firebase Authentication for secure user registration, login, and persistent session management.
- Cloud Firestore for role-based data persistence, storing user profiles and activity records.
- Google Gemini API via the Vercel AI SDK for interactive diagnostic troubleshooting.

### Routing and State
- Role-based view separation ensuring customers see only customer flows and providers see only provider management tools.
- Dynamic role detection that automatically loads permissions and data based on the stored Firestore account role.

## Setup and Run Instructions

### Prerequisites
- Node.js version 18.x or later (version 20+ recommended)
- npm package manager

### Steps

```bash
git clone https://github.com/amrkhaled104/capstone-FlyrankAi.git
cd capstone-FlyrankAi
npm install
npm run dev
```

The application will run locally at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

## Known Limitations and Future Improvements

### Limitations
- Payment gateway integration is currently simulated.

### Future Improvements
- Add real-time chat notifications between customers and technicians.
- Implement live status tracking and on-site dispatch updates for active bookings.
