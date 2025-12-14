/**
 * Environment variable validation
 * Ensures all required environment variables are present before the app starts
 */

function validateEnv() {
  const required = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  const optional = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  }

  const missing: string[] = []

  Object.entries(required).forEach(([key, value]) => {
    if (!value) {
      missing.push(key)
    }
  })

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\nPlease check your .env.local file.`
    )
  }

  // Warn about missing optional env vars (AI features won't work without them)
  const missingOptional: string[] = []
  Object.entries(optional).forEach(([key, value]) => {
    if (!value && key === 'OPENAI_API_KEY') {
      missingOptional.push(key)
    }
  })

  if (missingOptional.length > 0 && typeof window === 'undefined') {
    // Only log on server side
    // Note: Removed console.warn for production, but you may want to use a proper logging service
  }
}

// Run validation on module load
if (process.env.NODE_ENV !== 'test') {
  validateEnv()
}

export { validateEnv }
