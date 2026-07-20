import React from "react";
import { Heart, Trophy, Zap, Crosshair } from "lucide-react";

interface TetrisHUDProps {
  score: number;
  lives: number;
  combo: number;
  accuracy: number;
  wpm: number;
  level: number;
  targetedWord: string;
  typedSoFar: string;
}

export function TetrisHUD({
  score,
  lives,
  combo,
  accuracy,
  wpm,
  level,
  targetedWord,
  typedSoFar,
}: TetrisHUDProps) {
  return (
    <div className="absolute top-0 left-0 w-full p-6 pointer-events-none flex flex-col justify-between h-full z-10">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        {/* Top Left: Score & Level */}
        <div className="flex flex-col gap-3">
          <div className="bg-black/60 backdrop-blur-md rounded-xl px-6 py-3 border border-white/10 flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider leading-none mb-1">Score</span>
            <span className="text-4xl font-black text-white font-mono leading-none tracking-tight">
              {score.toLocaleString()}
            </span>
          </div>
          
          <div className="bg-indigo-900/40 backdrop-blur-md rounded-xl px-4 py-2 border border-indigo-500/30 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider leading-none">Level</span>
              <span className="text-xl font-bold text-white font-mono leading-none">
                {level}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right: Lives, WPM, Combo */}
        <div className="flex flex-col gap-3 items-end">
          <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            {[1, 2, 3].map((life) => (
              <Heart 
                key={life} 
                className={`w-6 h-6 transition-all ${
                  life <= lives 
                    ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" 
                    : "fill-zinc-800 text-zinc-700"
                }`}
              />
            ))}
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

      {/* Bottom HUD: Target Interface */}
      <div className="flex flex-col items-center mb-8 gap-4 w-full">
        {targetedWord ? (
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl px-12 py-6 border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center gap-4">
            <Crosshair className="w-6 h-6 text-green-400 animate-pulse" />
            <div className="text-5xl font-mono tracking-widest relative">
              <span className="text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]">
                {typedSoFar}
              </span>
              <span className="text-zinc-600">
                {targetedWord.slice(typedSoFar.length)}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl px-12 py-6 border border-white/5 opacity-50 flex items-center gap-4">
            <Crosshair className="w-6 h-6 text-zinc-600" />
            <div className="text-2xl font-mono tracking-widest text-zinc-600 uppercase">
              No Target
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
