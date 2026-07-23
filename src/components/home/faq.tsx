"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"
import { cn } from "@/lib/utils"

const FAQS = [
  {
    question: "Is Type100X completely free?",
    answer: "Yes, the core typing practice and standard tests are completely free. We may introduce premium analytics in the future, but the essential experience will remain free.",
  },
  {
    question: "Do you support Hindi typing?",
    answer: "Yes, we fully support the Hindi Mangal layout, which is standard for most government typing exams like SSC and RRB.",
  },
  {
    question: "How is the WPM calculated?",
    answer: "We use the standard industry formula: (Characters Typed / 5) / Time in Minutes. Errors are subtracted from the gross WPM to provide your net WPM.",
  },
  {
    question: "Can I use Type100X on my phone?",
    answer: "While the site is responsive and accessible on mobile devices, typing tests are best experienced on a physical desktop or laptop keyboard.",
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  return (
    <section className="py-24">
      <Container>
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Got a question? We've got answers. If you have some other questions, feel free to reach out.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-border/50">
          {FAQS.map((faq, i) => (
            <FadeIn key={i} delay={0.1 * i} direction="up">
              <div className="py-5">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between text-left text-lg font-medium hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  aria-expanded={openIndex === i}
                >
                  {faq.question}
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-200",
                      openIndex === i && "rotate-180 text-foreground"
                    )}
                  />
                </button>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
