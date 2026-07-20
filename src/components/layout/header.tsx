"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { MobileMenu } from "./mobile-menu"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/practice", label: "Practice" },
  { href: "/practice?mode=learning", label: "Learning" },
  { href: "/games", label: "Games" },
  { href: "/exams", label: "Explore Exams" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2" aria-label="Home">
              <Logo />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6" aria-label="Desktop Navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    pathname === link.href ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
            </div>
            
            {/* Mobile Navigation */}
            <MobileMenu navLinks={NAV_LINKS} />
          </div>
        </div>
      </Container>
    </header>
  )
}
