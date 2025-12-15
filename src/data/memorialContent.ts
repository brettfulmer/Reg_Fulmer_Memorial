import type { Memorial, ServiceEvent, TravelTip, VoiceAgentConfig, RSVPStats } from '@/types'

export const memorialData: Memorial = {
  id: '1',
  slug: 'reg-fulmer',
  full_name: 'Reginald "Reg" Fulmer',
  preferred_name: 'Reg',
  dob: '1942-11-26',
  dod: '2025-12-10',
  hero_photo_url: null,
  short_bio: 'Reg was deeply loved by his family and friends and spent most of his life in Maroubra. He was known for his dry humour, stubborn charm, and loyalty to the people he cared about.',
  tone_note: null,
  primary_city: 'Maroubra, NSW',
  page_title: 'In Loving Memory of Reg Fulmer',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const serviceEvent: ServiceEvent = {
  id: '1',
  memorial_id: '1',
  event_type: 'Celebration of Life',
  start_datetime: '2026-01-22T14:00:00+11:00',
  duration_minutes: 60,
  venue_name: 'Horizons',
  venue_parent: 'South Maroubra Surf Club',
  address_line: 'Marine Parade, Maroubra NSW 2035',
  google_maps_url: 'https://maps.google.com/?q=South+Maroubra+Surf+Club',
  parking_notes: 'Parking is available in the Surf Club car park and along Marine Parade and nearby streets. Please arrive 10–15 minutes early.',
  public_transport_notes: 'Buses run regularly to Maroubra. Use your maps app and search "South Maroubra Surf Club" for the easiest route.',
  accessibility_notes: 'Generally accessible with level or ramp access via the Surf Club entrance. Seating can be arranged for those with limited mobility.',
  dress_code: 'Smart casual. Wear what feels respectful and comfortable.',
  kids_welcome: true,
  after_gathering_title: 'Gathering afterwards',
  after_gathering_details: 'Family and friends are welcome to stay at Horizons after the service to share memories and spend time together. Light refreshments will be available.',
  livestream_enabled: true,
  livestream_url: '/live',
  livestream_notes: 'Stream opens around 1:50 pm AEDT. If it doesn\'t start immediately, refresh the page.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const travelTips: TravelTip[] = [
  // Flights
  { id: '1', memorial_id: '1', category: 'flights', title: 'Fly into Sydney (SYD)', description: 'Sydney Airport is the closest major airport. Allow extra time for traffic if arriving on the day.', link: null, priority: 1, created_at: new Date().toISOString() },
  { id: '2', memorial_id: '1', category: 'flights', title: 'Arrive the day before if you can', description: 'It makes everything calmer and gives you time to settle in.', link: null, priority: 2, created_at: new Date().toISOString() },
  // Accommodation
  { id: '3', memorial_id: '1', category: 'accommodation', title: 'Stay near Maroubra / Coogee / Randwick', description: 'These areas are closest to the venue and keep travel simple.', link: null, priority: 1, created_at: new Date().toISOString() },
  { id: '4', memorial_id: '1', category: 'accommodation', title: 'Bondi is fine too', description: 'Bondi is a short drive away but can be busier and pricier.', link: null, priority: 2, created_at: new Date().toISOString() },
  // Getting around
  { id: '5', memorial_id: '1', category: 'getting_around', title: 'Rideshare is easiest', description: 'Uber and taxis are reliable. If you\'re driving, arrive early for parking.', link: null, priority: 1, created_at: new Date().toISOString() },
  { id: '6', memorial_id: '1', category: 'getting_around', title: 'Public transport', description: 'Buses run frequently around the eastern suburbs.', link: null, priority: 2, created_at: new Date().toISOString() },
  // Food & coffee
  { id: '7', memorial_id: '1', category: 'food_coffee', title: 'Grab coffee before the service', description: 'There are cafes along Maroubra Road and nearby streets.', link: null, priority: 1, created_at: new Date().toISOString() },
  { id: '8', memorial_id: '1', category: 'food_coffee', title: 'Simple lunch nearby', description: 'There are casual dining options around Maroubra Junction.', link: null, priority: 2, created_at: new Date().toISOString() },
  // Before service
  { id: '9', memorial_id: '1', category: 'before_service', title: 'Arrive 15–20 minutes early', description: 'It helps with parking and gives you time to settle.', link: null, priority: 1, created_at: new Date().toISOString() },
  { id: '10', memorial_id: '1', category: 'before_service', title: 'Bring a light jacket', description: 'It can be breezy by the water.', link: null, priority: 2, created_at: new Date().toISOString() },
  // After service
  { id: '11', memorial_id: '1', category: 'after_service', title: 'Stay at Horizons', description: 'You\'re welcome to remain after the service to share memories and spend time together.', link: null, priority: 1, created_at: new Date().toISOString() },
  { id: '12', memorial_id: '1', category: 'after_service', title: 'Beach walk if you need air', description: 'A short walk along the beachfront can be a good reset.', link: null, priority: 2, created_at: new Date().toISOString() },
  // Beaches & walks
  { id: '13', memorial_id: '1', category: 'beaches_walks', title: 'Maroubra Beach walk', description: 'A straightforward beach walk right near the venue.', link: null, priority: 1, created_at: new Date().toISOString() },
  { id: '14', memorial_id: '1', category: 'beaches_walks', title: 'Coastal track nearby', description: 'If you\'re staying longer, there are scenic coastal walks in the area.', link: null, priority: 2, created_at: new Date().toISOString() },
]

export const voiceConfig: VoiceAgentConfig = {
  id: '1',
  memorial_id: '1',
  status: 'coming_soon',
  callout_text: 'Ask questions about the service details by voice.',
  embed_type: 'none',
  embed_code: null,
  fallback_phone_number: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const initialRsvpStats: RSVPStats = {
  in_person_count: 0,
  online_count: 0,
  total_guests: 0,
}
