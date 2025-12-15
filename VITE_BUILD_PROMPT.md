# Memorial Site - Vite Build Prompt

Create a production-ready memorial website using **Vite + React + TypeScript** with the following complete specification:

---

## Project Setup

Initialize a new Vite project with React and TypeScript:

```bash
npm create vite@latest memorial-site -- --template react-ts
cd memorial-site
```

**Required Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@supabase/supabase-js": "^2.87.1",
    "openai": "^4.73.0",
    "framer-motion": "^12.23.26",
    "lucide-react": "^0.560.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0",
    "date-fns": "^4.1.0",
    "react-to-print": "^3.0.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@types/node": "^25.0.1",
    "@types/express": "^4.17.21",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.9.3",
    "vite": "^6.0.5",
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.22",
    "postcss": "^8.5.6"
  }
}
```

---

## Architecture Overview

### Frontend (Vite + React)
- Single Page Application with React Router
- Client-side routing for all pages
- Supabase client for database/auth
- TailwindCSS for styling
- Framer Motion for animations

### Backend (Express API - separate from frontend)
- Express.js server in `/server` directory
- API routes for AI features, analytics, etc.
- CORS enabled for frontend access
- Environment variable configuration

---

## Project Structure

```
memorial-site/
├── server/                      # Express backend
│   ├── index.ts                 # Express server entry
│   ├── routes/
│   │   ├── ai.ts               # AI endpoints
│   │   ├── memories.ts         # Memories API
│   │   ├── rsvp.ts             # RSVP API
│   │   └── analytics.ts        # Analytics API
│   ├── lib/
│   │   ├── openai.ts           # OpenAI integration
│   │   └── supabase.ts         # Supabase server client
│   └── package.json
├── src/                         # React frontend
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Root component with router
│   ├── pages/                  # Route pages
│   │   ├── HomePage.tsx
│   │   ├── MemorialPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── MemoriesAdmin.tsx
│   │       ├── RSVPAdmin.tsx
│   │       ├── AIInsights.tsx
│   │       └── Analytics.tsx
│   ├── components/
│   │   ├── sections/           # Page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ServiceSection.tsx
│   │   │   ├── RSVPSection.tsx
│   │   │   ├── LivestreamSection.tsx
│   │   │   ├── TravelSection.tsx
│   │   │   ├── MemoriesSection.tsx
│   │   │   ├── TimelineSection.tsx
│   │   │   ├── VoiceAgentSection.tsx
│   │   │   ├── QuickActionsBar.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Textarea.tsx
│   │       ├── Select.tsx
│   │       ├── Countdown.tsx
│   │       ├── LivingWall.tsx
│   │       ├── AIChatbot.tsx
│   │       └── AudioRecorder.tsx
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── utils.ts            # Utility functions
│   │   └── api.ts              # API client for backend
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── hooks/
│   │   ├── useAuth.ts          # Authentication hook
│   │   └── useMemorial.ts      # Memorial data hook
│   └── index.css               # Global styles + Tailwind
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── .env.example
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Feature Requirements

### 1. MEMORIAL PAGE (`/m/:slug`)

**Hero Section:**
- Large hero with deceased person's name (e.g., "Reginald 'Reg' Fulmer")
- Birth and death dates (November 26, 1942 - December 10, 2025)
- Short biography
- Optional hero photo
- Live countdown timer to service event
- Displays: "X days, X hours, X minutes until service"

**Quick Actions Bar (Sticky Bottom on Mobile):**
- Add to Calendar (generates .ics file)
- Share Memorial (Web Share API or copy link)
- Get Directions (opens Google Maps)
- Mobile-first with icons from Lucide React

**Service Details Section:**
- Event type (e.g., "Celebration of Life")
- Date and time with timezone
- Venue name and address
- Google Maps embed or link
- Parking notes
- Public transport info
- Accessibility notes
- Dress code
- Kids welcome indicator
- After-gathering details

**RSVP Section:**
- Form fields:
  - Full name (required)
  - Email (required, validated)
  - Mobile phone (optional)
  - Attendance type: Radio buttons (In Person / Online / Not Attending)
  - Guest count (number input, default 1)
  - Dietary requirements (textarea)
  - Accessibility needs (textarea)
  - Message to family (textarea)
- Duplicate email handling (update existing RSVP)
- Real-time attendance counter:
  - "X attending in person"
  - "X joining online"
  - "X total guests"
