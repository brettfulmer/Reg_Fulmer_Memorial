import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    const { data: existingRsvps } = await supabase
      .from('rsvps')
      .select('*')
      .eq('memorial_id', memorial_id)
      .ilike('email', email)
      .limit(1)

    if (existingRsvps && existingRsvps.length > 0) {
      // Update existing RSVP
      const { data, error } = await supabase
        .from('rsvps')
        .update({
          full_name,
          mobile: mobile || null,
          attendance,
          guest_count: guest_count || 1,
          dietary: dietary || null,
          accessibility: accessibility || null,
          message_to_family: message_to_family || null,
        })
        .eq('id', existingRsvps[0].id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data })
    }

    // Create new RSVP
    const { data, error } = await supabase
      .from('rsvps')
      .insert({
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
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create RSVP' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const searchParams = request.nextUrl.searchParams
    const memorialId = searchParams.get('memorial_id')

    if (!memorialId) {
      return NextResponse.json(
        { error: 'Memorial ID required' },
        { status: 400 }
      )
    }

    const { data: memorialRsvps, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('memorial_id', memorialId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate stats
    const stats = {
      in_person_count: (memorialRsvps || [])
        .filter(r => r.attendance === 'in_person')
        .reduce((sum, r) => sum + (r.guest_count || 1), 0),
      online_count: (memorialRsvps || []).filter(r => r.attendance === 'online').length,
      total_guests: (memorialRsvps || []).reduce((sum, r) => sum + (r.guest_count || 1), 0),
    }

    return NextResponse.json({ data: memorialRsvps || [], stats })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch RSVPs' },
      { status: 500 }
    )
  }
}
