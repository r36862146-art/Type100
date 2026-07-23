import * as React from "react"
import { Container } from "@/components/ui/container"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="border-t py-10">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo className="scale-75 origin-center md:origin-left text-muted-foreground" />
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="/about" className="hover:text-foreground transition-colors">About</a>
              {/* You can add Terms and Privacy here later */}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Type100X. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
