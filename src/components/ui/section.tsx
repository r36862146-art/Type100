import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Props for the Section component. Inherits standard HTML section attributes.
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * A semantic section component with standard vertical padding.
 */
const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("py-12 md:py-16 lg:py-24", className)}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

export { Section }
