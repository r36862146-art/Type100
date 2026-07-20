import React from "react";
import { Zap, Timer, Trophy, Flame } from "lucide-react";

interface RaceHUDProps {
  position: number;
  totalRacers: number;
  timeRemaining: number;
  speed: number;
  wpm: number;
  combo: number;
  nitroPercent: number;
  currentTyped: string;
  targetWord: string;
}

export function RaceHUD({
  position,
  totalRacers,
  timeRemaining,
  speed,
  wpm,
  combo,
  nitroPercent,
  currentTyped,
  targetWord,
}: RaceHUDProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPositionSuffix = (pos: number) => {
    if (pos === 1) return 'st';
    if (pos === 2) return 'nd';
    if (pos === 3) return 'rd';
    return 'th';
  };

  return (
    <div className="absolute top-0 left-0 w-full p-6 pointer-events-none flex flex-col justify-between h-full z-10">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        {/* Top Left: Position & Time */}
        <div className="flex flex-col gap-3">
          <div className="bg-black/60 backdrop-blur-md rounded-xl px-6 py-3 border border-white/10 flex items-center gap-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <Trophy className={`w-8 h-8 ${position === 1 ? 'text-yellow-400' : 'text-zinc-400'}`} />
            <div className="flex flex-col">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider leading-none">Position</span>
              <span className="text-3xl font-black text-white font-mono leading-none tracking-tight">
                {position}<span className="text-lg text-zinc-500">{getPositionSuffix(position)}</span>
                <span className="text-lg text-zinc-600 font-normal"> / {totalRacers}</span>
              </span>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md rounded-xl px-5 py-2 border border-white/10 flex items-center gap-3">
            <Timer className="w-5 h-5 text-red-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Time Left</span>
              <span className="text-xl font-bold text-white font-mono leading-none">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right: Speed & Stats */}
        <div className="flex flex-col gap-3 items-end">
          <div className="bg-black/60 backdrop-blur-md rounded-xl px-6 py-3 border border-white/10 flex flex-col items-end gap-1 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider leading-none">Current Speed</span>
            <span className="text-4xl font-black text-white font-mono leading-none flex items-baseline gap-1">
              {Math.floor(speed * 100)} <span className="text-lg text-zinc-500 font-bold">KM/H</span>
            </span>
          </div>

          <div className="flex gap-2">
            <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex flex-col items-end">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">WPM</span>
              <span className="text-lg font-bold text-white font-mono">{wpm}</span>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex flex-col items-end">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Combo</span>
              <span className="text-lg font-bold text-orange-400 font-mono">x{combo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD: Typing Interface & Nitro */}
      <div className="flex flex-col items-center mb-8 gap-4 w-full">
        
        {/* Nitro Bar */}
        <div className="w-full max-w-md bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-4">
          <Flame className={`w-6 h-6 ${nitroPercent >= 100 ? 'text-sky-400 animate-pulse' : 'text-zinc-600'}`} />
          <div className="flex-1 h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-100"
              style={{ width: `${nitroPercent}%` }}
            />
            {nitroPercent >= 100 && (
              <div className="absolute inset-0 bg-sky-400/30 animate-pulse" />
            )}
          </div>
          <span className="text-xs font-bold text-zinc-400 font-mono w-8 text-right">
            {Math.floor(nitroPercent)}%
          </span>
        </div>

        {/* Word Input */}
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl px-12 py-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="text-5xl font-mono tracking-widest relative">
            <span className="text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]">
              {currentTyped}
            </span>
            <span className="text-zinc-500">
              {targetWord.slice(currentTyped.length)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
