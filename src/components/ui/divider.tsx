import * as React from "react"
import { Separator } from "./separator"

/**
 * Props for the Divider component. Inherits Separator props.
 */
export interface DividerProps extends React.ComponentPropsWithoutRef<typeof Separator> {}

/**
 * A semantic divider, acting as an alias for Separator.
 */
const Divider = React.forwardRef<React.ElementRef<typeof Separator>, DividerProps>(
  ({ ...props }, ref) => {
    return <Separator ref={ref} {...props} />
  }
)
Divider.displayName = "Divider"

export { Divider }
