'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Question, DailyResult } from '@/types'

interface ResultChartProps {
  readonly question: Question
  readonly result: DailyResult
}

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#6366f1']

export function ResultChart({ question, result }: ResultChartProps) {
  const chartData = question.options.map((option, index) => {
    const count = result.answer_breakdown[option.id] ?? 0
    const percentage =
      result.total_responses > 0
        ? Math.round((count / result.total_responses) * 100)
        : 0

    return {
      name: option.label,
      count,
      percentage,
      color: COLORS[index % COLORS.length],
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium leading-relaxed">
          {question.content}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {result.total_responses} response{result.total_responses !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={question.options.length * 50}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 30 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Responses']}
            />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
