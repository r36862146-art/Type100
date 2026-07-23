import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 transition-opacity hover:opacity-80", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold shadow-sm">
        T
      </div>
      <span className="font-sans text-xl font-bold tracking-tight text-foreground">Type100X</span>
    </Link>
  )
}
