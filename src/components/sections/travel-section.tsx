
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plane,
  Home,
  Car,
  Coffee,
  Clock,
  Sunset,
  Waves,
  ExternalLink,
  MapPin
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { TravelTip, TravelTipCategory } from '@/types'

interface TravelSectionProps {
  tips: TravelTip[]
  venueName: string
  googleMapsUrl: string | null
}

const categories: { id: TravelTipCategory; label: string; icon: typeof Plane }[] = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'accommodation', label: 'Stay', icon: Home },
  { id: 'getting_around', label: 'Getting around', icon: Car },
  { id: 'food_coffee', label: 'Food & coffee', icon: Coffee },
  { id: 'before_service', label: 'Before', icon: Clock },
  { id: 'after_service', label: 'After', icon: Sunset },
  { id: 'beaches_walks', label: 'Explore', icon: Waves },
]

export function TravelSection({ tips, venueName, googleMapsUrl }: TravelSectionProps) {
  const [activeCategory, setActiveCategory] = useState<TravelTipCategory>('flights')

  const filteredTips = tips.filter(tip => tip.category === activeCategory)
  const availableCategories = categories.filter(cat =>
    tips.some(tip => tip.category === cat.id)
  )

  if (tips.length === 0) {
    return null
  }

  return (
    <section id="travel" className="section bg-background-elevated/50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-display-sm md:text-display-md text-foreground mb-4">
              Travel & Stay
            </h2>
            <p className="text-body-md text-foreground-muted max-w-md mx-auto">
              Everything you need to plan your visit to {venueName.split(' ')[0]}
            </p>
          </div>

          {/* Category tabs */}
          <div className="mb-8 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max px-1 pb-2 justify-center">
              {availableCategories.map((category) => {
                const Icon = category.icon
                const isActive = activeCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-body-sm font-medium',
                      'transition-all duration-200',
                      isActive
                        ? 'bg-accent-gold text-background shadow-glow-sm'
                        : 'bg-background-subtle text-foreground-muted hover:bg-background-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tips grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-4"
            >
              {filteredTips
                .sort((a, b) => a.priority - b.priority)
                .map((tip, index) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card variant="elevated" padding="sm" className="h-full">
                      <div className="flex flex-col h-full">
                        <h3 className="text-body-md font-medium text-foreground mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-body-sm text-foreground-muted flex-1">
                          {tip.description}
                        </p>
                        {tip.link && (
                          <a
                            href={tip.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 text-body-sm text-accent-gold hover:text-accent-gold-light transition-colors"
                          >
                            Learn more
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>

          {/* Map link */}
          {googleMapsUrl && (
            <div className="mt-8 text-center">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-background-subtle border border-border text-foreground-muted hover:text-foreground hover:border-foreground-subtle transition-all duration-200"
              >
                <MapPin className="w-4 h-4" />
                View venue on Google Maps
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
