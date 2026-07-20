import * as React from "react"
import { cn } from "@/lib/utils"

import { Container } from "@/components/ui/container"
import { FadeIn } from "@/components/ui/fade-in"

export function TypingPreview() {
  const codeSnippet = `const [wpm, setWpm] = useState(0);
const [accuracy, setAccuracy] = useState(100);

useEffect(() => {
  if (isTyping && timeLeft > 0) {
    calculateStats(keystrokes, errors);
  }
}, [keystrokes]);`

  return (
    <section className="pb-24">
      <Container>
        <FadeIn delay={0.4} direction="up">
          <div className="relative mx-auto max-w-4xl rounded-xl border bg-card shadow-2xl overflow-hidden">
            {/* Fake window header */}
            <div className="flex items-center px-4 py-3 border-b bg-muted/30">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto flex items-center justify-center space-x-2 text-xs text-muted-foreground font-medium">
                <span className="opacity-70">typing-engine.ts</span>
              </div>
            </div>
            
            {/* Code Content */}
            <div className="p-6 md:p-8 font-mono text-sm md:text-base overflow-x-auto selection:bg-primary/20">
              <pre className="text-muted-foreground">
                <code className="grid">
                  <span className="text-primary font-medium">const</span> [wpm, setWpm] = <span className="text-blue-500 dark:text-blue-400">useState</span>(0);
                  <span className="text-primary font-medium">const</span> [accuracy, setAccuracy] = <span className="text-blue-500 dark:text-blue-400">useState</span>(100);
                  <br />
                  <span className="text-blue-500 dark:text-blue-400">useEffect</span>(() =&gt; {"{"}
                  {"  "}<span className="text-primary font-medium">if</span> (isTyping &amp;&amp; timeLeft &gt; 0) {"{"}
                  {"    "}<span className="text-blue-500 dark:text-blue-400">calculateStats</span>(keystrokes, <span className="text-destructive font-medium underline decoration-destructive/50 underline-offset-4 decoration-wavy">erors</span><span className="animate-pulse border-r-2 border-primary ml-[1px]"></span>);
                  {"  "}{"}"}
                  {"}"}, [keystrokes]);
                </code>
              </pre>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
