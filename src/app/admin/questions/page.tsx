import { getAdminQuestions } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Question } from '@/types'

export default async function AdminQuestionsPage() {
  const questions = (await getAdminQuestions()) as Question[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Questions</h1>
        <Link href="/admin/questions/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> New Question
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <Card key={q.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {q.content}
                </CardTitle>
                <Badge variant="secondary">#{q.display_order}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(q.scheduled_date)}</span>
                <span>|</span>
                <span>{q.category}</span>
                <span>|</span>
                <span>{q.options.length} options</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {questions.length === 0 && (
          <p className="text-center text-muted-foreground">
            No questions created yet.
          </p>
        )}
      </div>
    </div>
  )
}
