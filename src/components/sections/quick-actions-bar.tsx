
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  Video, 
  Plane, 
  MessageSquare, 
  Share2,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scrollToElement, shareContent, cn } from '@/lib/utils'
import type { ServiceEvent } from '@/types'

interface QuickActionsBarProps {
  serviceEvent: ServiceEvent | null
  pageUrl: string
  pageName: string
}

const navItems = [
  { id: 'service', label: 'Service', icon: Calendar },
  { id: 'rsvp', label: 'RSVP', icon: Users },
  { id: 'livestream', label: 'Livestream', icon: Video },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'memories', label: 'Memories', icon: MessageSquare },
]

export function QuickActionsBar({ serviceEvent, pageUrl, pageName }: QuickActionsBarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
      
      // Determine active section
      const sections = navItems.map(item => item.id)
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (id: string) => {
    scrollToElement(id, 100)
    setMobileMenuOpen(false)
  }

  const handleShare = async () => {
    await shareContent({
      title: pageName,
      url: pageUrl,
    })
  }

  // Filter items based on whether livestream is enabled
  const visibleItems = navItems.filter(item => {
    if (item.id === 'livestream' && !serviceEvent?.livestream_enabled) return false
    return true
  })

  return (
    <>
      {/* Desktop nav */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isScrolled ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      >
        <div className="nav-blur px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-1">
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-body-sm font-medium transition-all duration-200',
                    'hover:bg-background-subtle',
                    activeSection === item.id 
                      ? 'text-accent-gold bg-accent-gold/10' 
                      : 'text-foreground-muted'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              Share
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile bottom nav */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      >
        <div className="nav-blur border-t border-border/50 px-2 py-2 safe-area-pb">
          <div className="flex items-center justify-around">
            {visibleItems.slice(0, 4).map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200',
                    activeSection === item.id 
                      ? 'text-accent-gold' 
                      : 'text-foreground-muted'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              )
            })}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-foreground-muted"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-foreground-muted"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="flex items-center gap-4 px-8 py-4 rounded-xl text-heading-md text-foreground hover:bg-background-subtle transition-colors w-full max-w-xs"
                    >
                      <Icon className="w-6 h-6 text-accent-gold" />
                      {item.label}
                    </button>
                  )
                })}
                <div className="divider my-4 max-w-xs" />
                <button
                  onClick={handleShare}
                  className="flex items-center gap-4 px-8 py-4 rounded-xl text-heading-md text-foreground-muted hover:bg-background-subtle transition-colors w-full max-w-xs"
                >
                  <Share2 className="w-6 h-6" />
                  Share this page
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
