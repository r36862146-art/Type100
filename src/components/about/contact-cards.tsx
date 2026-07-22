"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Github, Mail, Copy, Check, ExternalLink } from "lucide-react"

export function ContactCards() {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText("r36862146@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-xl mx-auto md:mx-0">
      <div className="flex-1 flex items-center justify-between bg-background/50 border border-muted-foreground/20 rounded-2xl p-4 hover:bg-muted/30 hover:border-primary/30 transition-all shadow-sm group">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Mail className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground font-medium mb-0.5 uppercase tracking-wider">Email</p>
            <p className="text-sm font-semibold text-foreground">r36862146@gmail.com</p>
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
          aria-label="Copy email address"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />}
        </button>
      </div>

      <Link 
        href="https://github.com/rayush2001"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-between bg-background/50 border border-muted-foreground/20 rounded-2xl p-4 hover:bg-muted/30 hover:border-primary/30 transition-all shadow-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Github className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground font-medium mb-0.5 uppercase tracking-wider">GitHub</p>
            <p className="text-sm font-semibold text-foreground">github.com/rayush2001</p>
          </div>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground" />
        </div>
      </Link>

      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-bottom-5 fade-in z-50">
          <div className="bg-green-500/20 text-green-400 p-1 rounded-full">
            <Check className="h-4 w-4" />
          </div>
          Email copied to clipboard
        </div>
      )}
    </div>
  )
}
