import { AuthForm } from '@/components/auth/auth-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign In | Memorial',
}

export default function LoginPage() {
    return <AuthForm view="login" />
}
