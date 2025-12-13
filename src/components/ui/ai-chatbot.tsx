'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  suggestedFollowUps?: string[]
}

interface AIChatbotProps {
  memorialId: string
  className?: string
}

export function AIChatbot({ memorialId, className }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm here to help answer questions about the service. What would you like to know?",
      suggestedFollowUps: [
        'What time does the service start?',
        'Is there parking available?',
        'Can I watch online?',
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (question?: string) => {
    const messageToSend = question || input.trim()
    if (!messageToSend || isLoading) return

    // Add user message
    const userMessage: Message = { role: 'user', content: messageToSend }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: messageToSend,
          memorialId,
        }),
      })

      const { data } = await response.json()

      if (data) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.answer,
          suggestedFollowUps: data.suggestedFollowUps,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Chatbot error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I couldn't process that. Please try again or check the service details section.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn('fixed bottom-6 right-6 z-50', className)}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-glow bg-accent-gold hover:bg-accent-gold/90 text-background"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="flex flex-col h-[500px] max-h-[70vh] bg-background border-accent-gold/20">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-accent-gold/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-gold" />
                  <h3 className="font-semibold text-foreground">Service Assistant</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-foreground-muted hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index}>
                    <div
                      className={cn(
                        'flex',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2',
                          message.role === 'user'
                            ? 'bg-accent-gold text-background'
                            : 'bg-background-subtle text-foreground'
                        )}
                      >
                        <p className="text-body-sm">{message.content}</p>
                      </div>
                    </div>

                    {/* Suggested follow-ups */}
                    {message.role === 'assistant' &&
                      message.suggestedFollowUps &&
                      message.suggestedFollowUps.length > 0 &&
                      index === messages.length - 1 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-caption text-foreground-subtle px-1">
                            Suggested questions:
                          </p>
                          {message.suggestedFollowUps.map((question, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(question)}
                              className="block w-full text-left px-3 py-2 rounded-lg bg-background-subtle/50 hover:bg-background-subtle text-body-sm text-foreground-muted hover:text-foreground transition-colors"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-background-subtle rounded-2xl px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-foreground-subtle rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-foreground-subtle rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-foreground-subtle rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="bg-accent-gold hover:bg-accent-gold/90 text-background"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
