import * as React from "react"
import { ShieldCheck, FastForward, Focus } from "lucide-react"

import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"

const REASONS = [
  {
    title: "Zero Distractions",
    description: "A clean, minimal interface designed purely to keep you in the flow state with minimal distractions.",
    icon: Focus,
  },
  {
    title: "Instant Feedback",
    description: "Real-time WPM and accuracy metrics without layout-shifting popups.",
    icon: FastForward,
  },
  {
    title: "Reliable & Fast",
    description: "Built on Next.js edge infrastructure for zero-latency keystroke registration.",
    icon: ShieldCheck,
  },
]

export function WhyType100() {
  return (
    <section className="py-24">
      <Container>
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why choose Type100?</h2>
            <p className="text-lg text-muted-foreground">
              We stripped away the clutter and unnecessary gamification. What remains is a fast and focused typing experience on the web.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {REASONS.map((reason, i) => (
            <FadeIn key={reason.title} delay={0.1 * i} direction="up" className="text-center flex flex-col items-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-foreground shadow-sm ring-1 ring-border">
                <reason.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
