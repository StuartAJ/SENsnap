import { IS_DEMO } from '@/lib/demo'
import { getMyQuestions, deleteMyQuestion } from '@/actions/questions'
import { MyQuestionForm } from '@/components/questions/my-question-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { Question } from '@/types'

export default async function MyQuestionsPage() {
  let questions: Question[] = []

  if (IS_DEMO) {
    questions = []
  } else {
    questions = await getMyQuestions()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">My Questions</h1>
        <p className="text-sm text-muted-foreground">
          Add custom questions and they will appear in your daily quiz on the date
          you choose.
        </p>
      </div>

      <MyQuestionForm />

      <div className="space-y-3">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-medium">{question.content}</CardTitle>
                <Badge variant="secondary">You</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(question.scheduled_date)}</span>
                <span>|</span>
                <span>{question.options.length} options</span>
              </div>

              <form action={deleteMyQuestion.bind(null, question.id)}>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}

        {questions.length === 0 && (
          <p className="text-center text-muted-foreground">
            You haven&apos;t added any questions yet.
          </p>
        )}
      </div>
    </div>
  )
}
