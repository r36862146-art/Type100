import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Props for the Logo component.
 */
export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The premium Type100 logo component.
 */
const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 font-mono font-bold tracking-tighter text-xl", className)}
        {...props}
      >
        <span className="bg-primary text-primary-foreground rounded px-1.5 py-0.5 shadow-sm">
          Type
        </span>
        <span>100</span>
      </div>
    )
  }
)
Logo.displayName = "Logo"

export { Logo }
