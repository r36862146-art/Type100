import React from "react";
import { Building, Activity, Zap, Star } from "lucide-react";
import { TOWER_CONFIG } from "../config/towerConfig";

interface KeyTowerHUDProps {
  floor: number;
  stability: number;
  score: number;
  combo: number;
  accuracy: number;
  wpm: number;
  currentWord: string;
  typedSoFar: string;
}

export function KeyTowerHUD({
  floor,
  stability,
  score,
  combo,
  accuracy,
  wpm,
  currentWord,
  typedSoFar,
}: KeyTowerHUDProps) {

  const isLowStability = stability < TOWER_CONFIG.crackThreshold;

  return (
    <div className="absolute top-0 left-0 w-full p-6 pointer-events-none flex flex-col justify-between h-full z-10">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        {/* Top Left: Floor & Score */}
        <div className="flex flex-col gap-3">
          <div className="bg-black/30 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <span className="text-xs text-white/70 font-bold uppercase tracking-wider leading-none mb-1">Score</span>
            <span className="text-4xl font-black text-white font-mono leading-none tracking-tight">
              {score.toLocaleString()}
            </span>
          </div>
          
          <div className="bg-sky-500/80 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 flex items-center gap-3 shadow-[0_4px_30px_rgba(14,165,233,0.3)]">
            <Building className="w-5 h-5 text-white" />
            <div className="flex flex-col">
              <span className="text-[10px] text-sky-100 font-bold uppercase tracking-wider leading-none">Floor</span>
              <span className="text-xl font-bold text-white font-mono leading-none">
                {floor}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right: Stability, WPM, Combo */}
        <div className="flex flex-col gap-3 items-end">
          <div className={`bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20 flex flex-col items-end gap-2 w-48 transition-colors ${isLowStability ? 'bg-red-500/20 border-red-500/50' : ''}`}>
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${isLowStability ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
              <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Stability</span>
            </div>
            
            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
              <div 
                className={`h-full transition-all duration-300 ${isLowStability ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.max(0, Math.min(100, stability))}%` }}
              />
            </div>
            <span className={`text-xs font-bold font-mono ${isLowStability ? 'text-red-400' : 'text-white'}`}>
              {Math.floor(stability)}%
            </span>
          </div>

          <div className="flex gap-2">
            <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 flex flex-col items-end">
              <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider leading-none">WPM</span>
              <span className="text-lg font-bold text-white font-mono">{wpm}</span>
            </div>
            
            <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 flex flex-col items-end">
              <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider leading-none">Combo</span>
              <span className="text-lg font-bold text-amber-400 font-mono">x{combo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD: Crane / Target Word */}
      <div className="flex flex-col items-center mb-16 gap-4 w-full">
        {currentWord && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl px-12 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 border border-zinc-200">
            <div className="text-5xl font-mono tracking-widest font-black">
              <span className="text-emerald-500">
                {typedSoFar}
              </span>
              <span className="text-zinc-300">
                {currentWord.slice(typedSoFar.length)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
