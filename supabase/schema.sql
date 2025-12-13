-- Reg Fulmer Memorial Hub - Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Memorial table
CREATE TABLE memorials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  preferred_name TEXT NOT NULL,
  dob DATE NOT NULL,
  dod DATE NOT NULL,
  hero_photo_url TEXT,
  short_bio TEXT NOT NULL,
  tone_note TEXT,
  primary_city TEXT NOT NULL,
  page_title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service events table
CREATE TABLE service_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'Celebration of Life',
  start_datetime TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  venue_name TEXT NOT NULL,
  venue_parent TEXT,
  address_line TEXT NOT NULL,
  google_maps_url TEXT,
  parking_notes TEXT,
  public_transport_notes TEXT,
  accessibility_notes TEXT,
  dress_code TEXT,
  kids_welcome BOOLEAN DEFAULT true,
  after_gathering_title TEXT,
  after_gathering_details TEXT,
  livestream_enabled BOOLEAN DEFAULT false,
  livestream_url TEXT,
  livestream_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVPs table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,
  service_event_id UUID REFERENCES service_events(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  attendance TEXT NOT NULL CHECK (attendance IN ('in_person', 'online', 'not_attending')),
  guest_count INTEGER DEFAULT 1,
  dietary TEXT,
  accessibility TEXT,
  message_to_family TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(memorial_id, email)
);

-- Memory posts table
CREATE TABLE memory_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  can_share_at_service BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  ai_sentiment TEXT, -- AI-detected sentiment: positive, neutral, negative
  ai_moderation_score FLOAT, -- AI moderation confidence score
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Travel tips table
CREATE TABLE travel_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('flights', 'accommodation', 'getting_around', 'food_coffee', 'before_service', 'after_service', 'beaches_walks')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice agent config table
CREATE TABLE voice_agent_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('coming_soon', 'live')),
  callout_text TEXT,
  embed_type TEXT DEFAULT 'none' CHECK (embed_type IN ('iframe', 'web_widget', 'none')),
  embed_code TEXT,
  fallback_phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_rsvps_memorial_id ON rsvps(memorial_id);
CREATE INDEX idx_rsvps_attendance ON rsvps(attendance);
CREATE INDEX idx_memory_posts_memorial_id ON memory_posts(memorial_id);
CREATE INDEX idx_memory_posts_approved ON memory_posts(approved);
CREATE INDEX idx_travel_tips_memorial_id ON travel_tips(memorial_id);
CREATE INDEX idx_travel_tips_category ON travel_tips(category);

-- Enable Row Level Security
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_agent_configs ENABLE ROW LEVEL SECURITY;

-- Public read access for memorials
CREATE POLICY "Memorials are publicly viewable" ON memorials
  FOR SELECT USING (true);

-- Public read access for service events
CREATE POLICY "Service events are publicly viewable" ON service_events
  FOR SELECT USING (true);

-- Public can create RSVPs, only authenticated users can view
CREATE POLICY "Anyone can create RSVPs" ON rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can view RSVPs" ON rsvps
  FOR SELECT USING (auth.role() = 'authenticated');

-- Public can create and view approved memories
CREATE POLICY "Anyone can create memories" ON memory_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view approved memories" ON memory_posts
  FOR SELECT USING (approved = true);

-- Public read access for travel tips
CREATE POLICY "Travel tips are publicly viewable" ON travel_tips
  FOR SELECT USING (true);

-- Public read access for voice config
CREATE POLICY "Voice config is publicly viewable" ON voice_agent_configs
  FOR SELECT USING (true);

-- Analytics table for tracking visits and engagement
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- page_view, rsvp_submit, memory_post, share, etc.
  event_data JSONB,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_memorial_id ON analytics_events(memorial_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);

-- Photo gallery table for organizing photos
CREATE TABLE photo_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  ai_description TEXT, -- AI-generated photo description
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photo_gallery_memorial_id ON photo_gallery(memorial_id);

-- Public read access for gallery
ALTER TABLE photo_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Photo gallery is publicly viewable" ON photo_gallery
  FOR SELECT USING (true);