- Submit to Supabase `rsvps` table
- Success/error messaging

**Livestream Section:**
- Pre-stream countdown with timezone detection
- Embedded video player (YouTube/Vimeo URL)
- Copy livestream link button
- Viewing tips/instructions
- Only shown if `livestream_enabled` is true

**Travel Concierge Section:**
- Tabbed interface with categories:
  - ✈️ Flights
  - 🏨 Stay
  - 🚗 Getting Around
  - ☕ Food & Coffee
  - 📍 Before Service
  - 🌅 After Service
  - 🏖️ Beaches & Walks
- Each tab shows curated tips from database
- Tips have: title, description, optional link
- Google Maps integration for venue location

**Memories Wall:**
- Display approved memories in chronological order
- Each memory shows:
  - Author name
  - Message text
  - Optional photo (Supabase Storage)
  - Optional audio recording
  - Relative timestamp (e.g., "2 hours ago")
  - "Can share at service" indicator
- Submission form (requires auth):
  - Name
  - Message (required)
  - Photo upload (drag & drop or file picker)
  - Audio recording (browser MediaRecorder API)
  - "Allow sharing at service" checkbox
- Real-time updates with Supabase subscriptions
- AI moderation on submit (auto-approve safe content)

**Timeline Section:**
- Visual timeline of key life events
- Dates and descriptions
- Photo gallery integration

**Voice Agent Section:**
- Coming soon UI with ElevenLabs integration ready
- Placeholder for voice FAQ automation
- Fallback phone number display

**AI Chatbot (Floating Widget):**
- Fixed position bottom-right
- Minimizable chat bubble
- When opened:
  - Message history
  - Input field
  - Suggested questions
  - "Powered by GPT-4o-mini" badge
- Answers questions about:
  - Service details
  - Directions
  - RSVP status
  - General FAQs
- Context-aware (knows memorial details)

---

### 2. ADMIN DASHBOARD (`/admin/*`)

**Protected Routes:**
- Require Supabase authentication
- Redirect to `/login` if not authenticated
- Check for admin role

**Admin Layout:**
- Navigation sidebar:
  - Dashboard
  - Memories
  - RSVPs
  - AI Insights
  - Analytics
- Back to site link
- Professional dark theme

**Dashboard (`/admin`):**
- Overview cards:
  - Total memories (count)
  - Pending moderation
  - Total RSVPs
  - In-person attendance
  - Online attendance
- Quick actions:
  - Moderate memories
  - View RSVPs
  - Generate insights
  - Export data

**Memories Admin (`/admin/memories`):**
- Table of all submitted memories
- Columns:
  - Name
  - Message (truncated)
  - Status (approved/pending)
  - AI sentiment
  - Timestamp
  - Actions
- Per-memory actions:
  - AI Moderate (instant analysis)
  - Approve/Unapprove toggle
  - Delete
  - View full content
- Filters: All / Pending / Approved

**RSVP Admin (`/admin/rsvps`):**
- Table of all RSVPs
- Columns:
  - Name
  - Email
  - Attendance type
  - Guest count
  - Dietary needs
  - Message to family
  - Submitted date
- Summary stats at top:
  - Total RSVPs
  - In-person count (with guests)
  - Online count
  - Not attending count
- Export to CSV button

**AI Insights (`/admin/ai-insights`):**
- Generate Tribute Summary:
  - Button to analyze all approved memories
  - Shows:
    - Compassionate summary (2-3 paragraphs)
    - Key themes (bullet list)
    - Emotional tone
- Generate Eulogy Draft:
  - Input: Personal notes (optional)
  - Output:
    - Opening paragraph
    - Main body
    - Closing
    - Full text
    - Delivery tips
  - Download as .txt button

**Analytics (`/admin/analytics`):**
- Metric cards:
  - Page views
  - RSVP submissions
  - Memory submissions
  - Link shares
  - Calendar downloads
- All tracked via `analytics_events` table
- Charts (optional): line graph of views over time

---

### 3. AUTHENTICATION

**Login Page (`/login`):**
- Email input
- Password input
- "Sign in" button
- Link to Register
- Supabase Auth integration
- Remember me option
- Password reset link

**Register Page (`/register`):**
- Email input (validated)
- Password input (min 8 chars)
- Confirm password
- "Create account" button
- Link to Login
- Supabase Auth signup

