import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a magic link to sign in. Click the link in
            your email to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder or{' '}
            <a href="/login" className="text-primary underline">
              try again
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
