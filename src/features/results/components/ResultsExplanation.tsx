"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export function ResultsExplanation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-card border border-border/40 rounded-xl overflow-hidden mt-8 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Understanding Your Results</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      {isOpen && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-card text-sm text-card-foreground animate-in slide-in-from-top-2 fade-in duration-200 border-t border-border/40">
          <div className="space-y-4">
            <ExplanationItem 
              title="WPM (Words Per Minute)" 
              description="How many standard words (5 characters each) you typed every minute. Higher WPM indicates faster typing." 
            />
            <ExplanationItem 
              title="Raw WPM" 
              description="Your pure typing speed before accounting for mistakes. Useful for measuring raw finger speed." 
            />
            <ExplanationItem 
              title="Accuracy" 
              description="Percentage of correctly typed characters. Higher accuracy means fewer typing mistakes." 
            />
            <ExplanationItem 
              title="CPM (Characters Per Minute)" 
              description="Total correctly typed characters divided by time. Useful for languages where word length varies." 
            />
            <ExplanationItem 
              title="Time" 
              description="Duration of the typing session." 
            />
          </div>
          
          <div className="space-y-4">
            <ExplanationItem 
              title="Correct Characters" 
              description="Characters typed perfectly according to the text." 
            />
            <ExplanationItem 
              title="Incorrect Characters" 
              description="Characters typed incorrectly in place of the expected text." 
            />
            <ExplanationItem 
              title="Extra Characters" 
              description="Additional characters typed that were not expected in the word." 
            />
            <ExplanationItem 
              title="Missed Characters" 
              description="Characters that were completely skipped from the original text." 
            />
            <ExplanationItem 
              title="Wrong Words" 
              description="Words containing one or more mistakes when submitted. Only tracked in Medium and Hard difficulty." 
            />
            <ExplanationItem 
              title="Backspaces" 
              description="Number of times Backspace was used. Helps understand how often you corrected mistakes." 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ExplanationItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-foreground">{title}</span>
      <span className="text-muted-foreground leading-relaxed">{description}</span>
    </div>
  );
}
