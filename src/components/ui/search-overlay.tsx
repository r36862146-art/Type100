"use client";

import React, { useState, useEffect, useRef } from "react";
import { pluginManager } from "@/plugins";
import { Search, Command, X, FileText, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : document.dispatchEvent(new CustomEvent("open-search"));
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allExams = pluginManager.getAllProfiles();
  const filteredExams = allExams.filter(
    (ex) =>
      ex.exam.toLowerCase().includes(query.toLowerCase()) ||
      ex.post.toLowerCase().includes(query.toLowerCase()) ||
      ex.organization.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
    >
      <div
        className="w-full max-w-2xl bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-border/50">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-lg px-3 py-2 text-foreground placeholder:text-muted-foreground"
            placeholder="Search exams, posts, or practice modes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search query"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <Command className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p>Type to search across the Type100X ecosystem.</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <ul className="space-y-1">
              <li className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Exams & Posts
              </li>
              {filteredExams.map((exam) => (
                <li key={exam.id}>
                  <a
                    href={`/exams/${exam.organization.toLowerCase()}/${exam.id}`}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className={cn(
                      "p-2 rounded-lg shrink-0",
                      exam.organization === "SSC" ? "bg-blue-500/10 text-blue-500" :
                      exam.organization === "RRB" ? "bg-rose-500/10 text-rose-500" :
                      "bg-teal-500/10 text-teal-500"
                    )}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground">
                        {exam.organization} {exam.exam}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {exam.post} • {exam.qualifyingSpeed} WPM Required
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 bg-muted/30 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1">
            Navigate with <kbd className="bg-background border rounded px-1.5 py-0.5 font-sans shadow-sm">↑</kbd> <kbd className="bg-background border rounded px-1.5 py-0.5 font-sans shadow-sm">↓</kbd>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-background border rounded px-1.5 py-0.5 font-sans shadow-sm">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
