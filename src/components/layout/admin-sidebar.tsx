'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Lightbulb, BarChart3, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/questions', label: 'Questions', icon: MessageSquare },
  { href: '/admin/tips', label: 'Tips', icon: Lightbulb },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
] as const

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r bg-background p-4">
      <div className="mb-6">
        <Link
          href="/daily"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to app
        </Link>
      </div>
      <h2 className="mb-4 text-lg font-bold text-primary">Admin</h2>
      <nav className="space-y-1">
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
