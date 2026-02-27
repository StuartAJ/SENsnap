import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DailyTipCard } from './daily-tip-card'
import { Flame, CheckCircle } from 'lucide-react'
import type { DailyTip } from '@/types'

interface CompletionScreenProps {
  readonly tip: DailyTip | null
  readonly streak: number
}

export function CompletionScreen({ tip, streak }: CompletionScreenProps) {
  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle>All done for today!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-lg font-semibold">{streak} day streak</span>
            <Badge variant="secondary">
              {streak === 1 ? 'Just started!' : streak >= 7 ? 'On fire!' : 'Keep it up!'}
            </Badge>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Come back tomorrow to keep your streak going. Results will be
            published in the morning.
          </p>
        </CardContent>
      </Card>

      {tip && <DailyTipCard tip={tip} />}
    </div>
  )
}
