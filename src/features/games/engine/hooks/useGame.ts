import { useEffect, useRef, useState } from 'react';
import { GameLoop } from '../core/GameLoop';
import { GameState } from '../types';

export function useGame(
  update: (dt: number) => void,
  render: (ctx: CanvasRenderingContext2D) => void
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);
  const [gameState, setGameState] = useState<GameState>("LOADING");
  
  const updateRef = useRef(update);
  const renderRef = useRef(render);
  const gameStateRef = useRef(gameState);

  // Sync volatile references without triggering useEffect rebuilds
  useEffect(() => {
    updateRef.current = update;
    renderRef.current = render;
    gameStateRef.current = gameState;
  }, [update, render, gameState]);

  // One-time engine creation and resize observers
  useEffect(() => {
    let dpr = window.devicePixelRatio || 1;

    const loop = new GameLoop(
      (dt) => {
        if (gameStateRef.current === "PLAYING") {
          updateRef.current(dt);
        }
      },
      () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.save();
        // Clear based on actual backing store pixels
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Scale for logic to work in logical CSS pixels
        ctx.scale(dpr, dpr);
        renderRef.current(ctx);
        ctx.restore();
      }
    );
    
    gameLoopRef.current = loop;

    // Handle responsive resize with Retina support
    const resize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        dpr = window.devicePixelRatio || 1;
        const rect = canvasRef.current.parentElement.getBoundingClientRect();
        
        // Set actual size in memory (scaled by DPR)
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
        
        // Set display size (CSS pixels)
        canvasRef.current.style.width = `${rect.width}px`;
        canvasRef.current.style.height = `${rect.height}px`;
      }
    };
    
    const handleBlur = () => {
      if (gameStateRef.current === "PLAYING") {
        setGameState("PAUSED");
      }
    };

    const handleFocus = () => {
      // Could optionally auto-resume here, but requiring a manual resume click is often safer for users
    };
    
    window.addEventListener('resize', resize);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    // Initial resize trigger
    resize();
    
    // Start immediately if we happen to mount in a PLAYING state
    if (gameStateRef.current === "PLAYING") {
      loop.start();
    }

    return () => {
      loop.stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []); // Run ONLY once on mount

  // Sync gameLoop play state when gameState changes
  useEffect(() => {
    if (gameState === "PLAYING") {
      gameLoopRef.current?.start();
    } else {
      gameLoopRef.current?.stop();
    }
  }, [gameState]);

  return {
    canvasRef,
    gameState,
    setGameState,
    startGame: () => {
      setGameState("PLAYING");
    },
    pauseGame: () => setGameState("PAUSED"),
    resumeGame: () => setGameState("PLAYING"),
    stopGame: () => {
      setGameState("GAME_OVER");
    }
  };
}
