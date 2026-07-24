import dynamic from "next/dynamic"

import { Hero } from "@/components/home/hero"
import { TypingPreview } from "@/components/home/typing-preview"
import { QuickStats } from "@/components/home/quick-stats"
import { PracticeModes } from "@/components/home/practice-modes"
import { ExamPractice } from "@/components/home/exam-practice"

import { constructMetadata } from "@/lib/seo"

const WhyType100X = dynamic(() => import("@/components/home/why-type100x").then(mod => mod.WhyType100X))
const Features = dynamic(() => import("@/components/home/features").then(mod => mod.Features))
const Faq = dynamic(() => import("@/components/home/faq").then(mod => mod.Faq))
const Cta = dynamic(() => import("@/components/home/cta").then(mod => mod.Cta))

export const metadata = constructMetadata({
  title: "The Fastest Typing Practice Platform",
  canonical: "/",
})

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TypingPreview />
      <QuickStats />
      <PracticeModes />
      <ExamPractice />
      
      {/* Below the fold */}
      <WhyType100X />
      <Features />
      <Faq />
      <Cta />
    </div>
  )
}