-- Admin users table (for role-based access)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'moderator', 'viewer')),
  memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE, -- NULL means global admin
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_memorial_id ON admin_users(memorial_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_memorials_updated_at
  BEFORE UPDATE ON memorials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_events_updated_at
  BEFORE UPDATE ON service_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_agent_configs_updated_at
  BEFORE UPDATE ON voice_agent_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data for Reg Fulmer
INSERT INTO memorials (
  slug, full_name, preferred_name, dob, dod, 
  short_bio, primary_city, page_title
) VALUES (
  'reg-fulmer',
  'Reginald "Reg" Fulmer',
  'Reg',
  '1942-11-26',
  '2025-12-10',
  'Reg was deeply loved by his family and friends and spent most of his life in Maroubra. He was known for his dry humour, stubborn charm, and loyalty to the people he cared about.',
  'Maroubra, NSW',
  'In Loving Memory of Reg Fulmer'
);

-- Get the memorial ID for foreign key references
DO $$
DECLARE
  memorial_uuid UUID;
  service_uuid UUID;
BEGIN
  SELECT id INTO memorial_uuid FROM memorials WHERE slug = 'reg-fulmer';
  
  -- Insert service event
  INSERT INTO service_events (
    memorial_id, event_type, start_datetime, duration_minutes,
    venue_name, venue_parent, address_line, google_maps_url,
    parking_notes, public_transport_notes, accessibility_notes,
    dress_code, kids_welcome, after_gathering_title, after_gathering_details,
    livestream_enabled, livestream_url, livestream_notes
  ) VALUES (
    memorial_uuid,
    'Celebration of Life',
    '2026-01-22 14:00:00+11',
    60,
    'Horizons',
    'South Maroubra Surf Club',
    'Marine Parade, Maroubra NSW 2035',
    'https://maps.google.com/?q=South+Maroubra+Surf+Club',
    'Parking is available in the Surf Club car park and along Marine Parade and nearby streets. Please arrive 10–15 minutes early.',
    'Buses run regularly to Maroubra. Use your maps app and search "South Maroubra Surf Club" for the easiest route.',
    'Generally accessible with level or ramp access via the Surf Club entrance. Seating can be arranged for those with limited mobility.',
    'Smart casual. Wear what feels respectful and comfortable.',
    true,
    'Gathering afterwards',
    'Family and friends are welcome to stay at Horizons after the service to share memories and spend time together. Light refreshments will be available.',
    true,
    'https://memorial.regfulmer.au/live',
    'Stream opens around 1:50 pm AEDT. If it doesn''t start immediately, refresh the page.'
  ) RETURNING id INTO service_uuid;

  -- Insert voice agent config
  INSERT INTO voice_agent_configs (memorial_id, status, callout_text)
  VALUES (memorial_uuid, 'coming_soon', 'Ask questions about the service details by voice.');

  -- Insert travel tips
  INSERT INTO travel_tips (memorial_id, category, title, description, priority) VALUES
    (memorial_uuid, 'flights', 'Fly into Sydney (SYD)', 'Sydney Airport is the closest major airport. Allow extra time for traffic if arriving on the day.', 1),
    (memorial_uuid, 'flights', 'Arrive the day before if you can', 'It makes everything calmer and gives you time to settle in.', 2),
    (memorial_uuid, 'accommodation', 'Stay near Maroubra / Coogee / Randwick', 'These areas are closest to the venue and keep travel simple.', 1),
    (memorial_uuid, 'accommodation', 'Bondi is fine too', 'Bondi is a short drive away but can be busier and pricier.', 2),
    (memorial_uuid, 'getting_around', 'Rideshare is easiest', 'Uber and taxis are reliable. If you''re driving, arrive early for parking.', 1),
    (memorial_uuid, 'getting_around', 'Public transport', 'Buses run frequently around the eastern suburbs.', 2),
    (memorial_uuid, 'food_coffee', 'Grab coffee before the service', 'There are cafes along Maroubra Road and nearby streets.', 1),
    (memorial_uuid, 'food_coffee', 'Simple lunch nearby', 'There are casual dining options around Maroubra Junction.', 2),
    (memorial_uuid, 'before_service', 'Arrive 15–20 minutes early', 'It helps with parking and gives you time to settle.', 1),
    (memorial_uuid, 'before_service', 'Bring a light jacket', 'It can be breezy by the water.', 2),
    (memorial_uuid, 'after_service', 'Stay at Horizons', 'You''re welcome to remain after the service to share memories and spend time together.', 1),
    (memorial_uuid, 'after_service', 'Beach walk if you need air', 'A short walk along the beachfront can be a good reset.', 2),
    (memorial_uuid, 'beaches_walks', 'Maroubra Beach walk', 'A straightforward beach walk right near the venue.', 1),
    (memorial_uuid, 'beaches_walks', 'Coastal track nearby', 'If you''re staying longer, there are scenic coastal walks in the area.', 2);
END $$;
