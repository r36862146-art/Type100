import React, { forwardRef } from 'react';
import { ResultsSnapshot } from '../types';
import { Logo } from '@/components/ui/logo';
import { Target, Zap, Clock } from 'lucide-react';

interface ShareableCardProps {
  snapshot: ResultsSnapshot;
  username?: string;
}

export const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  ({ snapshot, username = "Type100X User" }, ref) => {
    return (
      <div 
        ref={ref}
        // Use fixed dimensions for standard social share (1200x630)
        className="w-[1200px] h-[630px] flex flex-col justify-between bg-card text-card-foreground p-16 border-2 border-border shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)',
        }}
      >
        {/* Subtle background decoration */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center z-10">
          <div className="flex items-center gap-4 scale-150 origin-left">
            <Logo />
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold opacity-80">{username}</h2>
            <p className="text-lg text-muted-foreground mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="flex items-center justify-between z-10 my-8">
          <div className="flex flex-col">
            <span className="text-[12rem] font-bold leading-none tracking-tighter text-primary">
              {snapshot.wpm}
            </span>
            <span className="text-3xl font-medium text-muted-foreground ml-2 uppercase tracking-widest">
              Words Per Minute
            </span>
          </div>

          <div className="flex flex-col gap-8 text-right bg-background/50 p-8 rounded-3xl backdrop-blur-md border border-white/5">
            <div>
              <p className="text-xl text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-end gap-2">
                <Target className="w-5 h-5" /> Accuracy
              </p>
              <p className="text-5xl font-bold">{snapshot.accuracy}%</p>
            </div>
            <div>
              <p className="text-xl text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-end gap-2">
                <Zap className="w-5 h-5" /> Raw Speed
              </p>
              <p className="text-5xl font-bold">{snapshot.rawWpm} WPM</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end z-10">
          <div className="flex gap-12">
            <div>
              <p className="text-lg text-muted-foreground">Time</p>
              <p className="text-3xl font-semibold flex items-center gap-2 mt-1">
                <Clock className="w-6 h-6 text-primary" />
                {Math.floor(snapshot.elapsedTime / 1000)}s
              </p>
            </div>
            <div>
              <p className="text-lg text-muted-foreground">Consistency</p>
              <p className="text-3xl font-semibold mt-1">
                {snapshot.progress}%
              </p>
            </div>
          </div>
          <div className="text-2xl font-medium tracking-wide text-primary bg-primary/10 px-6 py-3 rounded-full">
            type100x.com
          </div>
        </div>
      </div>
    );
  }
);
ShareableCard.displayName = 'ShareableCard';
