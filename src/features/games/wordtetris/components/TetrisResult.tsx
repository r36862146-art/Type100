import React from "react";
import { Trophy, Timer, Target, RotateCcw, Home, Skull, Coins, Zap } from "lucide-react";
import { REWARD_CONFIG } from "../config/rewardConfig";

interface TetrisResultProps {
  score: number;
  highestCombo: number;
  wordsDestroyed: number;
  accuracy: number;
  wpm: number;
  levelReached: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export function TetrisResult({
  score,
  highestCombo,
  wordsDestroyed,
  accuracy,
  wpm,
  levelReached,
  onPlayAgain,
  onMainMenu,
}: TetrisResultProps) {
  
  // Calculate basic rewards
  const coinsEarned = Math.floor(REWARD_CONFIG.baseCoins + (score / 100));
  const xpEarned = Math.floor(REWARD_CONFIG.baseXp + (wordsDestroyed * 5));

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_60px_rgba(239,68,68,0.15)] animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <Skull className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Game Over</h2>
          
          <div className="flex flex-col items-center justify-center gap-1 mb-6">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Final Score</span>
            <span className={`text-6xl font-black font-mono leading-none text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]`}>
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-center gap-6">
            <div className="bg-black/40 rounded-xl px-6 py-2 border border-white/5 flex items-center gap-3">
              <Coins className="w-6 h-6 text-yellow-400" />
              <div className="text-left">
                <span className="text-[10px] text-zinc-400 font-bold uppercase block leading-none mb-1">Coins Earned</span>
                <span className="text-xl font-black text-yellow-400 leading-none">+{coinsEarned}</span>
              </div>
            </div>
            <div className="bg-black/40 rounded-xl px-6 py-2 border border-white/5 flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-400" />
              <div className="text-left">
                <span className="text-[10px] text-zinc-400 font-bold uppercase block leading-none mb-1">XP Earned</span>
                <span className="text-xl font-black text-purple-400 leading-none">+{xpEarned}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox icon={<Target className="w-5 h-5 text-green-400" />} label="Accuracy" value={`${accuracy}%`} />
          <StatBox icon={<Timer className="w-5 h-5 text-red-400" />} label="WPM" value={wpm.toString()} />
          <StatBox icon={<Trophy className="w-5 h-5 text-orange-400" />} label="Max Combo" value={`x${highestCombo}`} />
          <StatBox icon={<Skull className="w-5 h-5 text-zinc-400" />} label="Words Hit" value={wordsDestroyed.toString()} />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white transition-all border border-white/5"
          >
            <RotateCcw className="w-5 h-5" />
            TRY AGAIN
          </button>
          
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
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xl font-mono font-bold text-white">{value}</span>
    </div>
  );
}
