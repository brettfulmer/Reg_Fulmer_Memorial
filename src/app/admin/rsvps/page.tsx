'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Users as UsersIcon, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { RSVP } from '@/types'

export default function RSVPsAdminPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRSVPs()
  }, [])

  const loadRSVPs = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setRsvps(data as RSVP[])
    setLoading(false)
  }

  const stats = {
    total: rsvps.length,
    inPerson: rsvps.filter((r) => r.attendance === 'in_person').length,
    online: rsvps.filter((r) => r.attendance === 'online').length,
    notAttending: rsvps.filter((r) => r.attendance === 'not_attending').length,
    totalGuests: rsvps.reduce((sum, r) => sum + (r.guest_count || 0), 0),
  }

  if (loading) {
    return <div className="text-center py-12 text-foreground-muted">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-display-sm text-foreground mb-2">
            RSVP Management
          </h2>
          <p className="text-body-md text-foreground-muted">
            View and manage service RSVPs
          </p>
        </div>
        <Button
          onClick={loadRSVPs}
          variant="secondary"
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-caption text-foreground-subtle uppercase">Total RSVPs</p>
            <p className="text-heading-lg font-bold text-foreground">{stats.total}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-caption text-foreground-subtle uppercase">In Person</p>
            <p className="text-heading-lg font-bold text-green-500">{stats.inPerson}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-caption text-foreground-subtle uppercase">Online</p>
            <p className="text-heading-lg font-bold text-blue-500">{stats.online}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-caption text-foreground-subtle uppercase">
              Not Attending
            </p>
            <p className="text-heading-lg font-bold text-foreground-muted">
              {stats.notAttending}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-caption text-foreground-subtle uppercase">Total Guests</p>
            <p className="text-heading-lg font-bold text-accent-gold">
              {stats.totalGuests}
            </p>
          </div>
        </Card>
      </div>

      {/* RSVP List */}
      <div className="space-y-4">
        {rsvps.map((rsvp) => (
          <Card key={rsvp.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">{rsvp.full_name}</h3>
                  <span
                    className={`text-caption px-2 py-0.5 rounded ${
                      rsvp.attendance === 'in_person'
                        ? 'bg-green-500/20 text-green-300'
                        : rsvp.attendance === 'online'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {rsvp.attendance === 'in_person'
                      ? 'In Person'
                      : rsvp.attendance === 'online'
                        ? 'Online'
                        : 'Not Attending'}
                  </span>
                  {rsvp.guest_count > 1 && (
                    <span className="text-caption text-foreground-subtle">
                      +{rsvp.guest_count - 1} guest{rsvp.guest_count > 2 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-body-sm text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {rsvp.email}
                  </span>
                  {rsvp.mobile && <span>{rsvp.mobile}</span>}
                </div>

                {rsvp.dietary && (
                  <p className="text-body-sm text-foreground-muted mt-2">
                    <strong>Dietary:</strong> {rsvp.dietary}
                  </p>
                )}

                {rsvp.message_to_family && (
                  <p className="text-body-sm text-foreground-muted mt-2 italic">
                    "{rsvp.message_to_family}"
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}

        {rsvps.length === 0 && (
          <div className="text-center py-12 text-foreground-muted">
            No RSVPs submitted yet
          </div>
        )}
      </div>
    </div>
  )
}
