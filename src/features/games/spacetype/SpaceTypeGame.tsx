"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SharedHUD } from "../engine/ui/SharedHUD";
import { SharedResultScreen } from "../engine/ui/SharedResultScreen";
import { useSpaceTypeGame } from "./hooks/useSpaceTypeGame";
import { Crosshair, Heart, Shield } from "lucide-react";

export function SpaceTypeGame() {
  const {
    canvasRef,
    gameState,
    setGameState,
    score,
    wave,
    lives,
    currentTyped,
    targetWord,
    wpm,
    accuracy,
    combo,
    longestCombo,
    isHeated,
    activePowerup,
    bossHealth,
    initGame
  } = useSpaceTypeGame();

  const handleStart = () => {
    initGame();
  };

  const handleMainMenu = () => {
    setGameState("LOADING");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] pt-16 bg-black">
      <Container className="flex-1 flex flex-col py-6 max-w-6xl">
        <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.1)] bg-slate-900">
          
          {/* Main Menu State */}
          {gameState === "LOADING" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2 tracking-tight">
                SPACETYPE
              </h1>
              <p className="text-zinc-400 font-mono mb-12 tracking-widest uppercase text-sm">
                Type to destroy. Survive the swarm.
              </p>
              
              <button
                onClick={handleStart}
                className="group relative px-8 py-4 bg-white rounded-full font-bold text-black flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
              >
                <Play className="w-5 h-5 fill-black" />
                <span className="tracking-widest uppercase">Start Mission</span>
              </button>
            </div>
          )}

          {/* Game HUD */}
          {(gameState === "PLAYING" || gameState === "PAUSED") && (
            <SharedHUD
              score={score}
              wpm={wpm}
              combo={combo}
              isHeated={isHeated}
              theme="dark"
              leftContent={
                <div className="flex items-center gap-4">
                  <div className="bg-purple-900/40 backdrop-blur-md rounded-xl px-4 py-2 border border-purple-500/30 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider leading-none">Wave</span>
                      <span className="text-xl font-bold text-white font-mono leading-none">{wave}</span>
                    </div>
                  </div>
                  {activePowerup && (
                    <div className="bg-blue-900/40 backdrop-blur-md rounded-xl px-4 py-2 border border-blue-500/30 flex items-center gap-3 animate-pulse">
                      <span className="text-xs text-blue-300 font-bold uppercase tracking-wider">
                        Powerup Active
                      </span>
                    </div>
                  )}
                </div>
              }
              rightContent={
                <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 flex items-center gap-2">
                  {[1, 2, 3].map((life) => (
                    <Heart 
                      key={life} 
                      className={`w-5 h-5 transition-all ${
                        life <= lives 
                          ? "fill-red-500 text-red-500" 
                          : "fill-zinc-800 text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
              }
              bottomContent={
                <div className="flex flex-col items-center gap-4">
                  {bossHealth && (
                    <div className="w-96 bg-black/60 backdrop-blur-md rounded-full border border-red-500/50 p-1">
                      <div 
                        className="h-2 bg-red-500 rounded-full transition-all duration-300"
                        style={{ width: `${(bossHealth.current / bossHealth.max) * 100}%` }}
                      />
                    </div>
                  )}
                  {targetWord && (
                    <div className="bg-black/80 backdrop-blur-xl rounded-2xl px-12 py-6 border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center gap-4">
                      <Crosshair className="w-6 h-6 text-cyan-400 animate-pulse" />
                      <div className="text-5xl font-mono tracking-widest">
                        <span className="text-cyan-400 font-bold">{currentTyped}</span>
                        <span className="text-zinc-500">{targetWord.slice(currentTyped.length)}</span>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          )}

          {/* Result Screen */}
          {gameState === "GAME_OVER" && (
            <SharedResultScreen
              title="Mission Failed"
              score={score}
              accuracy={accuracy}
              wpm={wpm}
              highestCombo={longestCombo}
              coinsEarned={Math.floor(score / 50)}
              xpEarned={Math.floor(score / 10)}
              onPlayAgain={handleStart}
              onMainMenu={handleMainMenu}
              theme="dark"
              primaryColorClass="text-purple-400"
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
