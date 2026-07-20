"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={cn(
        "fixed top-0 left-0 z-[100] -translate-y-full bg-primary px-4 py-2 text-primary-foreground font-medium transition-transform focus:translate-y-0"
      )}
    >
      Skip to content
    </a>
  )
}
