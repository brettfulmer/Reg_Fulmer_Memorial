'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, Sparkles, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { MemoryPost } from '@/types'

export default function MemoriesAdminPage() {
  const [memories, setMemories] = useState<MemoryPost[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    loadMemories()
  }, [])

  const loadMemories = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('memory_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setMemories(data as MemoryPost[])
    setLoading(false)
  }

  const handleModerate = async (memoryId: string, message: string, name: string) => {
    setProcessing(memoryId)
    try {
      const response = await fetch('/api/ai/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, name }),
      })

      const { data } = await response.json()
      
      if (data) {
        alert(`AI Analysis:
Sentiment: ${data.sentiment}
Flagged: ${data.flagged ? 'Yes' : 'No'}
Suggested: ${data.suggestedApproval ? 'Approve' : 'Review manually'}`)
      }
    } catch (error) {
      console.error('Moderation error:', error)
    } finally {
      setProcessing(null)
    }
  }

  const handleApprove = async (memoryId: string, approved: boolean) => {
    const supabase = createClient()
    await supabase
      .from('memory_posts')
      .update({ approved })
      .eq('id', memoryId)

    loadMemories()
  }

  if (loading) {
    return <div className="text-center py-12 text-foreground-muted">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-display-sm text-foreground mb-2">
            Memory Moderation
          </h2>
          <p className="text-body-md text-foreground-muted">
            Review and moderate submitted memories with AI assistance
          </p>
        </div>
        <Button onClick={loadMemories} variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {memories.map((memory) => (
          <Card key={memory.id} className={memory.approved ? 'border-green-500/30' : 'border-amber-500/30'}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{memory.name}</h3>
                  <span
                    className={`text-caption px-2 py-0.5 rounded ${
                      memory.approved
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {memory.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="text-body-md text-foreground-muted mb-3">{memory.message}</p>
                {memory.can_share_at_service && (
                  <span className="text-caption text-accent-gold">
                    ✓ Can share at service
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleModerate(memory.id, memory.message, memory.name)}
                  disabled={processing === memory.id}
                  leftIcon={<Sparkles className="w-3 h-3" />}
                >
                  AI Check
                </Button>
                {!memory.approved && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleApprove(memory.id, true)}
                    leftIcon={<Check className="w-3 h-3" />}
                  >
                    Approve
                  </Button>
                )}
                {memory.approved && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleApprove(memory.id, false)}
                    leftIcon={<X className="w-3 h-3" />}
                  >
                    Unapprove
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {memories.length === 0 && (
          <div className="text-center py-12 text-foreground-muted">
            No memories submitted yet
          </div>
        )}
      </div>
    </div>
  )
}