**Auth Hook (`useAuth`):**
```tsx
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange()

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, signIn, signUp, signOut }
}
```

---

### 4. BACKEND API (Express Server)

**Server Setup (`server/index.ts`):**
```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import aiRoutes from './routes/ai'
import memoriesRoutes from './routes/memories'
import rsvpRoutes from './routes/rsvp'
import analyticsRoutes from './routes/analytics'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/ai', aiRoutes)
app.use('/api/memories', memoriesRoutes)
app.use('/api/rsvp', rsvpRoutes)
app.use('/api/analytics', analyticsRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

**AI Routes (`server/routes/ai.ts`):**
- POST `/api/ai/moderate` - Moderate memory content
- POST `/api/ai/chatbot` - Answer service questions
- POST `/api/ai/tribute-summary` - Generate tribute summary
- POST `/api/ai/eulogy` - Generate eulogy draft

**OpenAI Integration (`server/lib/openai.ts`):**

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Content Moderation
export async function moderateMemory(message: string, name: string) {
  // Use OpenAI Moderation API
  const moderation = await openai.moderations.create({ input: message })

  // Sentiment analysis with GPT-4o-mini
  const sentiment = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Analyze sentiment: positive, neutral, or negative. Respond with one word.'
      },
      {
        role: 'user',
        content: `Message from ${name}: "${message}"`
      }
    ],
    temperature: 0.3,
    max_tokens: 10
  })

  return {
    flagged: moderation.results[0].flagged,
    categories: moderation.results[0].categories,
    sentiment: sentiment.choices[0].message.content,
    suggestedApproval: !moderation.results[0].flagged
  }
}

// Tribute Summary (GPT-4o)
export async function generateTributeSummary(
  memories: Array<{ name: string; message: string }>,
  deceasedName: string
) {
  const memoriesText = memories
    .map((m, i) => `${i + 1}. From ${m.name}: "${m.message}"`)
    .join('\n\n')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Create a compassionate summary of tribute messages for ${deceasedName}'s memorial. Return JSON with: summary, keyThemes[], emotionalTone`
      },
      {
        role: 'user',
        content: memoriesText
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7
  })

  return JSON.parse(response.choices[0].message.content)
}

// Eulogy Draft (GPT-4o)
export async function generateEulogyDraft(
  deceasedName: string,
  bio: string,
  memories: Array<{ name: string; message: string }>,
  personalNotes?: string
) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Create a 3-5 minute eulogy for ${deceasedName}. Return JSON with: opening, mainBody, closing, fullText, tips[]`
      },
      {
        role: 'user',
        content: `Bio: ${bio}\n\nMemories:\n${memories.map(m => `- ${m.name}: ${m.message}`).join('\n')}\n\n${personalNotes || ''}`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8
  })

  return JSON.parse(response.choices[0].message.content)
}

// Chatbot (GPT-4o-mini)
export async function answerServiceQuestion(
  question: string,
  serviceContext: {
    deceasedName: string
    serviceDate: string
    venue: string
    address: string
    livestreamEnabled: boolean
    travelTips: string[]
  }
) {
  const context = `
Service for: ${serviceContext.deceasedName}
Date: ${serviceContext.serviceDate}
Venue: ${serviceContext.venue}
Address: ${serviceContext.address}
Livestream: ${serviceContext.livestreamEnabled ? 'Yes' : 'No'}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You're a helpful assistant for a memorial service. Answer warmly. Return JSON with: answer, suggestedFollowUps[]`
      },
      {
        role: 'user',
        content: `${context}\n\nQuestion: ${question}`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7
  })

  return JSON.parse(response.choices[0].message.content)
}

// Photo Description (GPT-4o Vision)
export async function describeMemoryPhoto(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Describe this memorial photo warmly in 1-2 sentences.'
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    max_tokens: 100,
    temperature: 0.7
  })

  return response.choices[0].message.content
}
```

---

### 5. DATABASE SCHEMA (Supabase/PostgreSQL)

**Tables:**

```sql
-- Memorials
CREATE TABLE memorials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  preferred_name TEXT,
  dob DATE,
  dod DATE,
  hero_photo_url TEXT,
  short_bio TEXT,
  tone_note TEXT,
  primary_city TEXT,
  page_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Events
