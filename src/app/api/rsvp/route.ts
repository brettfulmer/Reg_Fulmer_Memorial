import { NextRequest, NextResponse } from 'next/server'

// In production, this would use Supabase
// For now, we'll store RSVPs in memory (resets on server restart)
const rsvps: Array<{
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
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      memorial_id,
      service_event_id,
      full_name,
      email,
      mobile,
      attendance,
      guest_count,
      dietary,
      accessibility,
      message_to_family,
    } = body

    // Validate required fields
    if (!full_name || !email || !attendance) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    const existingRsvp = rsvps.find(
      r => r.email.toLowerCase() === email.toLowerCase() && r.memorial_id === memorial_id
    )

    if (existingRsvp) {
      // Update existing RSVP
      Object.assign(existingRsvp, {
        full_name,
        mobile: mobile || null,
        attendance,
        guest_count: guest_count || 1,
        dietary: dietary || null,
        accessibility: accessibility || null,
        message_to_family: message_to_family || null,
      })

      return NextResponse.json({ data: existingRsvp })
    }

    // Create new RSVP
    const newRsvp = {
      id: `rsvp_${Date.now()}`,
      memorial_id,
      service_event_id,
      full_name,
      email,
      mobile: mobile || null,
      attendance,
      guest_count: guest_count || 1,
      dietary: dietary || null,
      accessibility: accessibility || null,
      message_to_family: message_to_family || null,
      created_at: new Date().toISOString(),
    }

    rsvps.push(newRsvp)

    return NextResponse.json({ data: newRsvp })
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json(
      { error: 'Failed to create RSVP' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const memorialId = searchParams.get('memorial_id')

  if (!memorialId) {
    return NextResponse.json(
      { error: 'Memorial ID required' },
      { status: 400 }
    )
  }

  const memorialRsvps = rsvps.filter(r => r.memorial_id === memorialId)
  
  // Calculate stats
  const stats = {
    in_person_count: memorialRsvps
      .filter(r => r.attendance === 'in_person')
      .reduce((sum, r) => sum + r.guest_count, 0),
    online_count: memorialRsvps.filter(r => r.attendance === 'online').length,
    total_guests: memorialRsvps.reduce((sum, r) => sum + r.guest_count, 0),
  }

  return NextResponse.json({ data: memorialRsvps, stats })
}
