// Database types matching Supabase schema

export interface Memorial {
  id: string
  slug: string
  full_name: string
  preferred_name: string
  dob: string // ISO date
  dod: string // ISO date
  hero_photo_url: string | null
  short_bio: string
  tone_note: string | null
  primary_city: string
  page_title: string
  created_at: string
  updated_at: string
}

export interface ServiceEvent {
  id: string
  memorial_id: string
  event_type: string
  start_datetime: string // ISO datetime
  duration_minutes: number
  venue_name: string
  venue_parent: string | null
  address_line: string
  google_maps_url: string | null
  parking_notes: string | null
  public_transport_notes: string | null
  accessibility_notes: string | null
  dress_code: string | null
  kids_welcome: boolean
  after_gathering_title: string | null
  after_gathering_details: string | null
  livestream_enabled: boolean
  livestream_url: string | null
  livestream_notes: string | null
  created_at: string
  updated_at: string
}

export interface RSVP {
  id: string
  memorial_id: string
  service_event_id: string
  full_name: string
  email: string
  mobile: string | null
  attendance: 'in_person' | 'online' | 'not_attending'
  guest_count: number
  dietary: string | null
  accessibility: string | null
  message_to_family: string | null
  created_at: string
}

export interface MemoryPost {
  id: string
  memorial_id: string
  name: string
  message: string
  photo_url: string | null
  video_url: string | null
  audio_url: string | null
  can_share_at_service: boolean
  approved: boolean
  featured: boolean
  created_at: string
}

export type TravelTipCategory =
  | 'flights'
  | 'accommodation'
  | 'getting_around'
  | 'food_coffee'
  | 'before_service'
  | 'after_service'
  | 'beaches_walks'

export interface TravelTip {
  id: string
  memorial_id: string
  category: TravelTipCategory
  title: string
  description: string
  link: string | null
  priority: number
  created_at: string
}

export interface VoiceAgentConfig {
  id: string
  memorial_id: string
  status: 'coming_soon' | 'live'
  callout_text: string | null
  embed_type: 'iframe' | 'web_widget' | 'none'
  embed_code: string | null
  fallback_phone_number: string | null
  created_at: string
  updated_at: string
}

// Aggregated types for page data
export interface MemorialPageData {
  memorial: Memorial
  service_event: ServiceEvent | null
  travel_tips: TravelTip[]
  memories: MemoryPost[]
  voice_config: VoiceAgentConfig | null
  rsvp_stats: RSVPStats
}

export interface RSVPStats {
  in_person_count: number
  online_count: number
  total_guests: number
}

// Form types
export interface RSVPFormData {
  full_name: string
  email: string
  mobile: string
  attendance: 'in_person' | 'online' | 'not_attending'
  guest_count: number
  dietary: string
  accessibility: string
  message_to_family: string
}

export interface MemoryFormData {
  name: string
  message: string
  photo?: File
  audio?: Blob
  can_share_at_service: boolean
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}
