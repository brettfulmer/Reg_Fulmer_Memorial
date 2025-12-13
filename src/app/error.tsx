'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-display-md text-foreground mb-4">
          Something went wrong
        </h1>
        <p className="text-body-md text-foreground-muted mb-8">
          We apologize for the inconvenience.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-gold text-background rounded-xl font-medium hover:bg-accent-gold-light transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </div>
  )
}
