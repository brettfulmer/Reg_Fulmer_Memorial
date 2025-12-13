'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { BarChart3, Users, MessageSquare, Share2 } from 'lucide-react'

interface AnalyticsStats {
  totalViews: number
  totalRsvps: number
  totalMemories: number
  totalShares: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?memorialId=1') // Update with dynamic ID
      const { data } = await response.json()
      if (data) setStats(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-foreground-muted">Loading...</div>
  }

  const metrics = [
    {
      label: 'Page Views',
      value: stats?.totalViews || 0,
      icon: BarChart3,
      color: 'text-blue-500',
    },
    {
      label: 'RSVPs',
      value: stats?.totalRsvps || 0,
      icon: Users,
      color: 'text-green-500',
    },
    {
      label: 'Memories',
      value: stats?.totalMemories || 0,
      icon: MessageSquare,
      color: 'text-purple-500',
    },
    {
      label: 'Shares',
      value: stats?.totalShares || 0,
      icon: Share2,
      color: 'text-accent-gold',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-display-sm text-foreground mb-2">Analytics</h2>
        <p className="text-body-md text-foreground-muted">
          Track engagement and visitor activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-background-subtle">
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-caption text-foreground-subtle uppercase tracking-wider">
                    {metric.label}
                  </p>
                  <p className="text-heading-lg font-bold text-foreground">
                    {metric.value}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card>
        <h3 className="font-serif text-heading-lg text-foreground mb-4">
          Engagement Overview
        </h3>
        <p className="text-body-md text-foreground-muted">
          Analytics tracking is active. Detailed charts and insights coming soon.
        </p>
      </Card>
    </div>
  )
}
