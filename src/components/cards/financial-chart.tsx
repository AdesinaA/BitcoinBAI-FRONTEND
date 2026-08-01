import * as React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type FinancialChartType = 'line' | 'bar' | 'area'

export interface FinancialChartDatum {
  [key: string]: string | number
}

export interface FinancialChartSeries {
  key: string
  name: string
  color: 'accent' | 'success' | 'danger' | 'info' | 'text-primary' | 'text-secondary'
  type?: 'line' | 'bar'
}

export interface FinancialChartProps {
  title?: string
  description?: string
  data: FinancialChartDatum[]
  series: FinancialChartSeries[]
  xAxisKey?: string
  type?: FinancialChartType
  height?: number
  showGrid?: boolean
  showTooltip?: boolean
  className?: string
}

const COLOR_MAP: Record<string, string> = {
  accent: 'hsl(var(--accent))',
  success: 'hsl(var(--success))',
  danger: 'hsl(var(--danger))',
  info: 'hsl(var(--info))',
  'text-primary': 'hsl(var(--text-primary))',
  'text-secondary': 'hsl(var(--text-secondary))',
}

/**
 * Premium financial chart component.
 * Supports line and bar charts with restrained styling.
 * Uses the sovereign ledger color palette.
 */
export function FinancialChart({
  title,
  description,
  data,
  series,
  xAxisKey = 'date',
  type = 'line',
  height = 240,
  showGrid = true,
  showTooltip = true,
  className,
}: FinancialChartProps) {
  const chartColor = (c: string) => COLOR_MAP[c] ?? c

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          {showGrid ? <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" /> : null}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--text-tertiary))', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--text-tertiary))', fontSize: 11 }}
            tickFormatter={(value) => `${value}`}
            width={40}
          />
          {showTooltip ? (
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--surface-elevated))',
                border: '1px solid hsl(var(--border))',
              }}
              labelStyle={{ color: 'hsl(var(--text-tertiary))' }}
            />
          ) : null}
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={chartColor(s.color)}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      )
    }

    return (
      <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        {showGrid ? <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" /> : null}
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--text-tertiary))', fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--text-tertiary))', fontSize: 11 }}
          tickFormatter={(value) => `${value}`}
          width={40}
        />
        {showTooltip ? (
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--surface-elevated))',
              border: '1px solid hsl(var(--border))',
            }}
            labelStyle={{ color: 'hsl(var(--text-tertiary))' }}
          />
        ) : null}
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={chartColor(s.color)}
            strokeWidth={2}
            dot={{ r: 0 }}
            activeDot={{ r: 4, fill: chartColor(s.color) }}
          />
        ))}
      </LineChart>
    )
  }

  return (
    <Card className={cn('border-border/70', className)}>
      {(title || description) && (
        <CardHeader>
          {title ? <CardTitle className="text-base">{title}</CardTitle> : null}
          {description ? (
            <p className="text-sm text-text-secondary">{description}</p>
          ) : null}
        </CardHeader>
      )}
      <CardContent className={cn(!title && !description ? 'pt-4' : 'pt-0')}>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
