
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Clock, ExternalLink, Copy, Check, Bell } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CountdownCompact } from '@/components/ui/countdown'
import { copyToClipboard, cn } from '@/lib/utils'
import type { ServiceEvent } from '@/types'

interface LivestreamSectionProps {
  serviceEvent: ServiceEvent
}

export function LivestreamSection({ serviceEvent }: LivestreamSectionProps) {
  const [copied, setCopied] = useState(false)
  const [reminderSet, setReminderSet] = useState(false)

  if (!serviceEvent.livestream_enabled) {
    return null
  }

  const handleCopyLink = async () => {
    if (serviceEvent.livestream_url) {
      const success = await copyToClipboard(serviceEvent.livestream_url)
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const handleSetReminder = () => {
    // In production, this would integrate with push notifications or email
    setReminderSet(true)
  }

  const handleWatchLive = () => {
    if (serviceEvent.livestream_url) {
      window.open(serviceEvent.livestream_url, '_blank')
    }
  }

  return (
    <section id="livestream" className="section">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-display-sm md:text-display-md text-foreground mb-4">
              Watch Online
            </h2>
            <p className="text-body-md text-foreground-muted max-w-md mx-auto">
              Can&apos;t make it in person? Join us via livestream from anywhere in the world.
            </p>
          </div>

          <Card variant="glass" className="relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-radial from-accent-gold/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              {/* Status indicator */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-subtle border border-border">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-caption font-medium text-foreground-muted">
                    Stream starts in <CountdownCompact targetDate={serviceEvent.start_datetime} className="text-accent-gold" />
                  </span>
                </div>
              </div>

              {/* Main content */}
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <Video className="w-10 h-10 text-accent-gold" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-serif text-heading-lg text-foreground mb-2">
                    Live stream
                  </h3>
                  <p className="text-body-md text-foreground-muted mb-4">
                    {serviceEvent.livestream_notes || 'The stream will open approximately 10 minutes before the service begins.'}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      onClick={handleWatchLive}
                      leftIcon={<Video className="w-4 h-4" />}
                    >
                      Watch livestream
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCopyLink}
                      leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    >
                      {copied ? 'Copied!' : 'Copy link'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-body-sm font-medium text-foreground mb-3">
                  Viewing tips
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-body-sm text-foreground-muted">
                    <Clock className="w-4 h-4 mt-0.5 text-foreground-subtle flex-shrink-0" />
                    Open the link 5–10 minutes early to test your connection
                  </li>
                  <li className="flex items-start gap-2 text-body-sm text-foreground-muted">
                    <Video className="w-4 h-4 mt-0.5 text-foreground-subtle flex-shrink-0" />
                    If the stream doesn&apos;t start, try refreshing the page
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
