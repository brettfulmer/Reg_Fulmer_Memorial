import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { moderateMemory } from '@/lib/ai/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const memorial_id = formData.get('memorial_id') as string
    const name = formData.get('name') as string
    const message = formData.get('message') as string
    const can_share_at_service = formData.get('can_share_at_service') === 'true'
    const photo = formData.get('photo') as File | null
    const audio = formData.get('audio') as Blob | null

    // Validate required fields
    if (!memorial_id || !name || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // AI Moderation
    const moderation = await moderateMemory(message, name)
    const autoApprove = moderation.suggestedApproval

    let photo_url: string | null = null
    let audio_url: string | null = null

    // Upload Photo
    if (photo) {
      const fileExt = photo.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-photo.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(fileName, photo)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('memories')
          .getPublicUrl(fileName)
        photo_url = publicUrl
      }
    }

    // Upload Audio
    if (audio) {
      const fileName = `${user.id}/${Date.now()}-audio.webm`
      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(fileName, audio)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('memories')
          .getPublicUrl(fileName)
        audio_url = publicUrl
      }
    }

    // Insert into DB
    const { data, error } = await supabase
      .from('memory_posts')
      .insert({
        memorial_id,
        name,
        message,
        photo_url,
        audio_url,
        can_share_at_service,
        approved: autoApprove,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create memory' },
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

    const { data: memories, error } = await supabase
      .from('memory_posts')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data: memories || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch memories' },
      { status: 500 }
    )
  }
}
