import React from "react";
import { Trophy, Target, Zap, RotateCcw, Home, Star } from "lucide-react";

interface ResultScreenProps {
  score: number;
  accuracy: number;
  wpm: number;
  highestCombo: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export function ResultScreen({
  score,
  accuracy,
  wpm,
  highestCombo,
  onPlayAgain,
  onMainMenu,
}: ResultScreenProps) {
  // Calculate rating stars based on score/accuracy
  let stars = 1;
  if (score > 1000 && accuracy > 80) stars = 2;
  if (score > 3000 && accuracy > 85) stars = 3;
  if (score > 6000 && accuracy > 90) stars = 4;
  if (score > 10000 && accuracy > 95) stars = 5;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(139,92,246,0.2)] animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">MISSION OVER</h2>
          
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  i <= stars
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                    : "text-zinc-700"
                }`}
              />
            ))}
          </div>
          
          <div className="bg-black/50 rounded-xl p-4 border border-white/5 inline-block">
            <span className="text-sm text-zinc-400 font-bold uppercase tracking-wider block mb-1">Final Score</span>
            <span className="text-5xl font-mono font-black text-white text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-400">
              {score}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatBox icon={<Target className="w-5 h-5 text-green-400" />} label="Accuracy" value={`${accuracy}%`} />
          <StatBox icon={<Zap className="w-5 h-5 text-cyan-400" />} label="Speed" value={`${wpm} WPM`} />
          <StatBox icon={<Trophy className="w-5 h-5 text-yellow-400" />} label="Max Combo" value={`x${highestCombo}`} />
          <StatBox icon={<Trophy className="w-5 h-5 text-purple-400" />} label="Rating" value={`${stars} Star${stars > 1 ? 's' : ''}`} />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
          >
            <RotateCcw className="w-5 h-5" />
            PLAY AGAIN
          </button>
          
          <button
            onClick={onMainMenu}
            className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white transition-all border border-white/5"
          >
            <Home className="w-5 h-5" />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xl font-mono font-bold text-white">{value}</span>
    </div>
  );
}
