import Link from 'next/link'
import { Card } from '@/components/ui/card'
import {
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Sparkles,
  FileText,
} from 'lucide-react'

export default function AdminPage() {
  const adminSections = [
    {
      title: 'Memory Moderation',
      description: 'Review and approve submitted memories',
      icon: MessageSquare,
      href: '/admin/memories',
      color: 'text-blue-500',
    },
    {
      title: 'RSVP Management',
      description: 'View and manage service RSVPs',
      icon: Users,
      href: '/admin/rsvps',
      color: 'text-green-500',
    },
    {
      title: 'AI Insights',
      description: 'View AI-generated tribute summaries and analytics',
      icon: Sparkles,
      href: '/admin/ai-insights',
      color: 'text-accent-gold',
    },
    {
      title: 'Analytics',
      description: 'Track visits, engagement, and metrics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'text-purple-500',
    },
    {
      title: 'Content Editor',
      description: 'Edit memorial details and service information',
      icon: FileText,
      href: '/admin/content',
      color: 'text-orange-500',
    },
    {
      title: 'Settings',
      description: 'Configure site settings and integrations',
      icon: Settings,
      href: '/admin/settings',
      color: 'text-gray-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-display-sm text-foreground mb-2">
          Welcome to the Admin Dashboard
        </h2>
        <p className="text-body-md text-foreground-muted">
          Manage your memorial site, moderate content, and view insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.href} href={section.href}>
              <Card className="h-full hover:border-accent-gold/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-background-subtle group-hover:bg-accent-gold/10 transition-colors">
                    <Icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent-gold transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-body-sm text-foreground-muted">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
