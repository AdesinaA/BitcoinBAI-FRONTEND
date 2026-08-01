/**
 * AI Assistant feature API types — mirror the backend AI module contract.
 */

export type AiInteractionStatus = 'success' | 'failed' | 'rate_limited'

export interface AiChatResponse {
  response: string
  tokensUsed: number
  model: string
}

export interface AiInteraction {
  interactionId: string
  userId: string
  query: string
  response: string
  tokensUsed: number
  model: string
  status: AiInteractionStatus
  duration: number
  createdAt?: string
}

export interface AiHistory {
  interactions: AiInteraction[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AiUsage {
  totalInteractions: number
  totalTokens: number
  byStatus: Record<string, number>
  model: string
}

export interface AiLimits {
  dailyUsed: number
  dailyRemaining: number
  maxTokensPerRequest: number
  model: string
}

export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}
