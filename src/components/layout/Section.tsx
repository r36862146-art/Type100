import { cn } from "@/lib/utils"

export function Section({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-12 md:py-16 lg:py-24", className)}
      {...props}
    >
      {children}
    </section>
  )
}
