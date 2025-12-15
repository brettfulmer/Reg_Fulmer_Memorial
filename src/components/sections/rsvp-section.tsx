
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Users, Wifi, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { isValidEmail, cn, pluralize } from '@/lib/utils'
import type { RSVPFormData, RSVPStats } from '@/types'

interface RSVPSectionProps {
  memorialId: string
  serviceEventId: string
  stats: RSVPStats
}

type AttendanceType = 'in_person' | 'online' | 'not_attending'

const attendanceOptions = [
  { value: 'in_person', label: 'Attending in person', icon: Users },
  { value: 'online', label: 'Watching online', icon: Wifi },
  { value: 'not_attending', label: 'Unable to attend', icon: X },
]

export function RSVPSection({ memorialId, serviceEventId, stats }: RSVPSectionProps) {
  const [formData, setFormData] = useState<RSVPFormData>({
    full_name: '',
    email: '',
    mobile: '',
    attendance: 'in_person',
    guest_count: 1,
    dietary: '',
    accessibility: '',
    message_to_family: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RSVPFormData, string>> = {}
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Please enter your name'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (formData.attendance === 'in_person' && formData.guest_count < 1) {
      newErrors.guest_count = 'Please enter number of guests'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          memorial_id: memorialId,
          service_event_id: serviceEventId,
        }),
      })
      
      if (response.ok) {
        setIsSuccess(true)
      } else {
        const data = await response.json()
        setErrors({ email: data.error || 'Something went wrong' })
      }
    } catch (error) {
      setErrors({ email: 'Unable to submit. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof RSVPFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <section id="rsvp" className="section bg-background-elevated/50">
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
              RSVP
            </h2>
            <p className="text-body-md text-foreground-muted max-w-md mx-auto">
              Let us know if you&apos;ll be joining in person or online so we can prepare accordingly.
            </p>
            
            {/* Live stats */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="text-center">
                <p className="text-heading-lg text-accent-gold font-serif">
                  {stats.in_person_count}
                </p>
                <p className="text-caption text-foreground-subtle">
                  in person
                </p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-heading-lg text-accent-gold font-serif">
                  {stats.online_count}
                </p>
                <p className="text-caption text-foreground-subtle">
                  online
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-serif text-heading-lg text-foreground mb-2">
                    Thank you for responding
                  </h3>
                  <p className="text-body-md text-foreground-muted">
                    We&apos;ve received your RSVP. We look forward to seeing you.
                  </p>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Attendance type selector */}
                    <div>
                      <label className="block text-body-sm font-medium text-foreground-muted mb-3">
                        How will you be attending?
                      </label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {attendanceOptions.map((option) => {
                          const Icon = option.icon
                          const isSelected = formData.attendance === option.value
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleChange('attendance', option.value)}
                              className={cn(
                                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
                                isSelected
                                  ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                                  : 'border-border bg-background-subtle text-foreground-muted hover:border-foreground-subtle'
                              )}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-body-sm font-medium">{option.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Personal details */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Your name"
                        placeholder="Full name"
                        value={formData.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        error={errors.full_name}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        error={errors.email}
                        required
                      />
                    </div>

                    <Input
                      label="Mobile (optional)"
                      type="tel"
                      placeholder="0400 000 000"
                      value={formData.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      hint="For last-minute updates only"
                    />

                    {/* In-person specific fields */}
                    {formData.attendance === 'in_person' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <Select
                          label="Number of guests (including yourself)"
                          value={String(formData.guest_count)}
                          onChange={(e) => handleChange('guest_count', parseInt(e.target.value))}
                          options={[
                            { value: '1', label: '1 person' },
                            { value: '2', label: '2 people' },
                            { value: '3', label: '3 people' },
                            { value: '4', label: '4 people' },
                            { value: '5', label: '5+ people' },
                          ]}
                          error={errors.guest_count}
                        />

                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            label="Dietary requirements (optional)"
                            placeholder="e.g. Vegetarian, gluten-free"
                            value={formData.dietary}
                            onChange={(e) => handleChange('dietary', e.target.value)}
                          />
                          <Input
                            label="Accessibility needs (optional)"
                            placeholder="e.g. Wheelchair access"
                            value={formData.accessibility}
                            onChange={(e) => handleChange('accessibility', e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Message to family */}
                    {formData.attendance !== 'not_attending' && (
                      <Textarea
                        label="Message to the family (optional)"
                        placeholder="Share a thought or memory..."
                        value={formData.message_to_family}
                        onChange={(e) => handleChange('message_to_family', e.target.value)}
                        rows={3}
                      />
                    )}

                    {/* Submit */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        Submit RSVP
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
