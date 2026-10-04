# Project Master Plan: HomeServe AI — Home Services Platform

A production-grade blueprint for a Next.js 15 (App Router) capstone: browse services, book providers, and get AI-driven diagnosis and recommendations.

---

## 1. Core Architecture & Routing Structure

### 1.1 File Structure (`src/app/...`)

```
src/
├── app/
│   ├── layout.tsx                          # RootLayout (Server) — fonts, providers, nav/footer
│   ├── page.tsx                            # Home Page (Server)
│   ├── globals.css
│   ├── loading.tsx                         # Global route loading skeleton
│   ├── error.tsx                           # Global error boundary (Client)
│   ├── not-found.tsx
│   │
│   ├── services/
│   │   ├── page.tsx                        # All services / category grid (Server)
│   │   ├── loading.tsx
│   │   └── [category]/
│   │       ├── page.tsx                    # Category listing, e.g. /services/plumbing (Server)
│   │       └── [serviceId]/
│   │           ├── page.tsx                # Service detail (Server, fetches data)
│   │           └── loading.tsx
│   │
│   ├── providers/
│   │   └── [providerId]/
│   │       ├── page.tsx                    # Provider profile (Server)
│   │       └── reviews/
│   │           └── page.tsx                # Paginated reviews (Server + Client pagination)
│   │
│   ├── booking/
│   │   ├── page.tsx                        # Cart/booking summary (Client — reads state)
│   │   ├── [bookingId]/
│   │   │   └── confirmation/
│   │   │       └── page.tsx                # Post-booking confirmation (Server)
│   │   └── checkout/
│   │       └── page.tsx                    # Checkout form (Client)
│   │
│   ├── ai-advisor/
│   │   ├── page.tsx                        # AI Service Advisor chat UI (Client, streaming)
│   │   └── history/
│   │       └── page.tsx                    # Past advisor sessions (Server)
│   │
│   ├── dashboard/
│   │   ├── layout.tsx                      # Authenticated shell (Server, guards route)
│   │   ├── page.tsx                        # User's bookings overview (Server)
│   │   └── settings/
│   │       └── page.tsx                    # Profile settings (Client form)
│   │
│   ├── health/
│   │   └── page.tsx                        # Human-readable status dashboard (Server)
│   │
│   ├── api/
│   │   ├── health/
│   │   │   └── route.ts                    # GET — system/API status JSON
│   │   ├── services/
│   │   │   └── route.ts                    # GET — list/filter services
│   │   ├── providers/
│   │   │   └── [providerId]/route.ts       # GET — provider detail
│   │   ├── bookings/
│   │   │   └── route.ts                    # POST/GET — create & list bookings
│   │   └── ai-advisor/
│   │       └── route.ts                    # POST — streams AI recommendation
│   │
│   └── (marketing)/
│       ├── about/page.tsx
│       └── how-it-works/page.tsx
│
├── components/
│   ├── ui/                                 # Primitive design-system components (Client, mostly presentational)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   ├── Navbar.tsx                      # Client (mobile menu state)
│   │   ├── Footer.tsx                      # Server (static)
│   │   └── BottomNav.tsx                   # Client (mobile only)
│   ├── services/
│   │   ├── ServiceCard.tsx                 # Server
│   │   ├── CategoryGrid.tsx                # Server
│   │   └── ServiceFilterBar.tsx            # Client (interactive filters)
│   ├── providers/
│   │   ├── ProviderCard.tsx                # Server
│   │   ├── ProviderProfileHeader.tsx       # Server
│   │   └── ReviewList.tsx                  # Server
│   ├── booking/
│   │   ├── BookingWidget.tsx               # Client (date/time picker, dispatches actions)
│   │   ├── CartSummary.tsx                 # Client (subscribes to booking context)
│   │   └── BookingStepper.tsx              # Client
│   ├── ai-advisor/
│   │   ├── ChatWindow.tsx                  # Client (streaming, message state)
│   │   ├── ChatMessage.tsx                 # Client (rendered per message)
│   │   ├── RecommendationCard.tsx          # Client (renders AI's structured output)
│   │   └── SymptomQuickPicks.tsx           # Client
│   └── health/
│       └── StatusIndicator.tsx             # Client (polls /api/health)
│
├── lib/
│   ├── data/
│   │   ├── services.ts                     # Mock data + accessor functions
│   │   ├── providers.ts
│   │   └── bookings.ts
│   ├── ai/
│   │   ├── advisor-engine.ts               # Simulated recommendation logic
│   │   └── prompt-templates.ts
│   ├── validators/                         # Zod schemas
│   │   ├── booking.schema.ts
│   │   └── advisor.schema.ts
│   └── utils.ts                            # cn(), formatters, etc.
│
├── context/
│   └── BookingContext.tsx                  # React Context + useReducer (Client)
│
├── types/
│   ├── service.ts
│   ├── provider.ts
│   ├── booking.ts
│   └── advisor.ts
│
└── hooks/
    ├── useBooking.ts
    ├── useAIAdvisor.ts
    └── useMediaQuery.ts
```

