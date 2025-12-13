import { NextRequest, NextResponse } from 'next/server'
import { generateTributeSummary } from '@/lib/ai/openai'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { memorialId } = await request.json()

    if (!memorialId) {
      return NextResponse.json(
        { error: 'Memorial ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Fetch memorial info and approved memories
    const { data: memorial } = await supabase
      .from('memorials')
      .select('preferred_name')
      .eq('id', memorialId)
      .single()

    const { data: memories } = await supabase
      .from('memory_posts')
      .select('name, message')
      .eq('memorial_id', memorialId)
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (!memorial) {
      return NextResponse.json({ error: 'Memorial not found' }, { status: 404 })
    }

    const result = await generateTributeSummary(
      memories || [],
      memorial.preferred_name
    )

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error('Tribute summary error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
