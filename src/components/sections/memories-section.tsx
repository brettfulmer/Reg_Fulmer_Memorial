import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getRelativeTime } from '@/lib/utils'
import type { MemoryPost } from '@/types'

interface MemoriesSectionProps {
  memorialId: string
  memories: MemoryPost[]
}

export function MemoriesSection({ memorialId, memories }: MemoriesSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    can_share_at_service: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSuccess(true)
    setIsSubmitting(false)
    
    setTimeout(() => {
      setShowForm(false)
      setIsSuccess(false)
      setFormData({ name: '', message: '', can_share_at_service: false })
    }, 2000)
  }

  return (
    <section id="memories" className="section bg-background-elevated">
      <div className="container-narrow px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-display-sm mb-4">Share a Memory</h2>
          <p className="text-body-md text-foreground-muted max-w-xl mx-auto">
            Leave a message, share a photo, or tell a story.
          </p>
        </div>

        {/* Add memory button */}
        {!showForm && (
          <div className="text-center mb-8">
            <Button
              variant="primary"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => setShowForm(true)}
            >
              Leave a memory
            </Button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-4">
                    <Check className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="font-serif text-heading-md mb-2">Thank you</h3>
                  <p className="text-body-sm text-foreground-muted">
                    Your memory has been submitted.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Your name"
                    placeholder="How would you like to be identified?"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />

                  <Textarea
                    label="Your message"
                    placeholder="Share a memory..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    required
                  />

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.can_share_at_service}
                      onChange={(e) => setFormData(prev => ({ ...prev, can_share_at_service: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-border bg-background-subtle text-accent-gold focus:ring-accent-gold"
                    />
                    <span className="text-body-sm text-foreground-muted">
                      This memory can be shared during the service
                    </span>
                  </label>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isSubmitting}
                      leftIcon={<Send className="w-4 h-4" />}
                    >
                      Post message
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        )}

        {/* Memories list */}
        {memories.length > 0 ? (
          <div className="space-y-4">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-medium text-foreground">{memory.name}</span>
                        <span className="text-caption text-foreground-subtle">
                          {getRelativeTime(memory.created_at)}
                        </span>
                      </div>
                      <p className="text-body-md text-foreground-muted whitespace-pre-wrap">
                        {memory.message}
                      </p>
                      {memory.photo_url && (
                        <img
                          src={memory.photo_url}
                          alt="Memory"
                          className="mt-4 rounded-lg max-w-sm"
                        />
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-foreground-muted">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-body-md">No memories shared yet. Be the first!</p>
          </div>
        )}
      </div>
    </section>
  )
}
