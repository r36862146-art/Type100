import type { Metadata } from "next"
import Link from "next/link"
import { 
  ArrowRight, Terminal, Keyboard, Brain, Trophy, BarChart, 
  Zap, Target, GraduationCap, Briefcase, Code, PenTool, Database, Users, 
  Heart, Activity, Clock, LayoutDashboard, Rocket, Globe,
  Github, Linkedin, Map, Route, CheckCircle2, User, BookOpen
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "About Type100 | The Modern Typing Platform",
  description: "Type100 is a modern typing platform built for learning, productivity, and competitive exam preparation. Improve your typing speed and accuracy today.",
  openGraph: {
    title: "About Type100 | The Modern Typing Platform",
    description: "Type100 is a modern typing platform built for learning, productivity, and competitive exam preparation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Type100",
    description: "Type100 is a modern typing platform built for learning, productivity, and competitive exam preparation.",
  }
}

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pb-16">
      <HeroSection />
      <WhatIsSection />
      <WhySection />
      <WhoIsForSection />
      <MissionSection />
      <HighlightsSection />
      <CreatorSection />
      <RoadmapSection />
      <CtaSection />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Soft gradient background element */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/15" aria-hidden="true" />
      
      <Container className="flex flex-col items-center text-center">
        <FadeIn>
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
            About Type100
          </div>
        </FadeIn>
        
        <FadeIn delay={0.1}>
          <h1 className="max-w-4xl font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            Learn faster. Type smarter. <br className="hidden sm:block" />
            <span className="text-muted-foreground font-bold">Improve every day.</span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
            Type100 is a modern typing platform built for learning, productivity, and competitive exam preparation. Master the keyboard and type at the speed of thought.
          </p>
        </FadeIn>
      </Container>
    </section>
  )
}

