import { NextRequest, NextResponse } from 'next/server'
import { moderateMemory } from '@/lib/ai/openai'

export async function POST(request: NextRequest) {
  try {
    const { message, name } = await request.json()

    if (!message || !name) {
      return NextResponse.json(
        { error: 'Message and name are required' },
        { status: 400 }
      )
    }

    const result = await moderateMemory(message, name)

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error('Moderation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to moderate content' },
      { status: 500 }
    )
  }
}
