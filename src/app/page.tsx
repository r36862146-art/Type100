import dynamic from "next/dynamic"

import { Hero } from "@/components/home/hero"
import { TypingPreview } from "@/components/home/typing-preview"
import { QuickStats } from "@/components/home/quick-stats"
import { PracticeModes } from "@/components/home/practice-modes"
import { ExamPractice } from "@/components/home/exam-practice"

// Lazy load below-the-fold sections for optimal initial load performance
const WhyType100 = dynamic(() => import("@/components/home/why-type100").then(mod => mod.WhyType100))
const Features = dynamic(() => import("@/components/home/features").then(mod => mod.Features))
const Faq = dynamic(() => import("@/components/home/faq").then(mod => mod.Faq))
const Cta = dynamic(() => import("@/components/home/cta").then(mod => mod.Cta))

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TypingPreview />
      <QuickStats />
      <PracticeModes />
      <ExamPractice />
      
      {/* Below the fold */}
      <WhyType100 />
      <Features />
      <Faq />
      <Cta />
    </div>
  )
}
