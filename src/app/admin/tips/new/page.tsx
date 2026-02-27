import { TipForm } from '@/components/admin/tip-form'

export default function NewTipPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create Tip</h1>
      <TipForm />
    </div>
  )
}
