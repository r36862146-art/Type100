import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Props for the Container component. Inherits standard HTML div attributes.
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * A layout wrapper for consistent max-width and padding.
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container }
