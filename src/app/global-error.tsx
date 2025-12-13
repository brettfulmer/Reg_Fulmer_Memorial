'use client'

import { useEffect } from 'react'
import { Home, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-400 mb-8">
            We apologize for the inconvenience. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-black rounded-xl font-medium hover:bg-amber-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              <Home className="w-4 h-4" />
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
