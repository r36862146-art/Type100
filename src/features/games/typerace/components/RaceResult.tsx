import React from "react";
import { Trophy, Timer, Zap, Target, RotateCcw, Home, FastForward, Flame } from "lucide-react";
import { calculateRewards } from "../config/rewardConfig";

interface RaceResultProps {
  position: number;
  totalRacers: number;
  averageSpeed: number;
  highestSpeed: number;
  wpm: number;
  accuracy: number;
  longestCombo: number;
  nitroUsage: number;
  onPlayAgain: () => void;
  onNextRace?: () => void;
  onMainMenu: () => void;
}

export function RaceResult({
  position,
  totalRacers,
  averageSpeed,
  highestSpeed,
  wpm,
  accuracy,
  longestCombo,
  nitroUsage,
  onPlayAgain,
  onNextRace,
  onMainMenu,
}: RaceResultProps) {
  
  const rewards = calculateRewards(position);
  
  const isPodium = position <= 3;
  const positionColor = position === 1 ? "text-yellow-400" : position === 2 ? "text-zinc-300" : position === 3 ? "text-amber-600" : "text-white";

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(14,165,233,0.15)] animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-zinc-400 tracking-tight mb-2 uppercase">Race Finished</h2>
          
          <div className="flex justify-center items-end gap-3 mb-6">
            <span className={`text-7xl font-black font-mono leading-none ${positionColor} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
              {position}
            </span>
            <span className="text-2xl text-zinc-500 font-bold mb-1">/ {totalRacers}</span>
          </div>

          <div className="flex justify-center gap-6">
            <div className="bg-black/40 rounded-xl px-6 py-2 border border-white/5">
              <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">Coins Earned</span>
              <span className="text-2xl font-black text-yellow-400">+{rewards.coins}</span>
            </div>
            <div className="bg-black/40 rounded-xl px-6 py-2 border border-white/5">
              <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">XP Earned</span>
              <span className="text-2xl font-black text-purple-400">+{rewards.xp}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatBox icon={<Zap className="w-5 h-5 text-cyan-400" />} label="Avg Speed" value={`${Math.floor(averageSpeed * 100)} km/h`} />
          <StatBox icon={<Zap className="w-5 h-5 text-sky-400" />} label="Top Speed" value={`${Math.floor(highestSpeed * 100)} km/h`} />
          <StatBox icon={<Target className="w-5 h-5 text-green-400" />} label="Accuracy" value={`${accuracy}%`} />
          
          <StatBox icon={<Timer className="w-5 h-5 text-red-400" />} label="Avg WPM" value={wpm.toString()} />
          <StatBox icon={<Trophy className="w-5 h-5 text-orange-400" />} label="Max Combo" value={`x${longestCombo}`} />
          <StatBox icon={<Flame className="w-5 h-5 text-sky-400" />} label="Nitro Used" value={`${nitroUsage}x`} />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white transition-all border border-white/5"
          >
            <RotateCcw className="w-5 h-5" />
            RETRY
          </button>
          
          {onNextRace && isPodium && (
            <button
              onClick={onNextRace}
              className="flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)]"
            >
              NEXT RACE
              <FastForward className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onMainMenu}
            className="flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white transition-all border border-white/5"
          >
            <Home className="w-5 h-5" />
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-2xl font-mono font-bold text-white">{value}</span>
    </div>
  );
}
