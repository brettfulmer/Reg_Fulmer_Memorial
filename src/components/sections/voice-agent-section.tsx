
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Phone, MessageCircle, X, Volume2, VolumeX } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VoiceAgentConfig } from '@/types'

interface VoiceAgentSectionProps {
  config: VoiceAgentConfig | null
  memorialName: string
}

export function VoiceAgentSection({ config, memorialName }: VoiceAgentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // If no config or disabled, show coming soon
  const isLive = config?.status === 'live'

  return (
    <section className="section-sm">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card variant="glass" className="relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-radial from-accent-gold/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Icon with pulse animation */}
                <div className="relative">
                  <div className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center',
                    isLive ? 'bg-accent-gold/20' : 'bg-background-subtle'
                  )}>
                    <Mic className={cn(
                      'w-8 h-8',
                      isLive ? 'text-accent-gold' : 'text-foreground-subtle'
                    )} />
                  </div>
                  {isLive && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-serif text-heading-lg text-foreground mb-2">
                    {isLive ? 'Need the details fast?' : 'Voice assistant coming soon'}
                  </h3>
                  <p className="text-body-md text-foreground-muted mb-4">
                    {isLive 
                      ? config?.callout_text || `Ask questions about the service details for ${memorialName}.`
                      : 'Soon you\'ll be able to ask questions about the service details by voice.'
                    }
                  </p>
                  
                  {/* Actions */}
                  {isLive ? (
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="primary"
                        onClick={() => setIsExpanded(true)}
                        leftIcon={<Mic className="w-4 h-4" />}
                      >
                        Start voice assistant
                      </Button>
                      {config?.fallback_phone_number && (
                        <Button
                          variant="secondary"
                          leftIcon={<Phone className="w-4 h-4" />}
                          onClick={() => window.open(`tel:${config.fallback_phone_number}`, '_self')}
                        >
                          Call instead
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-body-sm text-foreground-subtle">
                      <MessageCircle className="w-4 h-4" />
                      Check back closer to the service date
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Voice modal */}
          <AnimatePresence>
            {isExpanded && isLive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-md"
                >
                  <Card className="relative">
                    {/* Close button */}
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="absolute top-4 right-4 p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-subtle transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="text-center py-8">
                      {/* Voice visualization */}
                      <div className="relative w-32 h-32 mx-auto mb-8">
                        {/* Outer rings */}
                        <div className={cn(
                          'absolute inset-0 rounded-full border-2 border-accent-gold/20',
                          isListening && 'animate-ping'
                        )} />
                        <div className={cn(
                          'absolute inset-4 rounded-full border-2 border-accent-gold/30',
                          isListening && 'animate-pulse'
                        )} />
                        
                        {/* Center button */}
                        <button
                          onClick={() => setIsListening(!isListening)}
                          className={cn(
                            'absolute inset-8 rounded-full flex items-center justify-center transition-all duration-300',
                            isListening 
                              ? 'bg-accent-gold text-background scale-110' 
                              : 'bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30'
                          )}
                        >
                          {isListening ? (
                            <Volume2 className="w-8 h-8 animate-pulse" />
                          ) : (
                            <Mic className="w-8 h-8" />
                          )}
                        </button>
                      </div>

                      <h4 className="font-serif text-heading-md text-foreground mb-2">
                        {isListening ? 'Listening...' : 'Tap to speak'}
                      </h4>
                      <p className="text-body-sm text-foreground-muted">
                        {isListening 
                          ? 'Ask me anything about the service'
                          : 'Ask about times, location, parking, or what to wear'
                        }
                      </p>

                      {/* ElevenLabs embed would go here */}
                      {config?.embed_type === 'iframe' && config?.embed_code && (
                        <div 
                          className="mt-6"
                          dangerouslySetInnerHTML={{ __html: config.embed_code }}
                        />
                      )}
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
