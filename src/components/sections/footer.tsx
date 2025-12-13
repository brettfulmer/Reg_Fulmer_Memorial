'use client'

import { Heart } from 'lucide-react'

interface FooterProps {
  memorialName: string
}

export function Footer({ memorialName }: FooterProps) {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-12 px-4 border-t border-border/50">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-body-sm text-foreground-subtle mb-4">
          In loving memory of {memorialName}
        </p>
        <div className="flex items-center justify-center gap-1 text-caption text-foreground-subtle/50">
          <span>Made with</span>
          <Heart className="w-3 h-3 text-accent-gold fill-accent-gold" />
          <span>for the family</span>
        </div>
      </div>
    </footer>
  )
}
