import { NextRequest, NextResponse } from 'next/server'
import { answerServiceQuestion } from '@/lib/ai/openai'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { question, memorialId } = await request.json()

    if (!question || !memorialId) {
      return NextResponse.json(
        { error: 'Question and memorial ID are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Fetch memorial and service details
    const { data: memorial } = await supabase
      .from('memorials')
      .select('*, service_events(*), travel_tips(*)')
      .eq('id', memorialId)
      .single()

    if (!memorial) {
      return NextResponse.json({ error: 'Memorial not found' }, { status: 404 })
    }

    const serviceEvent = memorial.service_events?.[0]

    const result = await answerServiceQuestion(question, {
      deceasedName: memorial.preferred_name,
      serviceDate: serviceEvent?.start_datetime || 'TBD',
      venue: serviceEvent?.venue_name || 'TBD',
      address: serviceEvent?.address_line || 'TBD',
      livestreamEnabled: serviceEvent?.livestream_enabled || false,
      travelTips: memorial.travel_tips?.map((t: any) => t.title) || [],
    })

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get answer' },
      { status: 500 }
    )
  }
}
