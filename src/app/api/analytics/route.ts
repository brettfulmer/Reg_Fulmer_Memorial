import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { memorialId, eventType, eventData } = await request.json()

    if (!memorialId || !eventType) {
      return NextResponse.json(
        { error: 'Memorial ID and event type are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Get user agent and IP (basic tracking)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor
      ? forwardedFor.split(',')[0]
      : request.headers.get('x-real-ip') || 'unknown'

    // Insert analytics event
    const { error } = await supabase.from('analytics_events').insert({
      memorial_id: memorialId,
      event_type: eventType,
      event_data: eventData || {},
      user_agent: userAgent,
      ip_address: ipAddress,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to track event' },
      { status: 500 }
    )
  }
}

// Get analytics summary
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memorialId = searchParams.get('memorialId')

    if (!memorialId) {
      return NextResponse.json(
        { error: 'Memorial ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Fetch analytics aggregates
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_type, created_at')
      .eq('memorial_id', memorialId)

    // Simple aggregation
    const stats = {
      totalViews: events?.filter((e) => e.event_type === 'page_view').length || 0,
      totalRsvps: events?.filter((e) => e.event_type === 'rsvp_submit').length || 0,
      totalMemories:
        events?.filter((e) => e.event_type === 'memory_post').length || 0,
      totalShares: events?.filter((e) => e.event_type === 'share').length || 0,
    }

    return NextResponse.json({ data: stats })
  } catch (error: any) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
