/**
 * Central chart color palette aligned with the design system.
 * Import these tokens instead of hard-coding hex values in charts.
 */
export const chartColors = {
  gold: '#FFD700',
  goldSoft: '#FFE44D',
  primary: '#0F172A',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  slate: '#64748B',
  muted: '#94A3B8',
  grid: 'rgba(148, 163, 184, 0.15)',
} as const

export const chartDefaults = {
  strokeWidth: 2,
  animationDuration: 300,
  gridStrokeDasharray: '3 3',
} as const
