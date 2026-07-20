import React from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";

export function LearningIntroCard() {
  const benefits = [
    "Improve typing speed",
    "Improve reading skills",
    "Learn important exam topics",
    "Revise General Knowledge",
    "Build vocabulary",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-center">
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Learn While You Type
            </h2>
          </div>
          
          <p className="text-muted-foreground text-base leading-relaxed">
            Practice typing while learning useful knowledge for competitive exams. 
            Our intelligent engine scales the content perfectly to your selected timer, 
            ensuring you always have high-quality, factually accurate text to practice with.
          </p>
        </div>

        <div className="w-px bg-border hidden md:block self-stretch" />

        <div className="flex-1 md:pl-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Benefits
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
}
