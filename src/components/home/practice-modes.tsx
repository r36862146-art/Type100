import * as React from "react"
import Link from "next/link"
import { Timer, Quote, Gamepad2, Terminal } from "lucide-react"

import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const MODES = [
  {
    title: "Timed Practice",
    description: "Standard speed-focused typing sessions.",
    icon: Timer,
    href: "/practice",
  },
  {
    title: "Learning Mode",
    description: "Type while learning educational, exam-oriented facts.",
    icon: Quote,
    href: "/practice?mode=learning",
  },
  {
    title: "Typing Games",
    description: "Learn faster by playing interactive typing games.",
    icon: Gamepad2,
    href: "/games",
  },
  {
    title: "Exam Simulator",
    description: "Realistic competitive exam simulations.",
    icon: Terminal,
    href: "/exams",
  },
]

export function PracticeModes() {
  return (
    <section className="py-24">
      <Container>
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Practice your way.</h2>
            <p className="text-lg text-muted-foreground">
              Choose from multiple game modes tailored to improve different aspects of your typing mechanics.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MODES.map((mode, i) => (
            <FadeIn key={mode.title} delay={0.1 * i} direction="up" className="flex">
              <Link href={mode.href} className="w-full">
                <Card className="w-full h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/50 bg-background hover:bg-muted/10 group cursor-pointer">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <mode.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{mode.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="text-sm text-muted-foreground/80 leading-relaxed">
                      {mode.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
