import * as React from "react"
import { Check } from "lucide-react"

import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"

const FEATURES = [
  "Advanced statistics and progress tracking",
  "Custom text upload for specialized practice",
  "English and Hindi (Mangal) layout support",
  "Multi-theme support (Dark/Light/System)",
  "Mistake analysis and weak-finger tracking",
  "Offline capable for uninterrupted practice",
]

export function Features() {
  return (
    <section className="py-24 bg-muted/30 border-y">
      <Container>
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          <div className="flex-1">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Everything you need. <br className="hidden md:block" />
                Nothing you don't.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Type100 is engineered to provide a comprehensive toolkit for serious typists without compromising on speed or design. 
              </p>
            </FadeIn>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {FEATURES.map((feature, i) => (
                <FadeIn key={i} delay={0.1 * (i % 3)} direction="left">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
