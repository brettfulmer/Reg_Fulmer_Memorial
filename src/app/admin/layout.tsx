import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Memorial Hub',
  description: 'Manage memorial content, RSVPs, and settings',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is authenticated and is admin
  if (!user) {
    redirect('/login?redirect=/admin')
  }

  // In production, check if user has admin role
  // For now, any authenticated user can access admin
  // You should add a proper role check here

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background-subtle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-heading-lg text-foreground">
              Admin Dashboard
            </h1>
            <a
              href="/"
              className="text-body-sm text-foreground-muted hover:text-foreground"
            >
              ← Back to site
            </a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
