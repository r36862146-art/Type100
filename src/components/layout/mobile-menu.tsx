"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  navLinks: { href: string; label: string }[]
}

export function MobileMenu({ navLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Body scroll, Escape key, and Focus Trap
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
      
      // Simple Focus Trap
      if (e.key === 'Tab' && isOpen && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus()
            e.preventDefault()
          }
        }
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      // Focus first element on open
      setTimeout(() => {
        const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        focusableElements?.[0]?.focus()
      }, 100)
    }

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Slide-out Menu Panel */}
            <motion.div
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm border-l border-border/50 bg-background/95 backdrop-blur-xl p-6 shadow-2xl flex flex-col rounded-l-3xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted/80"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex flex-col gap-2 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center px-4 py-3 min-h-[48px] text-lg font-medium rounded-xl transition-all active:scale-[0.98]",
                      pathname === link.href 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
