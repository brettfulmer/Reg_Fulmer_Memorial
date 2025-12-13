import Link from 'next/link'
import { Home } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-display-md text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-body-md text-foreground-muted mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-gold text-background rounded-xl font-medium hover:bg-accent-gold-light transition-colors"
        >
          <Home className="w-4 h-4" />
          Return Home
        </Link>
      </div>
    </div>
  )
}
