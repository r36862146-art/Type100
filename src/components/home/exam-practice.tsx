import * as React from "react"
import Link from "next/link"
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ExamPractice() {
  return (
    <section className="py-24 bg-muted/10 border-y">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 w-full order-2 lg:order-1">
            <FadeIn direction="right">
              <div className="relative aspect-[4/3] rounded-2xl border bg-background shadow-xl overflow-hidden flex items-center justify-center p-8">
                {/* Abstract graphic representing exams */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                
                <div className="relative z-10 w-full max-w-sm space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card shadow-sm">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold text-sm">SSC CHSL Typing Test</h4>
                      <p className="text-xs text-muted-foreground">English • 10 Minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card shadow-sm opacity-80 scale-95 translate-x-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold text-sm">SSC CGL Tier II</h4>
                      <p className="text-xs text-muted-foreground">Hindi (Mangal) • 15 Minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card shadow-sm opacity-60 scale-90 translate-x-8">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold text-sm">RRB NTPC</h4>
                      <p className="text-xs text-muted-foreground">English • 10 Minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
          
          <div className="flex-1 order-1 lg:order-2">
            <FadeIn direction="left" delay={0.2}>
              <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <BookOpen className="mr-2 h-4 w-4" />
                Exam Preparation
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Clear Govt. typing tests with absolute confidence.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Experience exact exam-like environments. Our specialized mock tests simulate the strict interfaces of SSC, RRB, and state-level exams, complete with real-time error highlighting and official calculation formulas.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Strict error calculation (Full/Half mistakes)",
                  "Official backspace & navigation rules",
                  "Hindi Mangal & English layouts supported",
                  "Detailed exam-specific analytics",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/exams" className={cn(buttonVariants({ size: "lg" }), "group")}>
                Explore Exam Mocks
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  )
}
