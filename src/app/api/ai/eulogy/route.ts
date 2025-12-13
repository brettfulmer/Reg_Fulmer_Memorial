import { NextRequest, NextResponse } from 'next/server'
import { generateEulogyDraft } from '@/lib/ai/openai'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { memorialId, personalNotes } = await request.json()

    if (!memorialId) {
      return NextResponse.json(
        { error: 'Memorial ID is required' },
        { status: 400 }
      )
    }

    // Fetch memorial info and memories
    const { data: memorial } = await supabase
      .from('memorials')
      .select('preferred_name, short_bio')
      .eq('id', memorialId)
      .single()

    const { data: memories } = await supabase
      .from('memory_posts')
      .select('name, message')
      .eq('memorial_id', memorialId)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!memorial) {
      return NextResponse.json({ error: 'Memorial not found' }, { status: 404 })
    }

    const result = await generateEulogyDraft(
      memorial.preferred_name,
      memorial.short_bio,
      memories || [],
      personalNotes
    )

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error('Eulogy generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate eulogy' },
      { status: 500 }
    )
  }
}
