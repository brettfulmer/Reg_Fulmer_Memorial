'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Heart, Image as ImageIcon, Send, Check, Clock, LogIn } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getRelativeTime, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { MemoryPost, MemoryFormData } from '@/types'
import { User } from '@supabase/supabase-js'
import { AudioRecorder } from '@/components/ui/audio-recorder'
import { GuestbookPrinter } from './guestbook-printer'

interface MemoriesSectionProps {
  memorialId: string
  initialMemories: MemoryPost[]
  memorialName: string
}

export function MemoriesSection({ memorialId, initialMemories, memorialName }: MemoriesSectionProps) {
  const router = useRouter()
  const [memories, setMemories] = useState<MemoryPost[]>(initialMemories)
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<MemoryFormData>({
    name: '', // Will be populated from user metadata
    message: '',
    can_share_at_service: false,
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user?.user_metadata?.full_name) {
        setFormData(prev => ({ ...prev, name: user.user_metadata.full_name }))
      }
    })

    const channel = supabase.channel('memories_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'memories' },
        (payload: any) => {
          setMemories(prev => [payload.new as MemoryPost, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleShareClick = () => {
    if (!user) {
      router.push('/login')
      return
    }
    setShowForm(true)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRecordingComplete = (blob: Blob) => {
    setFormData(prev => ({ ...prev, audio: blob }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.message.trim()) {
      setError('Please fill in your name and message')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const submitData = new FormData()
      submitData.append('memorial_id', memorialId)
      submitData.append('name', formData.name)
      submitData.append('message', formData.message)
      submitData.append('can_share_at_service', String(formData.can_share_at_service))
      if (formData.photo) {
        submitData.append('photo', formData.photo)
      }
      if (formData.audio) {
        submitData.append('audio', formData.audio)
      }

      const response = await fetch('/api/memories', {
        method: 'POST',
        body: submitData,
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData(prev => ({ ...prev, message: '', can_share_at_service: false, photo: undefined, audio: undefined }))
        setPhotoPreview(null)

        setTimeout(() => {
          setIsSuccess(false)
          setShowForm(false)
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to post memory')
      }
    } catch (err) {
      setError('Unable to post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="memories" className="section bg-background/50 backdrop-blur-sm relative z-10">
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
              Memories & Messages
            </h2>
            <p className="text-body-md text-foreground-muted max-w-md mx-auto mb-8">
              Share your favourite memories or leave a message for the family.
            </p>

            <div className="flex justify-center gap-4">
              {!showForm && (
                <Button
                  variant="primary"
                  onClick={handleShareClick}
                  leftIcon={user ? <MessageSquare className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                >
                  {user ? 'Share a memory' : 'Sign in to share'}
                </Button>
              )}
              <GuestbookPrinter memories={memories} memorialName={memorialName} />
            </div>
          </div>

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-12"
              >
                <Card>
                  {isSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-6 h-6 text-success" />
                      </div>
                      <p className="text-body-md text-foreground">
                        Thank you for sharing
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
                      // Optionally disable if we want to enforce real names
                      />

                      <Textarea
                        label="Your message"
                        placeholder={`Share a memory of ${memorialName}...`}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        required
                      />

                      {/* Photo upload */}
                      <div>
                        <label className="block text-body-sm font-medium text-foreground-muted mb-2">
                          Add a photo (optional)
                        </label>
                        <div className="flex items-start gap-4">
                          {photoPreview ? (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                              <Image
                                src={photoPreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPhotoPreview(null)
                                  setFormData(prev => ({ ...prev, photo: undefined }))
                                }}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center text-foreground-muted hover:text-foreground"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-foreground-subtle transition-colors">
                              <ImageIcon className="w-5 h-5 text-foreground-subtle" />
                              <span className="text-caption text-foreground-subtle">Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                        <p className="text-caption text-foreground-muted mt-2">
                          Photos will be added to the Living Wall background.
                        </p>
                      </div>

                      {/* Audio Recorder */}
                      <div>
                        <label className="block text-body-sm font-medium text-foreground-muted mb-2">
                          Leave a voice message (optional)
                        </label>
                        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                      </div>

                      {/* Share at service checkbox */}
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

                      {error && (
                        <p className="text-body-sm text-error">{error}</p>
                      )}

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
          </AnimatePresence>

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
                  <Card variant="elevated" padding="sm">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-body-md font-medium text-accent-gold">
                          {memory.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-body-sm font-medium text-foreground">
                            {memory.name}
                          </span>
                          <span className="text-caption text-foreground-subtle flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(memory.created_at)}
                          </span>
                        </div>
                        <p className="text-body-md text-foreground-muted whitespace-pre-wrap">
                          {memory.message}
                        </p>

                        {/* Photo */}
                        {memory.photo_url && (
                          <div className="mt-3 relative w-full max-w-sm aspect-video rounded-xl overflow-hidden">
                            <Image
                              src={memory.photo_url}
                              alt="Memory photo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Audio */}
                        {memory.audio_url && (
                          <div className="mt-3">
                            <audio controls src={memory.audio_url} className="w-full h-8" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card variant="elevated" className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-foreground-subtle mx-auto mb-4" />
              <p className="text-body-md text-foreground-muted">
                No messages yet. Be the first to share a memory.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  )
}
