import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Cta() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10" />
      <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" aria-hidden="true" />
      
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to type faster?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Start improving your typing speed today. Free to use, no sign-up required. Experience fast, focused practice in a clean, distraction-free environment.
            </p>
            <Link 
              href="/practice" 
              className={cn(buttonVariants({ size: "lg" }), "h-14 px-10 text-lg group")}
            >
              Start Practicing Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
