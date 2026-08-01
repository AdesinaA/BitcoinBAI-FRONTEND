'use client'

import * as React from 'react'
import { Send, Bot, User, Copy, BarChart3, Clock } from 'lucide-react'

import { getApiErrorMessage } from '@/features/auth/utils/api-error'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  PageShell,
  SectionHeading,
  LedgerMetricCard,
  FinancialChart,
} from '@/components'
import * as aiService from '../services/ai-service'
import type { AiChatResponse, AiInteraction, AiUsage, AiLimits } from '../types'

const SUGGESTED_PROMPTS = [
  'How much Bitcoin do I have available?',
  'What are my pending withdrawals?',
  'Show me my binary tree health.',
  'What earnings did I receive this week?',
  'Which investment pools are performing best?',
]

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export function AiAssistant() {
  const { toast } = useToast()
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = React.useState('')
  const [isSending, setIsSending] = React.useState(false)
  const [usage, setUsage] = React.useState<AiUsage | null>(null)
  const [limits, setLimits] = React.useState<AiLimits | null>(null)
  const [history, setHistory] = React.useState<AiInteraction[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState('chat')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        const [usageData, limitsData, historyData] = await Promise.allSettled([
          aiService.getUsage(),
          aiService.getLimits(),
          aiService.getHistory(1, 20),
        ])
        if (cancelled) return
        if (usageData.status === 'fulfilled') setUsage(usageData.value)
        if (limitsData.status === 'fulfilled') setLimits(limitsData.value)
        if (historyData.status === 'fulfilled')
          setHistory(historyData.value.interactions)
      } catch (error) {
        if (!cancelled) {
          toast({
            title: 'Failed to load AI data',
            description: getApiErrorMessage(error),
            variant: 'destructive',
          })
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [toast])

  async function handleSend() {
    const query = inputValue.trim()
    if (!query || isSending) return

    setIsSending(true)
    const userMessage: ChatMessage = {
      role: 'user',
      content: query,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    try {
      const response: AiChatResponse = await aiService.chat(query)
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: 'Message failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  function handleSuggestedPrompt(prompt: string) {
    setInputValue(prompt)
  }

  const totalTokens = usage?.totalTokens ?? 0
  const dailyUsed = limits?.dailyUsed ?? 0
  const dailyLimit = dailyUsed + (limits?.dailyRemaining ?? 0)
  const quotaPercent = dailyLimit > 0 ? (dailyUsed / dailyLimit) * 100 : 0

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Private AI assistant"
        title="AI Assistant"
        description="Your private financial analyst for Bitcoin BAI. Ask about your wallet, earnings, network, and pools."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <LedgerMetricCard
          label="Total interactions"
          value={String(usage?.totalInteractions ?? 0)}
          detail={`${totalTokens} tokens used`}
          icon={BarChart3}
          loading={isLoading}
        />
        <LedgerMetricCard
          label="Daily quota"
          value={`${dailyUsed}/${dailyLimit}`}
          detail={`${Math.round(quotaPercent)}% used`}
          icon={Clock}
          loading={isLoading}
        />
        <LedgerMetricCard
          label="Model"
          value={limits?.model ?? '—'}
          detail="gpt-4"
          icon={Bot}
          loading={isLoading}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={messagesEndRef}
                className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pb-4"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated/50">
                      <Bot className="h-6 w-6 text-text-tertiary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-text-primary">
                        Ask me anything about your Bitcoin BAI account
                      </p>
                      <p className="text-xs text-text-tertiary">
                        I can analyze your wallet, earnings, network, and pools.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex gap-3',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-elevated/70">
                          <Bot className="h-4 w-4 text-accent" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                          msg.role === 'user'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-surface-elevated/50 text-text-primary'
                        )}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                        <div className="mt-2 flex items-center gap-2 opacity-50">
                          <span className="text-[10px]">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {msg.role === 'assistant' && (
                            <button
                              type="button"
                              onClick={() =>
                                navigator.clipboard.writeText(msg.content)
                              }
                              className="rounded p-0.5 text-text-tertiary hover:text-text-primary"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent">
                          <User className="h-4 w-4 text-accent-foreground" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isSending && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-elevated/70">
                      <Bot className="h-4 w-4 text-accent" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl bg-surface-elevated/50 px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {messages.length === 0 && (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="secondary"
                  size="sm"
                  className="justify-start text-left h-auto py-2.5"
                  onClick={() => handleSuggestedPrompt(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Ask about your Bitcoin BAI account…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={isSending || (limits?.dailyRemaining ?? 0) === 0}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleSend}
              isLoading={isSending}
              disabled={
                isSending || !inputValue.trim() || (limits?.dailyRemaining ?? 0) === 0
              }
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {limits && limits.dailyRemaining === 0 && (
            <p className="text-xs text-warning">
              Daily quota exhausted. Please try again later.
            </p>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Recent interactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-md" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-tertiary">
                  No interaction history yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.interactionId}
                      className="rounded-lg border border-border/70 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-text-primary">
                            {item.query}
                          </p>
                          <p className="line-clamp-2 text-xs text-text-tertiary">
                            {item.response}
                          </p>
                        </div>
                        <Badge
                          variant={
                            item.status === 'success'
                              ? 'success'
                              : item.status === 'rate_limited'
                              ? 'warning'
                              : 'destructive'
                          }
                          className="capitalize text-[10px]"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-text-tertiary">
                        <span>{item.tokensUsed} tokens</span>
                        <span>{item.duration}ms</span>
                        <time dateTime={item.createdAt}>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : '—'}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          {usage ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle className="text-base">
                    Status breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(usage.byStatus).map(([status, count]) => (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-text-secondary capitalize">
                          {status}
                        </span>
                        <span className="font-numeric text-lg font-semibold text-text-primary">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle className="text-base">Token usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">
                        Total tokens
                      </span>
                      <span className="font-numeric text-lg font-semibold text-text-primary">
                        {usage.totalTokens.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">
                        Total interactions
                      </span>
                      <span className="font-numeric text-lg font-semibold text-text-primary">
                        {usage.totalInteractions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">
                        Model
                      </span>
                      <span className="text-sm text-text-primary">{usage.model}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <FinancialChart
                  title="Daily quota usage"
                  description={`${dailyUsed} of ${dailyLimit} requests used today`}
                  data={[
                    {
                      date: 'Today',
                      used: dailyUsed,
                      remaining: limits?.dailyRemaining ?? 0,
                    },
                  ]}
                  series={[
                    { key: 'used', name: 'Used', color: 'accent' },
                    { key: 'remaining', name: 'Remaining', color: 'success' },
                  ]}
                  type="bar"
                  height={200}
                />
              </div>
            </div>
          ) : (
            <Skeleton className="h-64 w-full rounded-xl" />
          )}
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

// Helper for conditional class names
function cn(...args: (string | false | undefined)[]) {
  return args.filter(Boolean).join(' ')
}
