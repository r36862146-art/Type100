import * as React from "react"
import Link from "next/link"
import { ArrowRight, Terminal } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10" aria-hidden="true" />
      
      <Container className="flex flex-col items-center text-center">
        <FadeIn>
          <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
            Introducing Type100X Version 1.0
          </div>
        </FadeIn>
        
        <FadeIn delay={0.1}>
          <h1 className="max-w-4xl font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            Master the keyboard. <br className="hidden sm:block" />
            <span className="text-muted-foreground">Type at the speed of thought.</span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
            Improve your typing speed, boost your accuracy, and prepare for competitive exams with realistic typing practice and educational content.
          </p>
        </FadeIn>
        
        <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/practice" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-12 px-8 text-base group")}>
            Start Typing
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/exams" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto h-12 px-8 text-base")}>
            <Terminal className="mr-2 h-4 w-4" />
            Explore Exams
          </Link>
        </FadeIn>
      </Container>
    </section>
  )
}