function WhatIsSection() {
  const features = [
    { icon: Keyboard, title: "Typing Practice", desc: "Build muscle memory with structured, effective exercises." },
    { icon: Brain, title: "Learning While Typing", desc: "Absorb new information and facts while you practice." },
    { icon: Target, title: "Exam Preparation", desc: "Simulate real-world government and competitive exams." },
    { icon: Trophy, title: "Typing Games", desc: "Make practice fun and engaging with interactive challenges." },
    { icon: BarChart, title: "Performance Analytics", desc: "Track speed, accuracy, and identify weak spots visually." }
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What is Type100?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just a typing test. It's a comprehensive platform that combines everything you need in one unified experience.
            </p>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <FadeIn key={i} delay={0.1 * i} className={cn("flex", i === 4 ? "md:col-span-2 lg:col-span-1" : "")}>
              <Card className="flex flex-col h-full w-full bg-card/50 backdrop-blur-sm border-muted-foreground/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}

function WhySection() {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Why Type100?</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Traditional typing websites are often outdated, cluttered with ads, or lack meaningful progression. We built Type100 to solve these exact problems with a focus on modern user experience.
              </p>
              <ul className="space-y-5">
                {[
                  "Modern, distraction-free UI",
                  "Learn educational content while practicing",
                  "Dedicated exam-focused simulations",
                  "Detailed analytics to track real progress",
                  "Fast, responsive, and mobile-friendly"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-lg">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mr-4 shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
          <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4 md:gap-6">
            <FadeIn delay={0.1} className="mt-8">
              <Card className="bg-gradient-to-br from-card to-muted border-muted-foreground/10 text-center p-8 h-full flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Fast & Fluid</h3>
              </Card>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card className="bg-gradient-to-br from-card to-muted border-muted-foreground/10 text-center p-8 h-full flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                <Brain className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Educational</h3>
              </Card>
            </FadeIn>
            <FadeIn delay={0.3}>
              <Card className="bg-gradient-to-br from-card to-muted border-muted-foreground/10 text-center p-8 h-full flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                <BarChart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Analytics</h3>
              </Card>
            </FadeIn>
            <FadeIn delay={0.4} className="mt-8">
              <Card className="bg-gradient-to-br from-card to-muted border-muted-foreground/10 text-center p-8 h-full flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                <LayoutDashboard className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Modern UI</h3>
              </Card>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  )
}

function WhoIsForSection() {
  const audiences = [
    { icon: GraduationCap, title: "Students", desc: "Improve typing speed for assignments and coding." },
    { icon: Briefcase, title: "Exam Aspirants", desc: "Prepare for government and competitive typing tests." },
    { icon: Code, title: "Developers", desc: "Master symbols and syntax to code at the speed of thought." },
    { icon: PenTool, title: "Content Writers", desc: "Write articles and blogs faster with fewer typos." },
    { icon: Database, title: "Data Entry", desc: "Boost words-per-minute for professional roles." },
    { icon: Users, title: "Everyone Else", desc: "Anyone looking to improve digital communication skills." }
  ]

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Who is Type100 For?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for anyone who uses a keyboard. Tailored experiences for your specific goals.
            </p>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {audiences.map((audience, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <Card className="group hover:border-primary/50 bg-background/50 backdrop-blur-sm transition-all duration-300 h-full hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 inline-flex rounded-full bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                    <audience.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{audience.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{audience.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}

function MissionSection() {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/5 blur-[100px] dark:bg-primary/10" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/3 rounded-full bg-primary/5 blur-[100px] dark:bg-primary/10" aria-hidden="true" />
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-8 shadow-sm">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">Our Mission</h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
              We believe typing shouldn't just be about hitting keys fast. It should be educational, engaging, and enjoyable.
              <br className="hidden md:block" /> <br className="hidden md:block" />
              <span className="text-foreground">Our mission is to make learning seamless—improving both your typing skills and your knowledge simultaneously.</span>
            </p>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}

function HighlightsSection() {
  const highlights = [
    { icon: BookOpen, title: "Learn While You Type", desc: "Read interesting facts, quotes, and lessons while practicing." },
    { icon: Activity, title: "Real-time Analytics", desc: "Instant feedback on WPM, accuracy, and consistency." },
    { icon: Clock, title: "Progress Tracking", desc: "Monitor your improvement over days, weeks, and months." },
    { icon: Globe, title: "Responsive Design", desc: "Practice flawlessly on desktops, tablets, and mobile devices." },
    { icon: Rocket, title: "Continuous Improvements", desc: "Regular updates with new features and optimizations." }
  ]

  return (
    <section className="py-20 md:py-32 bg-muted/30 border-y border-muted-foreground/10">
      <Container>
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Platform Highlights</h2>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {highlights.map((highlight, i) => (
            <FadeIn key={i} delay={0.1 * i} className={cn("flex flex-col items-start p-2", i === 4 ? "md:col-span-2 lg:col-span-1" : "")}>
              <div className="mb-4 h-12 w-12 rounded-xl bg-background border border-muted-foreground/10 shadow-sm flex items-center justify-center text-primary">
                <highlight.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-xl mb-2">{highlight.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{highlight.desc}</p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}

function CreatorSection() {
  return (
    <section className="py-24 md:py-40">
      <Container>
        <FadeIn>
          <Card className="max-w-4xl mx-auto overflow-hidden relative border-muted-foreground/20 shadow-xl bg-card/80 backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-primary/30 via-primary/10 to-background" />
            <CardContent className="pt-24 px-6 md:px-12 pb-12 relative text-center md:text-left md:flex gap-12 items-start">
              <div className="shrink-0 mb-8 md:mb-0 mx-auto md:mx-0 relative z-10">
                <div className="h-40 w-40 rounded-full border-8 border-card bg-muted shadow-2xl flex items-center justify-center mx-auto">
                  <User className="h-20 w-20 text-muted-foreground/50" />
                </div>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold mb-3">Built & Maintained by R. Ayush</h2>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">Independent Developer</span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium">Technology Enthusiast</span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium">AI Enthusiast</span>
                </div>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Type100 is an independent project created and actively maintained by R. Ayush. 
                  Built with a passion for technology, education, and user-focused experiences, 
                  Type100 is continuously improved through new features, performance enhancements, and community feedback. 
                  <br /><br />
                  The vision is to build one of the most modern, accessible, and engaging typing platforms for learners worldwide.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Link 
                    href="https://github.com/RAyush" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-full hover:bg-foreground hover:text-background transition-colors")}
                  >
                    <Github className="mr-2 h-4 w-4" /> GitHub
                  </Link>
                  <Link 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors")}
                  >
                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </section>
  )
}

function RoadmapSection() {
  const items = [
    { title: "More Exam Categories", desc: "Expanding government and professional test simulations." },
    { title: "Multiplayer Racing", desc: "Compete against friends and users globally in real-time." },
    { title: "Global Leaderboards", desc: "See how you rank against the best typists." },
    { title: "AI Typing Coach", desc: "Personalized exercises based on your specific mistakes." }
  ]

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="text-center mb-20">
          <FadeIn>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6 text-primary">
              <Map className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">The Road Ahead</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are constantly working to make Type100 better. Here's a glimpse of what's coming next.
            </p>
          </FadeIn>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="relative border-l-2 border-primary/20 pl-8 ml-4 space-y-12">
            {items.map((item, i) => (
              <FadeIn key={i} delay={0.1 * i} className="relative">
                <span className="absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary ring-4 ring-background shadow-sm">
                  <Route className="h-3 w-3 text-primary-foreground" />
                </span>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10" />
      <Container className="text-center">
        <FadeIn>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Ready to Improve Your Typing?</h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-medium">
            Join users who are already typing faster, smarter, and with greater accuracy. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/practice" className={cn(buttonVariants({ size: "lg" }), "h-14 px-10 text-lg rounded-full group shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow")}>
              Start Practicing
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/exams" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 px-10 text-lg rounded-full")}>
              <Terminal className="mr-2 h-5 w-5" />
              Explore Exams
            </Link>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
