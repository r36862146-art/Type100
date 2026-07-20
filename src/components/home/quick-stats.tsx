import * as React from "react"
import { Activity, Target, Zap } from "lucide-react"

import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"

const HIGHLIGHTS = [
  {
    label: "Always Available",
    value: "Free to Use",
    icon: Zap,
    detail: "No hidden costs",
  },
  {
    label: "Instant Access",
    value: "No Sign-up",
    icon: Activity,
    detail: "Start typing immediately",
  },
  {
    label: "Exam Preparation",
    value: "Focused Practice",
    icon: Target,
    detail: "Realistic simulations",
  },
]

export function QuickStats() {
  return (
    <section className="py-12 border-y bg-muted/20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-border/50">
          {HIGHLIGHTS.map((stat, i) => (
            <FadeIn key={stat.label} delay={0.1 * i} direction="up" className="flex flex-col items-center text-center pt-8 md:pt-0 first:pt-0">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/5">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-foreground mb-2">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <div className="mt-3 text-xs font-semibold text-primary/70">
                {stat.detail}
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
