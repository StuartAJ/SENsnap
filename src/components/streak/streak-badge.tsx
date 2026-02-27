import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakBadgeProps {
  readonly streak: number
  readonly className?: string
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  if (streak <= 0) return null

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Flame className="h-4 w-4 text-orange-500" />
      <span className="text-sm font-semibold">{streak}</span>
    </div>
  )
}
