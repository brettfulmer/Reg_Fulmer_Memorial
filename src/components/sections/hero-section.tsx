'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Countdown } from '@/components/ui/countdown'
import { formatDateRange } from '@/lib/utils'
import type { Memorial, ServiceEvent } from '@/types'

interface HeroSectionProps {
  memorial: Memorial
  serviceEvent: ServiceEvent | null
}

export function HeroSection({ memorial, serviceEvent }: HeroSectionProps) {
  const dateRange = formatDateRange(memorial.dob, memorial.dod)
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-gold/5 via-background to-background" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container-narrow px-4 py-20 text-center">
        {/* Photo */}
        {memorial.hero_photo_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="mb-10"
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-2 border-accent-gold/30 shadow-glow">
              <Image
                src={memorial.hero_photo_url}
                alt={memorial.full_name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-display-md md:text-display-lg text-foreground mb-4 text-balance"
        >
          {memorial.page_title}
        </motion.h1>

        {/* Dates */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-body-lg text-foreground-muted mb-8"
        >
          {dateRange}
        </motion.p>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-body-md text-foreground-muted max-w-xl mx-auto mb-12 leading-relaxed"
        >
          {memorial.short_bio}
        </motion.p>

        {/* Countdown */}
        {serviceEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-caption uppercase tracking-widest text-foreground-subtle mb-4">
              Service begins in
            </p>
            <Countdown 
              targetDate={serviceEvent.start_datetime} 
              className="justify-center"
            />
          </motion.div>
        )}

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent mx-auto"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border border-foreground-subtle/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-foreground-subtle/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