CREATE TABLE service_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id),
  event_type TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  venue_name TEXT,
  venue_parent TEXT,
  address_line TEXT,
  google_maps_url TEXT,
  parking_notes TEXT,
  public_transport_notes TEXT,
  accessibility_notes TEXT,
  dress_code TEXT,
  kids_welcome BOOLEAN DEFAULT TRUE,
  after_gathering_title TEXT,
  after_gathering_details TEXT,
  livestream_enabled BOOLEAN DEFAULT FALSE,
  livestream_url TEXT,
  livestream_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Travel Tips
CREATE TABLE travel_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memory Posts
CREATE TABLE memory_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT,
  audio_url TEXT,
  can_share_at_service BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  ai_sentiment TEXT,
  ai_moderation_score JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVPs
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id),
  service_event_id UUID REFERENCES service_events(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  attendance TEXT NOT NULL CHECK (attendance IN ('in_person', 'online', 'not_attending')),
  guest_count INTEGER DEFAULT 1,
  dietary TEXT,
  accessibility TEXT,
  message_to_family TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(memorial_id, email)
);

-- Voice Config
CREATE TABLE voice_agent_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id),
  status TEXT DEFAULT 'coming_soon',
  callout_text TEXT,
  embed_type TEXT,
  embed_code TEXT,
  fallback_phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photo Gallery
CREATE TABLE photo_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id),
  photo_url TEXT NOT NULL,
  caption TEXT,
  ai_description TEXT,
  uploaded_by TEXT,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_memories_memorial ON memory_posts(memorial_id);
CREATE INDEX idx_memories_approved ON memory_posts(approved);
CREATE INDEX idx_rsvps_memorial ON rsvps(memorial_id);
CREATE INDEX idx_rsvps_email ON rsvps(email);
CREATE INDEX idx_analytics_memorial ON analytics_events(memorial_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
```

**Storage Buckets:**
- `memories` - for photo/audio uploads
- Public read access
- Authenticated write access

**Seed Data:**

```sql
INSERT INTO memorials (slug, full_name, preferred_name, dob, dod, short_bio, page_title, primary_city)
VALUES (
  'reg-fulmer',
  'Reginald "Reg" Fulmer',
  'Reg',
  '1942-11-26',
  '2025-12-10',
  'Reg was deeply loved by his family and friends and spent most of his life in Maroubra. He was known for his dry humour, stubborn charm, and loyalty to the people he cared about.',
  'In Loving Memory of Reg Fulmer',
  'Maroubra, NSW'
);

INSERT INTO service_events (memorial_id, event_type, start_datetime, duration_minutes, venue_name, venue_parent, address_line, google_maps_url, livestream_enabled, livestream_url)
VALUES (
  (SELECT id FROM memorials WHERE slug = 'reg-fulmer'),
  'Celebration of Life',
  '2026-01-22 14:00:00+11',
  60,
  'Horizons',
  'South Maroubra Surf Club',
  'Marine Parade, Maroubra NSW 2035',
  'https://maps.google.com/?q=South+Maroubra+Surf+Club',
  true,
  'https://memorial.regfulmer.au/live'
);
```

---

### 6. STYLING (Tailwind CSS)

**Dark Theme Configuration (`tailwind.config.js`):**

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#fafafa',
        'accent-gold': '#d4a574',
        card: '#1a1a1a',
        'card-foreground': '#fafafa',
        border: '#2a2a2a',
        muted: '#3a3a3a',
        'muted-foreground': '#a1a1a1',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Global Styles (`src/index.css`):**

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-serif;
  }
}

/* Grain texture effect */
.grain {
  position: relative;
}

.grain::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 1;
}
```

---

### 7. ROUTING (React Router)

**App.tsx:**

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MemorialPage from './pages/MemorialPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import MemoriesAdmin from './pages/admin/MemoriesAdmin'
import RSVPAdmin from './pages/admin/RSVPAdmin'
import AIInsights from './pages/admin/AIInsights'
import Analytics from './pages/admin/Analytics'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/m/:slug" element={<MemorialPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="memories" element={<MemoriesAdmin />} />
          <Route path="rsvps" element={<RSVPAdmin />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

### 8. KEY UTILITIES

**Supabase Client (`src/lib/supabase.ts`):**

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

**API Client (`src/lib/api.ts`):**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function moderateContent(message: string, name: string) {
  const res = await fetch(`${API_URL}/api/ai/moderate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, name })
  })
  return res.json()
}

export async function sendChatMessage(question: string, memorialId: string) {
  const res = await fetch(`${API_URL}/api/ai/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, memorialId })
  })
  return res.json()
}

