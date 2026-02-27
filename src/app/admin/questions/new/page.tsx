import { QuestionForm } from '@/components/admin/question-form'

export default function NewQuestionPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create Question</h1>
      <QuestionForm />
    </div>
  )
}
