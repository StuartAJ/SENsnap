import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MessageCircle } from 'lucide-react'

interface AnalyticsCardsProps {
  readonly totalUsers: number
  readonly responsesToday: number
}

export function AnalyticsCards({
  totalUsers,
  responsesToday,
}: AnalyticsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Responses Today
          </CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{responsesToday}</div>
        </CardContent>
      </Card>
    </div>
  )
}
