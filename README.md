# Reg Fulmer Memorial Site

A memorial website for Reginald "Reg" Fulmer, built with Vite + React + TypeScript.

## Features

- **Responsive dark theme** with warm gold accents
- **Live countdown** to service
- **Service details** with calendar integration
- **RSVP system** for tracking attendance
- **Travel concierge** with local recommendations
- **Livestream information** for virtual attendance
- **Memories wall** for sharing tributes
- **Timeline** showcasing life milestones
- **Mobile-first design** with smooth animations

## Tech Stack

- **Framework**: Vite 7 + React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion 12
- **Icons**: Lucide React
- **Routing**: React Router DOM 7
- **Build Tool**: Vite

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── sections/         # Page sections
│   │   ├── hero-section.tsx
│   │   ├── service-section.tsx
│   │   ├── rsvp-section.tsx
│   │   ├── livestream-section.tsx
│   │   ├── travel-section.tsx
│   │   ├── memories-section.tsx
│   │   ├── timeline-section.tsx
│   │   ├── voice-agent-section.tsx
│   │   ├── quick-actions-bar.tsx
│   │   └── footer.tsx
│   └── ui/               # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── countdown.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── data/
│   └── memorialContent.ts  # Memorial data and content
├── lib/
│   ├── types/            # TypeScript type definitions
│   └── utils.ts          # Utility functions
├── pages/
│   └── MemorialPage.tsx  # Main memorial page
├── App.tsx               # Root app component
├── main.tsx              # App entry point
└── styles.css            # Global styles and Tailwind
```

## Customization

### Theme Colors

Edit `tailwind.config.ts`:
- `accent-gold`: Primary accent (#d4a574)
- `background`: Dark base (#0a0a0a)

### Fonts

Fonts are loaded via Google Fonts in `src/styles.css`:
- **Display/Headings**: Cormorant Garamond
- **Body**: DM Sans

### Content

Update memorial content in `src/data/memorialContent.ts`:
- Memorial information
- Service event details
- Travel tips
- Voice agent configuration

## Service Details

| Field | Value |
|-------|-------|
| **Event** | Celebration of Life |
| **Date** | Thursday 22 January 2026 |
| **Time** | 2:00 PM AEDT |
| **Venue** | Horizons at South Maroubra Surf Club |
| **Address** | Marine Parade, Maroubra NSW 2035 |

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel

1. Connect your repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

### Other Platforms

The site is a standard Vite + React application. Build the `dist` folder and deploy it to any static hosting service.

## License

Private. Built with love for the Fulmer family.
