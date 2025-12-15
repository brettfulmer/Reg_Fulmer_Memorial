import { useParams, Navigate } from 'react-router-dom'
import { HeroSection } from '@/components/sections/hero-section'
import { QuickActionsBar } from '@/components/sections/quick-actions-bar'
import { ServiceSection } from '@/components/sections/service-section'
import { RSVPSection } from '@/components/sections/rsvp-section'
import { LivestreamSection } from '@/components/sections/livestream-section'
import { TravelSection } from '@/components/sections/travel-section'
import { MemoriesSection } from '@/components/sections/memories-section'
import { VoiceAgentSection } from '@/components/sections/voice-agent-section'
import { TimelineSection } from '@/components/sections/timeline-section'
import { Footer } from '@/components/sections/footer'
import { memorialData, serviceEvent, travelTips, voiceConfig, initialRsvpStats } from '@/data/memorialContent'

function MemorialPage() {
  const { slug } = useParams<{ slug: string }>()

  // Only support reg-fulmer for now
  if (slug !== 'reg-fulmer') {
    return <Navigate to="/m/reg-fulmer" replace />
  }

  const pageUrl = `${window.location.origin}/m/${slug}`

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Quick actions bar */}
      <QuickActionsBar
        serviceEvent={serviceEvent}
        pageUrl={pageUrl}
        pageName={memorialData.page_title}
      />

      {/* Hero */}
      <HeroSection
        memorial={memorialData}
        serviceEvent={serviceEvent}
      />

      {/* Service details */}
      <ServiceSection 
        serviceEvent={serviceEvent} 
        memorialName={memorialData.preferred_name}
      />

      {/* RSVP */}
      <RSVPSection
        memorialId={memorialData.id}
        serviceEventId={serviceEvent.id}
        stats={initialRsvpStats}
      />

      {/* Livestream */}
      {serviceEvent.livestream_enabled && (
        <LivestreamSection serviceEvent={serviceEvent} />
      )}

      {/* Travel concierge */}
      <TravelSection 
        tips={travelTips}
        venueName={serviceEvent.venue_name}
        googleMapsUrl={serviceEvent.google_maps_url || ''}
      />

      {/* Timeline (if we add timeline data later) */}
      <TimelineSection />

      {/* Memories wall */}
      <MemoriesSection
        memorialId={memorialData.id}
        memories={[]}
      />

      {/* Voice agent */}
      <VoiceAgentSection 
        config={voiceConfig}
        memorialName={memorialData.preferred_name}
      />

      {/* Footer */}
      <Footer />
    </main>
  )
}

export default MemorialPage
