import React from "react";
import { RotateCcw, Home, Star, Zap, Target, Timer } from "lucide-react";

export interface SharedStat {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

interface SharedResultScreenProps {
  title?: string;
  icon?: React.ReactNode;
  score: number;
  accuracy: number;
  wpm: number;
  highestCombo: number;
  coinsEarned: number;
  xpEarned: number;
  customStats?: SharedStat[];
  onPlayAgain: () => void;
  onMainMenu: () => void;
  theme?: 'dark' | 'light';
  primaryColorClass?: string; 
}

export function SharedResultScreen({
  title = "Game Over",
  icon,
  score,
  accuracy,
  wpm,
  highestCombo,
  coinsEarned,
  xpEarned,
  customStats = [],
  onPlayAgain,
  onMainMenu,
  theme = 'dark',
  primaryColorClass = "text-sky-400"
}: SharedResultScreenProps) {

  const isDark = theme === 'dark';

  const overlayClass = isDark ? "bg-black/80" : "bg-black/60";
  const modalClass = isDark ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200";
  const titleClass = isDark ? "text-white" : "text-zinc-800";
  const labelClass = isDark ? "text-zinc-400" : "text-zinc-500";
  
  const statBoxClass = isDark 
    ? "bg-black/40 border-white/5 text-white" 
    : "bg-zinc-50 border-zinc-200 text-zinc-800";
    
  const btnPrimaryClass = isDark
    ? "bg-zinc-800 hover:bg-zinc-700 text-white border-white/5"
    : "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/30";
    
  const btnSecondaryClass = isDark
    ? "bg-zinc-800 hover:bg-zinc-700 text-white border-white/5"
    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700";

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md pointer-events-auto ${overlayClass}`}>
      <div className={`border rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-300 ${modalClass}`}>
        
        <div className="text-center mb-8">
          {icon && <div className="flex justify-center mb-4">{icon}</div>}
          <h2 className={`text-3xl font-black tracking-tight mb-2 uppercase ${titleClass}`}>{title}</h2>
          
          <div className="flex flex-col items-center justify-center gap-1 mb-6">
            <span className={`text-sm font-bold uppercase tracking-widest ${labelClass}`}>Final Score</span>
            <span className={`text-6xl font-black font-mono leading-none ${primaryColorClass}`}>
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-center gap-6">
            <div className={`rounded-xl px-6 py-2 border flex items-center gap-3 ${isDark ? 'bg-amber-900/20 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              <div className="text-left">
                <span className={`text-[10px] font-bold uppercase block leading-none mb-1 ${isDark ? 'text-amber-500/70' : 'text-amber-700'}`}>Coins Earned</span>
                <span className="text-xl font-black text-amber-500 leading-none">+{coinsEarned}</span>
              </div>
            </div>
            
            <div className={`rounded-xl px-6 py-2 border flex items-center gap-3 ${isDark ? 'bg-purple-900/20 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
              <Zap className="w-6 h-6 text-purple-500 fill-purple-500" />
              <div className="text-left">
                <span className={`text-[10px] font-bold uppercase block leading-none mb-1 ${isDark ? 'text-purple-500/70' : 'text-purple-700'}`}>XP Earned</span>
                <span className="text-xl font-black text-purple-500 leading-none">+{xpEarned}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-xl p-4 border flex flex-col items-center gap-2 ${statBoxClass}`}>
            <div className="flex items-center gap-2 mb-1">
              <Target className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>Accuracy</span>
            </div>
            <span className="text-xl font-mono font-bold">{accuracy}%</span>
          </div>
          
          <div className={`rounded-xl p-4 border flex flex-col items-center gap-2 ${statBoxClass}`}>
            <div className="flex items-center gap-2 mb-1">
              <Timer className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>WPM</span>
            </div>
            <span className="text-xl font-mono font-bold">{wpm}</span>
          </div>
          
          <div className={`rounded-xl p-4 border flex flex-col items-center gap-2 ${statBoxClass}`}>
            <div className="flex items-center gap-2 mb-1">
              <Star className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>Max Combo</span>
            </div>
            <span className="text-xl font-mono font-bold">x{highestCombo}</span>
          </div>
          
          {customStats.map((stat, idx) => (
            <div key={idx} className={`rounded-xl p-4 border flex flex-col items-center gap-2 ${statBoxClass}`}>
              <div className="flex items-center gap-2 mb-1">
                {stat.icon}
                <span className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>{stat.label}</span>
              </div>
              <span className="text-xl font-mono font-bold">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPlayAgain}
            className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all border ${btnPrimaryClass}`}
          >
            <RotateCcw className="w-5 h-5" />
            PLAY AGAIN
          </button>
          
          <button
            onClick={onMainMenu}
            className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all border ${btnSecondaryClass}`}
          >
            <Home className="w-5 h-5" />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
