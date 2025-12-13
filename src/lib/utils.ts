import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting
export function formatDate(date: string | Date, formatStr: string = 'EEEE, d MMMM yyyy') {
  return format(new Date(date), formatStr)
}

export function formatTime(date: string | Date, formatStr: string = 'h:mm a') {
  return format(new Date(date), formatStr)
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), "EEEE, d MMMM yyyy 'at' h:mm a")
}

export function formatDateRange(dob: string, dod: string) {
  const birthYear = format(new Date(dob), 'd MMMM yyyy')
  const deathYear = format(new Date(dod), 'd MMMM yyyy')
  return `${birthYear} – ${deathYear}`
}

export function getRelativeTime(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

// Countdown calculation
export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  isOver: boolean
  isPast: boolean
}

export function getCountdown(targetDate: string | Date): CountdownTime {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target.getTime() - now.getTime()
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isOver: true, isPast: true }
  }

  const days = differenceInDays(target, now)
  const hours = differenceInHours(target, now) % 24
  const minutes = differenceInMinutes(target, now) % 60

  return { days, hours, minutes, isOver: false, isPast: false }
}

export function formatCountdown(countdown: CountdownTime): string {
  if (countdown.isPast) {
    return 'Service has begun'
  }
  
  const parts: string[] = []
  
  if (countdown.days > 0) {
    parts.push(`${countdown.days} day${countdown.days !== 1 ? 's' : ''}`)
  }
  if (countdown.hours > 0) {
    parts.push(`${countdown.hours} hour${countdown.hours !== 1 ? 's' : ''}`)
  }
  if (countdown.minutes > 0 && countdown.days === 0) {
    parts.push(`${countdown.minutes} minute${countdown.minutes !== 1 ? 's' : ''}`)
  }
  
  return parts.join(', ') || 'Starting soon'
}

// Generate ICS calendar file content
export function generateICSFile(event: {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
  url?: string
}): string {
  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escapeICS = (str: string) => {
    return str.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Memorial Service//EN
BEGIN:VEVENT
UID:${Date.now()}@memorial
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(event.startDate)}
DTEND:${formatICSDate(event.endDate)}
SUMMARY:${escapeICS(event.title)}
DESCRIPTION:${escapeICS(event.description)}
LOCATION:${escapeICS(event.location)}
${event.url ? `URL:${event.url}` : ''}
END:VEVENT
END:VCALENDAR`
}

// Download ICS file
export function downloadICSFile(content: string, filename: string = 'event.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

// Share functionality
export async function shareContent(data: ShareData): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data)
      return true
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err)
      }
      return false
    }
  }
  // Fallback to clipboard
  return copyToClipboard(data.url || data.text || '')
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone (Australian format)
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '')
  const phoneRegex = /^(\+61|0)?4\d{8}$|^(\+61|0)?[2-9]\d{7,8}$/
  return phoneRegex.test(cleaned)
}

// Format phone number
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

// Smooth scroll to element
export function scrollToElement(elementId: string, offset: number = 80) {
  const element = document.getElementById(elementId)
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '…'
}

// Pluralize
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`)
}
