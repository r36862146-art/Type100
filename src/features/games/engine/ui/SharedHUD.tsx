import React from "react";
import { Activity, Trophy, Flame } from "lucide-react";

interface SharedHUDProps {
  score: number;
  wpm: number;
  combo: number;
  isHeated?: boolean;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  theme?: 'dark' | 'light';
}

export function SharedHUD({
  score,
  wpm,
  combo,
  isHeated = false,
  leftContent,
  rightContent,
  bottomContent,
  theme = 'dark'
}: SharedHUDProps) {

  const isDark = theme === 'dark';
  
  // Shared styles based on theme
  const panelClass = isDark 
    ? "bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] text-white"
    : "bg-white/80 backdrop-blur-md rounded-xl border border-zinc-200 shadow-[0_4px_30px_rgba(0,0,0,0.1)] text-zinc-800";
    
  const labelClass = isDark ? "text-zinc-400" : "text-zinc-500";
  
  // Heat specific styles
  const heatGlowClass = isHeated 
    ? "border-orange-500/80 shadow-[0_0_30px_rgba(249,115,22,0.6)] animate-pulse" 
    : "";

  return (
    <div className="absolute inset-0 p-6 pointer-events-none flex flex-col justify-between z-10 overflow-hidden">
      
      {/* Top Section */}
      <div className="flex justify-between items-start">
        
        {/* Top Left Area */}
        <div className="flex flex-col gap-3 items-start">
          <div className={`${panelClass} px-6 py-3 flex flex-col`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider leading-none mb-1 ${labelClass}`}>
              Score
            </span>
            <span className="text-4xl font-black font-mono leading-none tracking-tight">
              {score.toLocaleString()}
            </span>
          </div>
          {leftContent}
        </div>

        {/* Top Right Area */}
        <div className="flex flex-col gap-3 items-end">
          {rightContent}
          
          <div className="flex flex-col gap-1 items-end">
            <div className="flex gap-2">
              <div className={`${panelClass} px-4 py-2 flex flex-col items-end transition-all duration-300 ${heatGlowClass}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider leading-none mb-1 ${labelClass}`}>
                  WPM
                </span>
                <span className={`text-lg font-bold font-mono leading-none ${isHeated ? 'text-orange-400' : ''}`}>{wpm}</span>
              </div>
              
              <div className={`${panelClass} px-4 py-2 flex flex-col items-end transition-all duration-300 ${heatGlowClass}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider leading-none mb-1 ${labelClass}`}>
                  Combo
                </span>
                <span className={`text-lg font-bold font-mono leading-none ${isHeated ? 'text-orange-400' : (isDark ? 'text-amber-400' : 'text-amber-500')}`}>
                  x{combo}
                </span>
              </div>
            </div>
            {isHeated && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-orange-400 uppercase tracking-widest mt-1 animate-in fade-in slide-in-from-top-1">
                <Flame className="w-3 h-3" /> Max Heat (1.2x)
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      {bottomContent && (
        <div className="flex flex-col items-center mb-8 gap-4 w-full justify-end flex-1">
          {bottomContent}
        </div>
      )}

    </div>
  );
}
