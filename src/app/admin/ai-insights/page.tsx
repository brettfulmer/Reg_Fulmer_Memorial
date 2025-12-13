'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, RefreshCw, Download, FileText } from 'lucide-react'

interface TributeSummary {
  summary: string
  keyThemes: string[]
  emotionalTone: string
}

export default function AIInsightsPage() {
  const [summary, setSummary] = useState<TributeSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [eulogyDraft, setEulogyDraft] = useState<any>(null)
  const [generatingEulogy, setGeneratingEulogy] = useState(false)

  const generateSummary = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/tribute-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memorialId: '1' }), // Update with dynamic ID
      })

      const { data } = await response.json()
      if (data) setSummary(data)
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateEulogy = async () => {
    setGeneratingEulogy(true)
    try {
      const response = await fetch('/api/ai/eulogy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memorialId: '1' }), // Update with dynamic ID
      })

      const { data } = await response.json()
      if (data) setEulogyDraft(data)
    } catch (error) {
      console.error('Error generating eulogy:', error)
    } finally {
      setGeneratingEulogy(false)
    }
  }

  const downloadEulogy = () => {
    if (!eulogyDraft) return

    const text = `EULOGY DRAFT\n\n${eulogyDraft.fullText}\n\n\nDELIVERY TIPS:\n${eulogyDraft.tips.map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}`
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'eulogy-draft.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-display-sm text-foreground mb-2">
          AI-Powered Insights
        </h2>
        <p className="text-body-md text-foreground-muted">
          Use AI to generate summaries, eulogies, and insights from memories
        </p>
      </div>

      <div className="space-y-6">
        {/* Tribute Summary */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-heading-lg text-foreground mb-1">
                Tribute Summary
              </h3>
              <p className="text-body-sm text-foreground-muted">
                AI-generated summary of all shared memories
              </p>
            </div>
            <Button
              onClick={generateSummary}
              disabled={loading}
              variant="primary"
              leftIcon={loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            >
              Generate Summary
            </Button>
          </div>

          {summary && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Summary</h4>
                <p className="text-body-md text-foreground-muted leading-relaxed">
                  {summary.summary}
                </p>
              </div>

              {summary.keyThemes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Key Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {summary.keyThemes.map((theme, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-body-sm"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-foreground mb-2">Emotional Tone</h4>
                <p className="text-body-md text-foreground-muted">
                  {summary.emotionalTone}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Eulogy Assistant */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-heading-lg text-foreground mb-1">
                AI Eulogy Assistant
              </h3>
              <p className="text-body-sm text-foreground-muted">
                Generate a draft eulogy based on the biography and memories
              </p>
            </div>
            <div className="flex gap-2">
              {eulogyDraft && (
                <Button
                  onClick={downloadEulogy}
                  variant="secondary"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              )}
              <Button
                onClick={generateEulogy}
                disabled={generatingEulogy}
                variant="primary"
                leftIcon={generatingEulogy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              >
                Generate Eulogy
              </Button>
            </div>
          </div>

          {eulogyDraft && (
            <div className="space-y-4">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-body-md text-foreground-muted leading-relaxed">
                  {eulogyDraft.fullText}
                </div>
              </div>

              {eulogyDraft.tips.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-3">Delivery Tips</h4>
                  <ul className="space-y-2">
                    {eulogyDraft.tips.map((tip: string, i: number) => (
                      <li key={i} className="text-body-sm text-foreground-muted flex items-start gap-2">
                        <span className="text-accent-gold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
