import type { Metadata } from 'next'
import './globals.css'
import { LivingWall } from '@/components/ui/living-wall'

export const metadata: Metadata = {
  title: 'Memorial',
  description: 'A tribute to those we love',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased grain">
        <div className="relative isolate min-h-screen">
          <LivingWall />
          {children}
        </div>
      </body>
    </html>
  )
}
