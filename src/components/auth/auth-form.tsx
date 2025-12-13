'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, AlertCircle } from 'lucide-react'

interface AuthFormProps {
    view: 'login' | 'register'
}

export function AuthForm({ view }: AuthFormProps) {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            if (view === 'register') {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })

                if (signUpError) throw signUpError

                setMessage('Check your email to confirm your account.')
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (signInError) throw signInError

                router.push('/')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="card-glass backdrop-blur-md">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl mb-2">
                        {view === 'login' ? 'Welcome Back' : 'Join the Memorial'}
                    </h1>
                    <p className="text-foreground-muted">
                        {view === 'login'
                            ? 'Sign in to share your memories'
                            : 'Create an account to contribute'}
                    </p>
                </div>

                {message ? (
                    <div className="bg-success/10 text-success p-4 rounded-xl flex items-center gap-3 mb-6">
                        <Check className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {view === 'register' && (
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                                required
                            />
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="bg-error/10 text-error p-3 rounded-xl flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            loading={loading}
                            size="lg"
                        >
                            {view === 'login' ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-foreground-muted">
                    {view === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <Link href="/register" className="text-accent-gold hover:underline">
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <Link href="/login" className="text-accent-gold hover:underline">
                                Sign in
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
