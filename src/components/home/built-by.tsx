import * as React from "react"
import { Activity, RefreshCw, MessageSquare } from "lucide-react"

import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"

export function BuiltBy() {
  return (
    <section className="py-24">
      <Container>
        <FadeIn>
          <div className="max-w-4xl mx-auto rounded-3xl border bg-card p-8 md:p-12 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
              
              {/* Left Column: Avatar & Profile */}
              <div className="flex-shrink-0 flex flex-col items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <span className="text-2xl font-bold tracking-tight">R</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">R Ayush</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      Independent Developer
                    </p>
                    {/* Future: Studio Name can go here */}
                  </div>
                </div>

                {/* Future: Social Links & Contact can be added here */}
              </div>

              {/* Right Column: Description & Status */}
              <div className="flex-1 space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                    Built & Maintained By
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Type100X is an independent typing practice platform built and actively maintained by <strong className="font-semibold text-foreground">R Ayush</strong>.
                    </p>
                    <p>
                      The vision behind Type100X is to create a modern, fast, and accessible platform where anyone can improve their typing skills through practice, educational content, engaging games, and realistic government exam preparation.
                    </p>
                    <p>
                      Every feature is designed with a focus on simplicity, performance, and continuous improvement.
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-border/50">
                  <h4 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
                    Project Status
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted/50">
                      <Activity className="h-4 w-4 text-primary" />
                      Actively Developed
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted/50">
                      <RefreshCw className="h-4 w-4 text-primary" />
                      Regular Updates
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted/50">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Community Feedback Driven
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