### 1.2 Server vs. Client Component Rules

| Layer | Type | Rationale |
|---|---|---|
| `layout.tsx`, `page.tsx` for listing/detail routes | **Server** | Data fetching close to source, zero client JS for static content, better SEO for service/provider pages |
| `ServiceCard`, `ProviderCard`, `CategoryGrid` | **Server** | Pure presentational, no interactivity |
| `Navbar`, `BottomNav` | **Client** | Menu toggle state, active-route highlighting |
| `ServiceFilterBar` | **Client** | `useState`/`useSearchParams` for live filtering |
| `BookingWidget`, `CartSummary`, `BookingStepper` | **Client** | Consume `BookingContext`, handle form state and date pickers |
| `ChatWindow`, `ChatMessage`, `RecommendationCard` | **Client** | Streaming responses, local message array state |
| `StatusIndicator` | **Client** | Polling interval via `useEffect` |
| `api/*/route.ts` | **Server (Route Handlers)** | All mutations and AI calls proxied server-side; never expose logic to the client bundle |

**Rule of thumb:** Default every component to Server. Promote to Client only when it needs `useState`, `useEffect`, event handlers, browser APIs, or context consumption. Keep Client Components as leaves in the tree — pass Server-fetched data down as props rather than making parents Client unnecessarily.

---

## 2. Feature Specification (Phase-by-Phase)

### Phase 1 — Home Page & Category Browsing
- **Route:** `/` and `/services`
- Hero section with a search bar (Client, debounced input) that redirects to `/services?q=...`
- `CategoryGrid` (Server) renders from `lib/data/services.ts`, statically generated (`generateStaticParams` for categories)
- `ServiceFilterBar` (Client) manages price range, rating, and availability filters via URL search params (`useRouter`/`useSearchParams`) — keeps filters shareable/bookmarkable and SSR-friendly
- Skeleton loading via `loading.tsx` per route segment

### Phase 2 — Service Details & Provider Profiles
- **Routes:** `/services/[category]/[serviceId]`, `/providers/[providerId]`
- Service detail page (Server) fetches service + associated providers, renders `ProviderCard` list
- Provider profile (Server) shows bio, credentials, service radius, rating breakdown, and a "Book Now" CTA that hydrates the `BookingWidget` (Client island)
- Reviews paginated with `ReviewList` (Server) + a "Load more" Client button using server actions or `router.refresh()`

### Phase 3 — Booking Management System
- **State:** `BookingContext` using `useReducer` for cart-like behavior:
  ```
  actions: ADD_SERVICE | REMOVE_SERVICE | SET_DATE | SET_ADDRESS | SUBMIT_BOOKING | RESET
  ```
- `CartSummary` persists to `localStorage` (Client-only side effect) so bookings survive refresh
- Checkout (`/booking/checkout`) validates via Zod schema before POST to `/api/bookings`
- Confirmation page (Server) reads `bookingId` from the mock DB and renders a receipt-style summary
- Booking statuses: `pending → confirmed → completed | cancelled`

### Phase 4 — AI Service Advisor
- **Route:** `/ai-advisor`
- **Interaction flow:**
  1. User describes a problem in free text or picks a `SymptomQuickPick` chip (e.g., "Leaking pipe", "No AC airflow")
  2. Client posts message to `/api/ai-advisor` (Route Handler)
  3. Route Handler runs `advisor-engine.ts`: matches keywords/symptoms against a rules table mapping symptoms → service category → urgency level → top-matched providers (simulated, deterministic — no real LLM required, but structured to swap in a real model call later)
  4. Response streamed back (or returned as structured JSON) and rendered as a `RecommendationCard`: diagnosis summary, confidence label, recommended category, matched providers, and a "Book this service" shortcut that pre-fills the `BookingContext`
- **Prompt flow (if wiring a real LLM later):** system prompt constrains output to a strict JSON schema (`category`, `urgency`, `explanation`, `recommendedProviderIds`) so the UI never needs to parse free text
- Advisor sessions logged as `AdvisorLog[]` (mock, in-memory or JSON file), viewable at `/ai-advisor/history`

### Phase 5 — Health-Check Page
- **Routes:** `/health` (UI) and `/api/health` (JSON)
- `/api/health` returns:
  ```json
  { "status": "ok", "uptime": "...", "services": { "database": "ok", "aiAdvisor": "ok", "bookingService": "ok" }, "timestamp": "..." }
  ```
