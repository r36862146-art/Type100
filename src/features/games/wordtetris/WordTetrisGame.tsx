"use client";

import React from "react";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SharedHUD } from "../engine/ui/SharedHUD";
import { SharedResultScreen } from "../engine/ui/SharedResultScreen";
import { useWordTetrisGame } from "./hooks/useWordTetrisGame";
import { DifficultyLevel } from "./config/difficultyConfig";
import { Crosshair, Heart, Trophy, Skull } from "lucide-react";

export function WordTetrisGame() {
  const {
    canvasRef,
    gameState,
    setGameState,
    initGame,
    score,
    lives,
    level,
    targetedWordStr,
    typedSoFar,
    wpm,
    accuracy,
    combo,
    longestCombo,
    isHeated,
    wordsDestroyed
  } = useWordTetrisGame();

  const handleStart = (diff: DifficultyLevel) => {
    initGame(diff);
  };

  const handleMainMenu = () => {
    setGameState("LOADING");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] pt-16 bg-zinc-950">
      <Container className="flex-1 flex flex-col py-6 max-w-4xl">
        <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] bg-slate-900">
          
          {/* Main Menu State */}
          {gameState === "LOADING" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
              <div className="text-center mb-12">
                <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 mb-2 tracking-tight">
                  WORD TETRIS
                </h1>
                <p className="text-zinc-400 font-mono tracking-widest uppercase text-sm">
                  Don't let them drop.
                </p>
              </div>
              
              <div className="flex flex-col gap-4 w-64">
                {(['easy', 'medium', 'hard', 'expert'] as DifficultyLevel[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleStart(diff)}
                    className="group relative px-6 py-4 bg-zinc-900 border border-white/10 rounded-xl font-bold text-white flex items-center justify-between transition-all hover:scale-105 hover:border-white/30 hover:bg-zinc-800"
                  >
                    <span className="tracking-widest uppercase">{diff}</span>
                    <Play className="w-5 h-5 fill-zinc-500 group-hover:fill-white transition-colors" />
                  </button>
                ))}
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
              theme="dark"
              leftContent={
                <div className="bg-indigo-900/40 backdrop-blur-md rounded-xl px-4 py-2 border border-indigo-500/30 flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-indigo-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider leading-none">Level</span>
                    <span className="text-xl font-bold text-white font-mono leading-none">{level}</span>
                  </div>
                </div>
              }
              rightContent={
                <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 flex items-center gap-2">
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
                targetedWordStr ? (
                  <div className="bg-black/80 backdrop-blur-xl rounded-2xl px-12 py-6 border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center gap-4">
                    <Crosshair className="w-6 h-6 text-green-400 animate-pulse" />
                    <div className="text-5xl font-mono tracking-widest relative">
                      <span className="text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]">
                        {typedSoFar}
                      </span>
                      <span className="text-zinc-600">
                        {targetedWordStr.slice(typedSoFar.length)}
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
                )
              }
            />
          )}

          {/* Result Screen */}
          {gameState === "GAME_OVER" && (
            <SharedResultScreen
              title="Game Over"
              icon={<Skull className="w-16 h-16 text-red-500 opacity-80 mb-4" />}
              score={score}
              accuracy={accuracy}
              wpm={wpm}
              highestCombo={longestCombo}
              coinsEarned={Math.floor(score / 100)}
              xpEarned={Math.floor(wordsDestroyed * 5)}
              onPlayAgain={() => handleStart('medium')}
              onMainMenu={handleMainMenu}
              theme="dark"
              primaryColorClass="text-sky-400"
              customStats={[
                { icon: <Skull className="w-4 h-4 text-zinc-400" />, label: "Words Hit", value: wordsDestroyed.toString() }
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
