'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Bus, 
  Accessibility, 
  Shirt,
  Users,
  Coffee,
  ExternalLink,
  CalendarPlus
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  formatDate, 
  formatTime, 
  generateICSFile, 
  downloadICSFile,
  cn 
} from '@/lib/utils'
import type { ServiceEvent } from '@/types'

interface ServiceSectionProps {
  serviceEvent: ServiceEvent
  memorialName: string
}

export function ServiceSection({ serviceEvent, memorialName }: ServiceSectionProps) {
  const handleAddToCalendar = () => {
    const startDate = new Date(serviceEvent.start_datetime)
    const endDate = new Date(startDate.getTime() + serviceEvent.duration_minutes * 60000)
    
    const icsContent = generateICSFile({
      title: `${serviceEvent.event_type} - ${memorialName}`,
      description: `${serviceEvent.event_type} for ${memorialName} at ${serviceEvent.venue_name}`,
      location: `${serviceEvent.venue_name}, ${serviceEvent.address_line}`,
      startDate,
      endDate,
      url: serviceEvent.livestream_url || undefined,
    })
    
    downloadICSFile(icsContent, `${memorialName.replace(/\s+/g, '-')}-service.ics`)
  }

  const handleOpenMaps = () => {
    if (serviceEvent.google_maps_url) {
      window.open(serviceEvent.google_maps_url, '_blank')
    }
  }

  const details = [
    {
      icon: Calendar,
      label: 'Date',
      value: formatDate(serviceEvent.start_datetime),
    },
    {
      icon: Clock,
      label: 'Time',
      value: formatTime(serviceEvent.start_datetime) + ' AEDT',
    },
    {
      icon: MapPin,
      label: 'Venue',
      value: serviceEvent.venue_parent 
        ? `${serviceEvent.venue_name} at ${serviceEvent.venue_parent}`
        : serviceEvent.venue_name,
      subValue: serviceEvent.address_line,
      action: serviceEvent.google_maps_url ? handleOpenMaps : undefined,
      actionLabel: 'Open in Maps',
    },
  ]

  const additionalInfo = [
    serviceEvent.parking_notes && { icon: Car, label: 'Parking', value: serviceEvent.parking_notes },
    serviceEvent.public_transport_notes && { icon: Bus, label: 'Public transport', value: serviceEvent.public_transport_notes },
    serviceEvent.accessibility_notes && { icon: Accessibility, label: 'Accessibility', value: serviceEvent.accessibility_notes },
    serviceEvent.dress_code && { icon: Shirt, label: 'Dress code', value: serviceEvent.dress_code },
    serviceEvent.kids_welcome && { icon: Users, label: 'Children', value: 'Children are welcome' },
  ].filter(Boolean) as Array<{ icon: typeof Car; label: string; value: string }>

  return (
    <section id="service" className="section">
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
              {serviceEvent.event_type}
            </h2>
            <div className="divider max-w-24 mx-auto" />
          </div>

          {/* Main details card */}
          <Card className="mb-8">
            <div className="space-y-6">
              {details.map((detail, index) => {
                const Icon = detail.icon
                return (
                  <div 
                    key={detail.label}
                    className={cn(
                      'flex items-start gap-4',
                      index !== details.length - 1 && 'pb-6 border-b border-border'
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-caption uppercase tracking-wider text-foreground-subtle mb-1">
                        {detail.label}
                      </p>
                      <p className="text-body-md text-foreground font-medium">
                        {detail.value}
                      </p>
                      {detail.subValue && (
                        <p className="text-body-sm text-foreground-muted mt-0.5">
                          {detail.subValue}
                        </p>
                      )}
                      {detail.action && (
                        <button
                          onClick={detail.action}
                          className="inline-flex items-center gap-1 mt-2 text-body-sm text-accent-gold hover:text-accent-gold-light transition-colors"
                        >
                          {detail.actionLabel}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Add to calendar button */}
              <div className="pt-2">
                <Button
                  variant="secondary"
                  onClick={handleAddToCalendar}
                  leftIcon={<CalendarPlus className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Add to calendar
                </Button>
              </div>
            </div>
          </Card>

          {/* Additional info grid */}
          {additionalInfo.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {additionalInfo.map((info) => {
                const Icon = info.icon
                return (
                  <Card key={info.label} variant="elevated" padding="sm">
                    <div className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-foreground-subtle mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-body-sm font-medium text-foreground mb-0.5">
                          {info.label}
                        </p>
                        <p className="text-body-sm text-foreground-muted">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* After gathering */}
          {serviceEvent.after_gathering_title && (
            <Card variant="glass">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5 text-accent-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-heading-md text-foreground mb-2">
                    {serviceEvent.after_gathering_title}
                  </h3>
                  <p className="text-body-md text-foreground-muted">
                    {serviceEvent.after_gathering_details}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  )
}
