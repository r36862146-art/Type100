import * as React from "react"
import { Container } from "@/components/ui/container"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="border-t py-10">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo className="scale-75 origin-left text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Type100. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
