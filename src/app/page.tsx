import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Bell,
  Flame,
  Lock,
  Mail,
  ShieldCheck,
  Timer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const metrics = [
  { value: '<60s', label: 'to complete each day' },
  { value: '10', label: 'SEN categories covered' },
  { value: '9', label: 'UK regions tracked' },
  { value: '6', label: 'school types compared' },
] as const

const features = [
  {
    icon: Timer,
    title: 'Under-a-minute daily quizzes',
    description:
      'Three short questions each morning across topics like EHCP, staffing, provision mapping, and reform readiness. Quick enough to fit between lessons.',
  },
  {
    icon: BarChart3,
    title: 'National results dashboard',
    description:
      'See how SENCOs across the country responded, broken down by role, school type, and region. Compare your experience to the national picture overnight.',
  },
  {
    icon: Lock,
    title: 'Completely anonymous',
    description:
      'No one sees your individual answers. Everything is aggregated into national trends so you can be honest about the challenges you face.',
  },
  {
    icon: Flame,
    title: 'Streaks that build the habit',
    description:
      'Track your current and longest response streaks. A seven-day onboarding period gets you into the rhythm before your data joins the national aggregate.',
  },
  {
    icon: Bell,
    title: 'Daily reminders',
    description:
      'Opt-in push notifications so you never miss a day. One tap from notification to answering — the more SENCOs respond, the clearer the picture.',
  },
  {
    icon: Mail,
    title: 'Passwordless sign-in',
    description:
      'No passwords to remember. Enter your school email, tap the magic link, and you are in. Set up takes under two minutes.',
  },
] as const

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_15%_0%,#d9f0e3_0%,#f2fbf6_35%,#f7fcf9_100%)]"
      data-state="default"
    >
      <div className="pointer-events-none absolute inset-x-0 top-[-180px] h-[320px] bg-[radial-gradient(circle,#7ac79666_0%,#7ac79612_45%,transparent_70%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-5 sm:px-6 sm:pt-7 lg:px-8">
        <p className="rounded-full border border-primary/35 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-foreground/80">
          SEN Snap
        </p>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="#features"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline-flex"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline-flex"
          >
            How it works
          </Link>
          <Link href="/login">
            <Button className="h-10 rounded-lg px-4 font-semibold">
              Log in
            </Button>
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-16">
        <div className="overflow-hidden rounded-[28px] border border-emerald-800/5 bg-[linear-gradient(160deg,#7ac796_0%,#5fb483_55%,#3f8f66_100%)] px-5 py-8 text-[#082116] shadow-[0_24px_60px_rgba(35,94,68,0.28)] sm:px-8 sm:py-10 md:px-10 md:py-12">
          <span className="inline-flex rounded-full bg-white/25 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#123325]">
            Daily quizzes for SENCOs across the UK
          </span>
          <h1 className="mt-4 max-w-[24ch] text-[2rem] leading-[1.02] font-extrabold sm:text-[2.65rem] lg:text-[3.4rem]">
            Short daily quizzes that build a national picture of SEN.
          </h1>
          <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-[#0f3222]/90 sm:text-lg">
            Answer three questions each morning in under a minute. Your
            anonymous responses join thousands of SENCOs to reveal what is
            really happening in SEN provision across the country.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/login">
              <Button
                size="lg"
                className="h-11 rounded-xl bg-white px-6 font-bold text-[#113224] hover:bg-white/90"
              >
                Get started free
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a
              href="#features"
              className="inline-flex h-11 items-center rounded-xl border-2 border-white/55 px-5 text-sm font-bold text-white transition-colors hover:border-white/75 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              See all features
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-white/35 bg-white/18 p-3 backdrop-blur-[1px]"
              >
                <p className="text-xl font-black sm:text-2xl">{metric.value}</p>
                <p className="mt-1 text-xs font-semibold text-[#153427]/80 sm:text-sm">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8"
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            Built around how SENCOs actually work
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Designed for SENCOs, SEN teachers, TAs, and inclusion leads across
            mainstream, special, and AP/PRU settings. Every feature is shaped
            by real SENCO workflows, not generic survey tools.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.title}
                className="border-[#cde7d8] bg-white/95 shadow-[0_14px_30px_rgba(30,73,55,0.1)] transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <CardContent className="p-5">
                  <span className="inline-flex rounded-lg bg-secondary p-2 text-secondary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8"
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            From sign-up to national insight in three simple steps.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Join with your school email',
              description:
                'No passwords needed. Tap a magic link, tell us your role, school type, and region during a quick onboarding. Takes under two minutes.',
            },
            {
              step: '2',
              title: 'Answer three questions each morning',
              description:
                'Short quizzes on topics like EHCP confidence, staffing, and provision mapping. Your anonymous responses feed directly into the national dataset.',
            },
            {
              step: '3',
              title: 'See the national picture next day',
              description:
                'Results are aggregated overnight. See how SENCOs across the country responded, filtered by role, school type, and region.',
            },
          ].map((item) => (
            <Card
              key={item.step}
              className="border-[#cde7d8] bg-white/95 shadow-[0_14px_30px_rgba(30,73,55,0.1)]"
            >
              <CardContent className="p-5">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="preview"
        className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8"
      >
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-[#cde7d8] bg-white/95 shadow-[0_14px_30px_rgba(30,73,55,0.1)]">
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                The national picture, updated daily
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Aggregated overnight from SENCOs across the country.
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-[#d6eedf] bg-[#eaf7ef] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1f4f38]/70">
                    EHCP confidence — nationally
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    72% of SENCOs reported high confidence with current EHCP
                    processes.
                  </p>
                </div>
                <div className="rounded-xl border border-[#d6eedf] bg-[#f4fbf7] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1f4f38]/70">
                    Staffing — by region
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    TA coverage flagged as a concern by 58% of SENCOs in the
                    North West this week.
                  </p>
                </div>
                <div className="rounded-xl border border-[#d6eedf] bg-[#f4fbf7] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1f4f38]/70">
                    Transition — by school type
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Year 9 transition is the top concern in mainstream
                    secondaries nationwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#cde7d8] bg-white/95 shadow-[0_14px_30px_rgba(30,73,55,0.1)]">
            <CardContent className="p-5 sm:p-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d3e9dc] bg-[#eff9f3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.07em] text-[#1f4f38]">
                <ShieldCheck className="size-3.5" />
                Sample daily question
              </p>
              <h2 className="mt-4 text-xl leading-tight font-bold text-foreground">
                How confident are you about today&apos;s planned interventions?
              </h2>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  className="w-full rounded-xl border border-[#7ac796] bg-[#eaf7ef] px-3 py-3 text-left text-sm font-bold text-[#143128] shadow-[inset_0_0_0_1px_#7ac796] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  High confidence
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-[#d5ebde] bg-[#f8fdf9] px-3 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-[#edf8f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Mixed confidence
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-[#d5ebde] bg-[#f8fdf9] px-3 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-[#edf8f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Need support
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                All responses are aggregated anonymously. Results show national
                trends, never individual answers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#cde7d8] bg-white/90 p-6 shadow-[0_14px_30px_rgba(30,73,55,0.1)] sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">
              The more SENCOs join, the clearer the picture.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Two minutes to set up. Your first national results arrive after
              seven days. Free to use, no contracts.
            </p>
          </div>
          <Link href="/login" className="mt-4 inline-flex sm:mt-0">
            <Button
              size="lg"
              className="h-11 rounded-xl px-6 font-bold shadow-[0_10px_24px_rgba(35,94,68,0.25)]"
            >
              Get started free
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
