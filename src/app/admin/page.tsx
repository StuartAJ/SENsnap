import { getAdminStats } from '@/actions/admin'
import { AnalyticsCards } from '@/components/admin/analytics-cards'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <AnalyticsCards
        totalUsers={stats.totalUsers}
        responsesToday={stats.responsesToday}
      />
    </div>
  )
}
