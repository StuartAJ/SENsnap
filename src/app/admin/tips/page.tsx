import { getAdminTips } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { DailyTip } from '@/types'

export default async function AdminTipsPage() {
  const tips = (await getAdminTips()) as DailyTip[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daily Tips</h1>
        <Link href="/admin/tips/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> New Tip
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {tips.map((tip) => (
          <Card key={tip.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {tip.content}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(tip.scheduled_date)}</span>
                <span>|</span>
                <span>{tip.category}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {tips.length === 0 && (
          <p className="text-center text-muted-foreground">
            No tips created yet.
          </p>
        )}
      </div>
    </div>
  )
}