export async function generateTributeSummary(memorialId: string) {
  const res = await fetch(`${API_URL}/api/ai/tribute-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memorialId })
  })
  return res.json()
}

export async function generateEulogy(memorialId: string, personalNotes?: string) {
  const res = await fetch(`${API_URL}/api/ai/eulogy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memorialId, personalNotes })
  })
  return res.json()
}
```

**Utils (`src/lib/utils.ts`):**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function generateICS(event: {
  title: string
  description: string
  location: string
  startTime: Date
  endTime: Date
}) {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
DTSTART:${event.startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${event.endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
END:VEVENT
END:VCALENDAR`

  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'memorial-service.ics'
  a.click()
}
```

---

### 9. ENVIRONMENT VARIABLES

**.env.example:**

```env
# Vite Frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001
VITE_SITE_URL=http://localhost:5173

# Express Backend (server/.env)
PORT=3001
OPENAI_API_KEY=sk-proj-your-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
RESEND_API_KEY=re_your-key
ELEVENLABS_API_KEY=your-key
```

---

### 10. BUILD & DEPLOYMENT

**Build Commands:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "server:dev": "cd server && tsx watch index.ts",
    "server:build": "cd server && tsc",
    "server:start": "cd server && node dist/index.js"
  }
}
```

**Vite Config (`vite.config.ts`):**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

**Netlify Deployment:**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build && cd server && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Convert Express routes to Netlify Functions or deploy backend separately.

---

### 11. ANIMATIONS (Framer Motion)

**Fade In on Scroll:**

```tsx
import { motion } from 'framer-motion'

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}
```

**Chatbot Animations:**

```tsx
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
>
  {/* Chat window */}
</motion.div>
```

---

### 12. MOBILE RESPONSIVENESS

- Mobile-first design approach
- Sticky quick actions bar on mobile (bottom)
- Touch-friendly button sizes (min 44px)
- Responsive typography
- Hamburger menu for admin nav on mobile
- Optimized images with loading="lazy"

---

### 13. SECURITY

- Environment variables for all secrets
- HTTPS only in production
- Supabase Row Level Security (RLS) policies
- CORS configured for specific origins
- Input validation and sanitization
- XSS protection (React escapes by default)
- CSRF protection for forms
- Rate limiting on API endpoints
- Content Security Policy headers

---

### 14. TESTING CHECKLIST

Before deployment:

- [ ] All routes load correctly
- [ ] RSVP form submits and updates
- [ ] Memory submission works with photo/audio
- [ ] AI chatbot responds correctly
- [ ] Admin login/authentication works
- [ ] Admin can moderate memories
- [ ] AI insights generate properly
- [ ] Countdown timer displays correctly
- [ ] Calendar download works (.ics file)
- [ ] Share functionality works
- [ ] Mobile responsive on all pages
- [ ] Supabase connection working
- [ ] Express API responding
- [ ] Environment variables set
- [ ] Build completes without errors

---

### 15. PRODUCTION OPTIMIZATIONS

- Code splitting with React.lazy()
- Image optimization (WebP/AVIF)
- Lazy loading for images
- Debounced search inputs
- Memoized expensive computations
- Virtual scrolling for long lists
- Service worker for offline support (optional)
- CDN for static assets
- Gzip/Brotli compression
- Cache-Control headers

---

## Success Criteria

The completed application should:

1. ✅ Build successfully with `npm run build`
2. ✅ Have zero TypeScript errors
3. ✅ Load all pages without errors
4. ✅ Connect to Supabase database
5. ✅ AI features working with OpenAI
6. ✅ Mobile responsive (test on phone)
7. ✅ Authentication flow complete
8. ✅ Admin dashboard functional
9. ✅ Real-time updates via Supabase
10. ✅ Production-ready security measures

---

## Additional Notes

- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states for async operations
- Include empty states for lists
- Use semantic HTML
- Ensure WCAG 2.1 AA accessibility
- Add meta tags for SEO
- Include favicon and app icons

---

This specification provides everything needed to build a complete, production-ready memorial website using Vite, React, TypeScript, Express, Supabase, and OpenAI.
