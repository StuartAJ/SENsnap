import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lightbulb, ExternalLink } from 'lucide-react'
import type { DailyTip } from '@/types'

interface DailyTipCardProps {
  readonly tip: DailyTip
}

export function DailyTipCard({ tip }: DailyTipCardProps) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-base text-amber-900">
            Today&apos;s SEN Tip
          </CardTitle>
        </div>
        <CardDescription className="text-amber-800 font-medium">
          {tip.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-900 leading-relaxed">{tip.content}</p>
        {tip.external_url && (
          <a
            href={tip.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            Read more <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  )
}
