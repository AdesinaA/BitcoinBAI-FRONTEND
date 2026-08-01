import Link from 'next/link'
import {
  Shield,
  Lock,
  BarChart3,
  Network,
  Sparkles,
  Wallet,
  ArrowRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient colour glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]"
      >
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/25 blur-[140px]" />
        <div className="absolute left-[12%] top-[120px] h-[280px] w-[280px] rounded-full bg-info/20 blur-[120px]" />
        <div className="absolute right-[10%] top-[40px] h-[300px] w-[300px] rounded-full bg-accent/15 blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Institutional Bitcoin platform
            </span>
            <h1 className="text-display-sm font-semibold tracking-[-0.03em] text-text-primary md:text-display-md">
              Your Bitcoin,{' '}
              <span className="bg-gradient-to-r from-accent via-info to-accent bg-clip-text text-transparent">
                brilliantly managed
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              A Bitcoin-native financial operating system for binary network
              participation, wallet management, and institutional-grade
              earnings. Built for precision, security, and trust.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="lg" asChild>
              <Link href="/register">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Platform
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-primary">
              Designed for financial precision
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Shield}
              tone="accent"
              title="Institutional security"
              description="End-to-end encryption, hardware wallet integration, and multi-signature withdrawal flows."
            />
            <FeatureCard
              icon={Lock}
              tone="success"
              title="Non-custodial controls"
              description="Your Bitcoin keys remain yours. We never hold custody of your funds."
            />
            <FeatureCard
              icon={BarChart3}
              tone="info"
              title="Transparent reporting"
              description="Full audit trail, earnings statements, and real-time network analytics."
            />
            <FeatureCard
              icon={Network}
              tone="warning"
              title="Binary network"
              description="Structured binary tree with left/right team balancing and level-based commissions."
            />
            <FeatureCard
              icon={Wallet}
              tone="accent"
              title="Earnings dashboard"
              description="Track commissions, referral bonuses, and pool returns in a single financial view."
            />
            <FeatureCard
              icon={Sparkles}
              tone="info"
              title="AI assistant"
              description="Private financial analyst that answers questions about your account and earnings."
            />
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="container pb-20 md:pb-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/20 via-surface to-info/15 p-10 text-center md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-accent/25 blur-[100px]"
          />
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
            A premium Bitcoin financial platform
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary md:text-base">
            Every screen is designed to communicate trust, precision, and
            financial intelligence.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="lg" asChild>
              <Link href="/register">
                Create your account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const toneStyles: Record<string, { box: string; icon: string }> = {
  accent: {
    box: 'border-accent/30 bg-accent/10',
    icon: 'text-accent',
  },
  info: {
    box: 'border-info/30 bg-info/10',
    icon: 'text-info',
  },
  success: {
    box: 'border-success/30 bg-success/10',
    icon: 'text-success',
  },
  warning: {
    box: 'border-warning/30 bg-warning/10',
    icon: 'text-warning',
  },
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  tone = 'accent',
}: {
  icon: React.ElementType
  title: string
  description: string
  tone?: 'accent' | 'info' | 'success' | 'warning'
}) {
  const styles = toneStyles[tone]
  return (
    <div className="hover-raise flex flex-col gap-3 rounded-xl border border-border/70 bg-surface p-6">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${styles.box}`}
      >
        <Icon className={`h-5 w-5 ${styles.icon}`} />
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  )
}