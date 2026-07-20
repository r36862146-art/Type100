"use client";

import React from "react";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SharedHUD } from "../engine/ui/SharedHUD";
import { SharedResultScreen } from "../engine/ui/SharedResultScreen";
import { useTypeRaceGame } from "./hooks/useTypeRaceGame";
import { RaceMode } from "./config/raceConfig";
import { Flag, Timer, Zap, Gauge } from "lucide-react";

export function TypeRaceGame() {
  const {
    canvasRef,
    gameState,
    setGameState,
    initGame,
    timeRemaining,
    currentTyped,
    targetWord,
    playerSpeed,
    position,
    nitroPercent,
    averageSpeed,
    highestSpeed,
    wpm,
    accuracy,
    combo,
    longestCombo,
    isHeated,
    totalRacers
  } = useTypeRaceGame();

  const handleStart = (mode: RaceMode) => {
    initGame(mode);
  };

  const handleMainMenu = () => {
    setGameState("LOADING");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] pt-16 bg-black">
      <Container className="flex-1 flex flex-col py-6 max-w-6xl">
        <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(14,165,233,0.1)] bg-slate-900">
          
          {/* Main Menu State */}
          {gameState === "LOADING" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
              <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mb-2 tracking-tight italic">
                TYPE RACE
              </h1>
              <p className="text-zinc-400 font-mono mb-12 tracking-widest uppercase text-sm">
                Speed is just a keystroke away.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => handleStart('sprint')}
                  className="group relative px-8 py-4 bg-white rounded-xl font-bold text-black flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <Play className="w-5 h-5 fill-black" />
                  <span className="tracking-widest uppercase">Sprint</span>
                </button>
                <button
                  onClick={() => handleStart('circuit')}
                  className="group relative px-8 py-4 bg-sky-500 rounded-xl font-bold text-white flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span className="tracking-widest uppercase">Circuit</span>
                </button>
              </div>
            </div>
          )}

          {/* Game HUD */}
          {(gameState === "PLAYING" || gameState === "PAUSED") && (
            <SharedHUD
              score={averageSpeed}
              wpm={wpm}
              combo={combo}
              isHeated={isHeated}
              theme="dark"
              leftContent={
                <div className="flex gap-2">
                  <div className="bg-sky-900/40 backdrop-blur-md rounded-xl px-4 py-2 border border-sky-500/30 flex items-center gap-3">
                    <Flag className="w-5 h-5 text-sky-400" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider leading-none">Pos</span>
                      <span className="text-xl font-bold text-white font-mono leading-none">
                        {position}<span className="text-sm text-sky-500">/{totalRacers}</span>
                      </span>
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex items-center gap-3">
                    <Timer className="w-5 h-5 text-zinc-400" />
                    <span className="text-xl font-bold text-white font-mono leading-none">
                      {(timeRemaining / 1000).toFixed(1)}s
                    </span>
                  </div>
                </div>
              }
              rightContent={
                <div className="flex flex-col gap-2 items-end">
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col gap-1 w-48">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Zap className={`w-3 h-3 ${nitroPercent === 100 ? 'text-sky-400 fill-sky-400 animate-pulse' : 'text-zinc-500'}`} />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Nitro</span>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-white">{Math.floor(nitroPercent)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${nitroPercent === 100 ? 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]' : 'bg-zinc-500'}`}
                        style={{ width: `${nitroPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    <span className="text-xl font-bold text-emerald-400 font-mono leading-none">
                      {Math.floor(playerSpeed)} <span className="text-xs text-emerald-600">MPH</span>
                    </span>
                  </div>
                </div>
              }
              bottomContent={
                targetWord && (
                  <div className="bg-black/80 backdrop-blur-xl rounded-2xl px-12 py-6 border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center gap-4">
                    <div className="text-5xl font-mono tracking-widest font-black">
                      <span className="text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]">
                        {currentTyped}
                      </span>
                      <span className="text-zinc-600">
                        {targetWord.slice(currentTyped.length)}
                      </span>
                    </div>
                  </div>
                )
              }
            />
          )}

          {/* Result Screen */}
          {gameState === "GAME_OVER" && (
            <SharedResultScreen
              title={position === 1 ? "1st Place!" : `Finished ${position}th`}
              icon={<Flag className={`w-16 h-16 mb-4 ${position === 1 ? 'text-yellow-400' : 'text-sky-400'}`} />}
              score={Math.floor(averageSpeed * 10)}
              accuracy={accuracy}
              wpm={wpm}
              highestCombo={longestCombo}
              coinsEarned={Math.floor(averageSpeed / 2)}
              xpEarned={Math.floor(averageSpeed * 5)}
              onPlayAgain={() => handleStart('sprint')}
              onMainMenu={handleMainMenu}
              theme="dark"
              primaryColorClass={position === 1 ? "text-yellow-400" : "text-sky-400"}
              customStats={[
                { icon: <Gauge className="w-4 h-4 text-emerald-400" />, label: "Avg Speed", value: `${Math.floor(averageSpeed)} MPH` },
                { icon: <Zap className="w-4 h-4 text-sky-400" />, label: "Top Speed", value: `${Math.floor(highestSpeed)} MPH` },
              ]}
            />
          )}

          {/* Canvas Engine */}
          <canvas
            ref={canvasRef}
            className="block w-full h-full object-cover"
          />
        </div>
      </Container>
    </div>
  );
}
