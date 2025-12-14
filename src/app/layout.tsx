import type { Metadata } from 'next'
import './globals.css'
import { LivingWall } from '@/components/ui/living-wall'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://memorial.regfulmer.au'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'In Loving Memory of Reg Fulmer',
    template: '%s | Reg Fulmer Memorial',
  },
  description: 'A celebration of life for Reginald "Reg" Fulmer. Join us in honoring his memory and sharing your stories.',
  keywords: ['memorial', 'celebration of life', 'Reg Fulmer', 'Reginald Fulmer', 'tribute'],
  authors: [{ name: 'Fulmer Family' }],
  creator: 'Fulmer Family',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: siteUrl,
    siteName: 'Reg Fulmer Memorial',
    title: 'In Loving Memory of Reg Fulmer',
    description: 'A celebration of life for Reginald "Reg" Fulmer. Join us in honoring his memory and sharing your stories.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'In Loving Memory of Reg Fulmer',
    description: 'A celebration of life for Reginald "Reg" Fulmer.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background antialiased grain">
        <div className="relative isolate min-h-screen">
          <LivingWall />
          {children}
        </div>
      </body>
    </html>
  )
}