- `/health` page polls this endpoint every 30s via `StatusIndicator` (Client), showing green/yellow/red badges per subsystem — a nice "production-readiness" signal for capstone grading.

---

## 3. Data Models / Mock Data Structure

```typescript
// types/service.ts
export interface Service {
  id: string;
  category: 'cleaning' | 'plumbing' | 'electrical' | 'maintenance' | 'painting' | 'landscaping';
  title: string;
  description: string;
  basePrice: number;
  priceUnit: 'hour' | 'flat' | 'sqft';
  estimatedDuration: string;
  imageUrl: string;
  tags: string[];
  providerIds: string[];
}

// types/provider.ts
export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  categories: Service['category'][];
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  serviceRadiusKm: number;
  hourlyRate: number;
  availability: {
    date: string;      // ISO date
    slots: string[];   // e.g. ["09:00", "13:00", "16:00"]
  }[];
  verified: boolean;
}

// types/booking.ts
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  providerId: string;
  scheduledDate: string;
  scheduledSlot: string;
  address: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
  notes?: string;
}

export interface BookingCartState {
  items: {
    serviceId: string;
    providerId: string | null;
    date: string | null;
    slot: string | null;
  }[];
  address: string;
  step: 'select' | 'schedule' | 'review' | 'confirmed';
}

export type BookingAction =
  | { type: 'ADD_SERVICE'; payload: { serviceId: string } }
  | { type: 'REMOVE_SERVICE'; payload: { serviceId: string } }
  | { type: 'SET_PROVIDER'; payload: { serviceId: string; providerId: string } }
  | { type: 'SET_DATE'; payload: { serviceId: string; date: string; slot: string } }
  | { type: 'SET_ADDRESS'; payload: { address: string } }
  | { type: 'SUBMIT_BOOKING' }
  | { type: 'RESET' };

// types/advisor.ts
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export interface AdvisorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AdvisorRecommendation {
  diagnosisSummary: string;
  confidence: 'low' | 'medium' | 'high';
  recommendedCategory: Service['category'];
  urgency: UrgencyLevel;
  recommendedProviderIds: string[];
  explanation: string;
}

export interface AdvisorLog {
  id: string;
  userId: string;
  messages: AdvisorMessage[];
  recommendation: AdvisorRecommendation | null;
  createdAt: string;
}
```

---

## 4. UX/UI & Responsive Design Guidelines

### 4.1 Tailwind Strategy
- **Design tokens:** Define a `tailwind.config.ts` theme extension with a constrained palette (primary, neutral, success/warning/danger for urgency badges) — avoid ad-hoc hex values in components.
- **Utility-first, component-abstracted:** Keep raw Tailwind in `components/ui/` primitives; feature components compose primitives rather than re-declaring utility strings.
- **Breakpoints to design against explicitly:**
  - `375px` (mobile baseline) — single-column stacks, bottom nav visible, `BottomNav` replaces sidebar
  - `768px` (tablet) — two-column grids for `CategoryGrid`/`ProviderCard` lists
  - `1280px` (desktop) — three/four-column grids, persistent sidebar filters, `BottomNav` hidden (`hidden lg:block` inverse pattern)

### 4.2 Responsive Patterns
| Element | Mobile (375px) | Desktop (1280px) |
|---|---|---|
| Navigation | `BottomNav` (fixed, icon+label) | Top `Navbar` with full menu |
| Category Grid | 1 column, horizontal scroll for tags | 4-column grid |
| Service Detail | Stacked: image → info → booking CTA | Two-pane: image/info left, sticky `BookingWidget` right |
| AI Advisor Chat | Full-screen chat, input pinned to bottom (safe-area aware) | Centered chat panel, max-width 720px, side panel for recommendation history |
| Booking Cart | Slide-up drawer (Client, `fixed bottom-0`) | Persistent right-hand sidebar |

### 4.3 Accessibility & Polish
- All interactive elements meet 44px minimum touch target on mobile.
- Use `prefers-color-scheme` support from the start if a dark mode toggle is a stretch goal.
- Status/urgency badges (AI Advisor, Health page) use both color and icon/text — never color alone.
- Loading states use skeletons matching final layout dimensions to avoid layout shift (CLS).

---

**Suggested build order for a capstone timeline:** data models → mock data → Home/Services/Provider pages (Server) → Booking context + flow → AI Advisor (rules engine first, real LLM swap-in later) → Health page → responsive polish pass.

Want me to save this as a downloadable Markdown file for your repo's `/docs` folder, or scaffold the actual starter code (folder structure + boilerplate files) next?