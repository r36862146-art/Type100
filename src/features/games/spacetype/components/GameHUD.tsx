import React from "react";
import { Heart, Zap, Target, Trophy, Flame } from "lucide-react";

interface GameHUDProps {
  score: number;
  level: number;
  lives: number;
  accuracy: number;
  wpm: number;
  combo: number;
  currentTyped: string;
  targetWord: string | null;
}

export function GameHUD({
  score,
  level,
  lives,
  accuracy,
  wpm,
  combo,
  currentTyped,
  targetWord,
}: GameHUDProps) {
  const multiplier = Math.min(1 + Math.floor(combo / 5), 5);

  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex flex-col justify-between h-full z-10">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        {/* Top Left */}
        <div className="flex flex-col gap-2">
          <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex items-center gap-3 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Score</span>
              <span className="text-xl font-black text-white font-mono leading-none tracking-tight">{score}</span>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Level</span>
              <span className="text-lg font-bold text-white leading-none">{level}</span>
            </div>
          </div>

          <div className="flex gap-1 mt-1">
            {[1, 2, 3].map((i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i <= lives
                    ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    : "text-zinc-600 opacity-30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Top Right */}
        <div className="flex flex-col gap-2 items-end">
          <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex items-center gap-3 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Speed</span>
              <span className="text-xl font-bold text-white font-mono leading-none flex items-center gap-1">
                {wpm} <Zap className="w-4 h-4 text-cyan-400" />
              </span>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Accuracy</span>
              <span className="text-lg font-bold text-white font-mono leading-none flex items-center gap-1">
                {accuracy}% <Target className="w-4 h-4 text-green-400" />
              </span>
            </div>
          </div>

          {combo > 2 && (
            <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex items-center gap-3 animate-in slide-in-from-right fade-in">
              <Flame className={`w-5 h-5 ${combo > 10 ? 'text-orange-500' : 'text-orange-300'}`} />
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-orange-200 font-bold uppercase tracking-wider leading-none">Combo</span>
                <span className="text-xl font-black text-white font-mono leading-none">
                  x{multiplier} <span className="text-sm text-orange-400">({combo})</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Area - Current Typing Info */}
      <div className="flex justify-center mb-8">
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/10 flex flex-col items-center gap-2 transition-all duration-300 min-w-[300px] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-[0.2em]">Target Lock</span>
          {targetWord ? (
            <div className="text-3xl font-mono tracking-widest relative">
              <span className="text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">
                {currentTyped}
              </span>
              <span className="text-zinc-500">
                {targetWord.slice(currentTyped.length)}
              </span>
            </div>
          ) : (
            <div className="text-xl font-mono tracking-widest text-zinc-600 uppercase">
              Scanning...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
