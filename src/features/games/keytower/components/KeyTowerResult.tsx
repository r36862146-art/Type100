import React from "react";
import { Building, Timer, Target, RotateCcw, Home, Zap, Star } from "lucide-react";
import { REWARD_CONFIG } from "../config/rewardConfig";

interface KeyTowerResultProps {
  score: number;
  highestFloor: number;
  highestCombo: number;
  accuracy: number;
  wpm: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export function KeyTowerResult({
  score,
  highestFloor,
  highestCombo,
  accuracy,
  wpm,
  onPlayAgain,
  onMainMenu,
}: KeyTowerResultProps) {
  
  const coinsEarned = Math.floor(REWARD_CONFIG.baseCoins + (score / 200));
  const xpEarned = Math.floor(REWARD_CONFIG.baseXp + (highestFloor * 10));

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <Building className="w-16 h-16 text-sky-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-zinc-800 tracking-tight mb-2 uppercase">Tower Collapsed</h2>
          
          <div className="flex flex-col items-center justify-center gap-1 mb-6">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Final Score</span>
            <span className={`text-6xl font-black font-mono leading-none text-sky-500`}>
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-center gap-6">
            <div className="bg-amber-100 rounded-xl px-6 py-2 border border-amber-200 flex items-center gap-3">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              <div className="text-left">
                <span className="text-[10px] text-amber-700 font-bold uppercase block leading-none mb-1">Coins</span>
                <span className="text-xl font-black text-amber-600 leading-none">+{coinsEarned}</span>
              </div>
            </div>
            <div className="bg-purple-100 rounded-xl px-6 py-2 border border-purple-200 flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-500 fill-purple-500" />
              <div className="text-left">
                <span className="text-[10px] text-purple-700 font-bold uppercase block leading-none mb-1">XP</span>
                <span className="text-xl font-black text-purple-600 leading-none">+{xpEarned}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox icon={<Building className="w-5 h-5 text-sky-500" />} label="Highest Floor" value={highestFloor.toString()} />
          <StatBox icon={<Target className="w-5 h-5 text-emerald-500" />} label="Accuracy" value={`${accuracy}%`} />
          <StatBox icon={<Timer className="w-5 h-5 text-zinc-500" />} label="WPM" value={wpm.toString()} />
          <StatBox icon={<Star className="w-5 h-5 text-amber-500" />} label="Max Combo" value={`x${highestCombo}`} />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-lg shadow-sky-500/30"
          >
            <RotateCcw className="w-5 h-5" />
            BUILD AGAIN
          </button>
          
          <button
            onClick={onMainMenu}
            className="flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-all"
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
    <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xl font-mono font-black text-zinc-800">{value}</span>
    </div>
  );
}
