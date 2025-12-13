'use client'

import { useState, useEffect } from 'react'
import { getCountdown, type CountdownTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CountdownProps {
  targetDate: string | Date
  className?: string
  onComplete?: () => void
}

export function Countdown({ targetDate, className, onComplete }: CountdownProps) {
  const [countdown, setCountdown] = useState<CountdownTime>(() => getCountdown(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdown = getCountdown(targetDate)
      setCountdown(newCountdown)
      
      if (newCountdown.isOver && onComplete) {
        onComplete()
        clearInterval(interval)
      }
    }, 1000 * 60) // Update every minute

    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  if (countdown.isPast) {
    return (
      <div className={cn('text-accent-gold font-medium', className)}>
        Service has begun
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <CountdownUnit value={countdown.days} label="days" />
      <CountdownSeparator />
      <CountdownUnit value={countdown.hours} label="hours" />
      <CountdownSeparator />
      <CountdownUnit value={countdown.minutes} label="min" />
    </div>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-display-sm md:text-display-md text-foreground tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-caption uppercase tracking-wider text-foreground-subtle">
        {label}
      </div>
    </div>
  )
}

function CountdownSeparator() {
  return (
    <div className="text-foreground-subtle text-heading-lg font-light opacity-50">
      :
    </div>
  )
}

// Compact version for navbar/header
export function CountdownCompact({ targetDate, className }: Omit<CountdownProps, 'onComplete'>) {
  const [countdown, setCountdown] = useState<CountdownTime>(() => getCountdown(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(targetDate))
    }, 1000 * 60)

    return () => clearInterval(interval)
  }, [targetDate])

  if (countdown.isPast) {
    return (
      <span className={cn('text-accent-gold', className)}>
        Now
      </span>
    )
  }

  const parts: string[] = []
  if (countdown.days > 0) parts.push(`${countdown.days}d`)
  if (countdown.hours > 0) parts.push(`${countdown.hours}h`)
  if (countdown.days === 0 && countdown.minutes > 0) parts.push(`${countdown.minutes}m`)

  return (
    <span className={cn('tabular-nums', className)}>
      {parts.join(' ')}
    </span>
  )
}
