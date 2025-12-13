# Reg Fulmer Memorial Hub

A premium memorial website for Reginald "Reg" Fulmer, built with Next.js 14, Tailwind CSS, and Supabase.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

### Core
- **Responsive dark theme** with warm gold accents
- **Live countdown** to service
- **One-tap actions**: Add to calendar (.ics), share, directions
- **Mobile-first** with sticky bottom nav

### RSVP System
- In-person / online / not attending options
- Guest count, dietary requirements, accessibility needs
- Real-time attendance counter
- Duplicate email handling (updates existing RSVP)

### Travel Concierge
- Tabbed categories: Flights, Stay, Getting Around, Food & Coffee, Before/After, Explore
- Curated local recommendations
- Google Maps integration

### Livestream
- Pre-stream countdown with timezone detection
- Copy link functionality
- Viewing tips

### Memories Wall
- Text messages with optional photos
- Permission toggle for service sharing
- Chronological timeline with relative timestamps

### Voice Agent (Coming Soon)
- ElevenLabs integration ready
- FAQ automation
- Fallback phone support

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for production)

### Development

```bash
# Install dependencies
npm install

# Create .env.local from template
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/m/reg-fulmer`

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── memories/route.ts    # Memory posts API
│   │   └── rsvp/route.ts        # RSVP API
│   ├── m/[slug]/page.tsx        # Memorial page
│   ├── globals.css              # Tailwind + custom styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home (redirects)
├── components/
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── service-section.tsx
│   │   ├── rsvp-section.tsx
│   │   ├── livestream-section.tsx
│   │   ├── travel-section.tsx
│   │   ├── memories-section.tsx
│   │   ├── voice-agent-section.tsx
│   │   ├── quick-actions-bar.tsx
│   │   └── footer.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── countdown.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   └── server.ts            # Server client
│   └── utils.ts                 # Helpers
└── types/
    └── index.ts                 # TypeScript types
```

## Database Setup (Supabase)

1. Create a new Supabase project
2. Run the schema in `supabase/schema.sql`
3. Add your Supabase URL and anon key to `.env.local`

The schema includes seed data for Reg Fulmer's memorial.

## Configuration

### Environment Variables

```env
# Required for production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional
NEXT_PUBLIC_SITE_URL=https://memorial.regfulmer.au
ELEVENLABS_API_KEY=for_voice_agent
RESEND_API_KEY=for_email_notifications
```

### Customisation

**Theme colours** — `tailwind.config.ts`:
- `accent-gold`: Primary accent (#d4a574)
- `background`: Dark base (#0a0a0a)

**Fonts** — Google Fonts loaded in `globals.css`:
- Headings: Cormorant Garamond
- Body: DM Sans

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
Standard Next.js deployment. Ensure environment variables are set.

## Service Details

| | |
|---|---|
| **Event** | Celebration of Life |
| **Date** | Thursday 22 January 2026 |
| **Time** | 2:00 PM AEDT |
| **Venue** | Horizons at South Maroubra Surf Club |
| **Address** | Marine Parade, Maroubra NSW 2035 |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## License

Private. Built with love for the Fulmer family.
