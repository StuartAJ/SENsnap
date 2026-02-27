import Link from 'next/link'
import { StreakBadge } from '@/components/streak/streak-badge'

interface AppHeaderProps {
  readonly streak: number
  readonly isAdmin?: boolean
}

export function AppHeader({ streak, isAdmin }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/daily" className="text-lg font-bold text-primary">
          SEN Snap
        </Link>
        <div className="flex items-center gap-3">
          <StreakBadge streak={streak} />
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
