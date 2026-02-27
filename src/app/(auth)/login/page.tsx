import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MagicLinkForm } from '@/components/auth/magic-link-form'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">SEN Snap</CardTitle>
          <CardDescription>
            Sign in to answer today&apos;s questions and see what other SENCOs think
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MagicLinkForm />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            We&apos;ll send you a magic link to sign in — no password needed.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
