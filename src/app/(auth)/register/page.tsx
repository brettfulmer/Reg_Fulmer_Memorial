import { AuthForm } from '@/components/auth/auth-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Register | Memorial',
}

export default function RegisterPage() {
    return <AuthForm view="register" />
}
