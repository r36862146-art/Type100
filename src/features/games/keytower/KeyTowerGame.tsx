"use client";

import React from "react";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SharedHUD } from "../engine/ui/SharedHUD";
import { SharedResultScreen } from "../engine/ui/SharedResultScreen";
import { useKeyTowerGame } from "./hooks/useKeyTowerGame";
import { TOWER_CONFIG } from "./config/towerConfig";
import { Building, Activity } from "lucide-react";

export function KeyTowerGame() {
  const {
    canvasRef,
    gameState,
    setGameState,
    initGame,
    score,
    stability,
    floorCount,
    currentWord,
    typedSoFar,
    wpm,
    accuracy,
    combo,
    longestCombo,
    isHeated
  } = useKeyTowerGame();

  const handleStart = () => {
    initGame();
  };

  const handleMainMenu = () => {
    setGameState("LOADING");
  };

  const isLowStability = stability < TOWER_CONFIG.crackThreshold;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] pt-16 bg-white">
      <Container className="flex-1 flex flex-col py-6 max-w-4xl">
        <div className="relative flex-1 w-full rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl bg-sky-100">
          
          {/* Main Menu State */}
          {gameState === "LOADING" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md z-20">
              <div className="text-center mb-12">
                <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-sky-700 mb-2 tracking-tight">
                  KEYTOWER
                </h1>
                <p className="text-sky-800 font-mono tracking-widest uppercase text-sm font-bold">
                  Build the sky.
                </p>
              </div>
              
              <div className="flex flex-col gap-4 w-64">
                <button
                  onClick={handleStart}
                  className="group relative px-6 py-4 bg-sky-500 border border-sky-400 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all hover:scale-105 hover:bg-sky-400 shadow-xl shadow-sky-500/30"
                >
                  <Play className="w-5 h-5 fill-white transition-colors" />
                  <span className="tracking-widest uppercase">Start Building</span>
                </button>
              </div>
            </div>
          )}

          {/* Game HUD */}
          {(gameState === "PLAYING" || gameState === "PAUSED") && (
            <SharedHUD
              score={score}
              wpm={wpm}
              combo={combo}
              isHeated={isHeated}
              theme="light"
              leftContent={
                <div className="bg-sky-500/80 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 flex items-center gap-3 shadow-[0_4px_30px_rgba(14,165,233,0.3)]">
                  <Building className="w-5 h-5 text-white" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-sky-100 font-bold uppercase tracking-wider leading-none">Floor</span>
                    <span className="text-xl font-bold text-white font-mono leading-none">{floorCount}</span>
                  </div>
                </div>
              }
              rightContent={
                <div className={`bg-white/80 backdrop-blur-md rounded-xl p-4 border border-zinc-200 flex flex-col items-end gap-2 w-48 transition-colors ${isLowStability ? 'bg-red-500/20 border-red-500/50' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${isLowStability ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Stability</span>
                  </div>
                  
                  <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden border border-zinc-300">
                    <div 
                      className={`h-full transition-all duration-300 ${isLowStability ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.max(0, Math.min(100, stability))}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold font-mono ${isLowStability ? 'text-red-500' : 'text-zinc-800'}`}>
                    {Math.floor(stability)}%
                  </span>
                </div>
              }
              bottomContent={
                currentWord && (
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl px-12 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 border border-zinc-200 mb-8">
                    <div className="text-5xl font-mono tracking-widest font-black">
                      <span className="text-emerald-500">{typedSoFar}</span>
                      <span className="text-zinc-300">{currentWord.slice(typedSoFar.length)}</span>
                    </div>
                  </div>
                )
              }
            />
          )}

          {/* Result Screen */}
          {gameState === "GAME_OVER" && (
            <SharedResultScreen
              title="Tower Collapsed"
              icon={<Building className="w-16 h-16 text-sky-500 mb-4" />}
              score={score}
              accuracy={accuracy}
              wpm={wpm}
              highestCombo={longestCombo}
              coinsEarned={Math.floor(score / 200)}
              xpEarned={Math.floor(floorCount * 10)}
              onPlayAgain={handleStart}
              onMainMenu={handleMainMenu}
              theme="light"
              primaryColorClass="text-sky-500"
              customStats={[
                { icon: <Building className="w-4 h-4 text-sky-500" />, label: "Highest Floor", value: floorCount.toString() }
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
