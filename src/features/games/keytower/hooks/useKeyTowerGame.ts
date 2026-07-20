import { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../../engine/hooks/useGame';
import { useTypingEngine } from '../../engine/typing/TypingEngine';
import { WordManager } from '../../engine/typing/WordManager';
import { ParticleSystem } from '../../engine/effects/ParticleSystem';
import { AudioManager } from '../../engine/audio/AudioManager';
import { TowerFloor } from '../entities/TowerFloor';
import { BackgroundManager } from '../entities/BackgroundManager';
import { TOWER_CONFIG } from '../config/towerConfig';
import { FLOOR_CONFIG, FloorType } from '../config/floorConfig';
import { REWARD_CONFIG } from '../config/rewardConfig';

const DICTIONARY = [
  "foundation", "structure", "balance", "stability", "crane", "construct", 
  "architecture", "blueprint", "concrete", "steel", "glass", "pillar",
  "support", "elevate", "height", "zenith", "apex", "summit", "tower", "skyline"
];

export function useKeyTowerGame() {
  const [score, setScore] = useState(0);
  const [stability, setStability] = useState(100);
  const [floorCount, setFloorCount] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [typedSoFar, setTypedSoFar] = useState("");
  const [cameraY, setCameraY] = useState(0);

  const { registerKeystroke, startSession, endSession, combo, wpm, accuracy, longestCombo, reset: resetTyping } = useTypingEngine();
  
  const isHeated = wpm > 60 && accuracy > 95;

  const wordManagerRef = useRef(new WordManager(DICTIONARY));
  const particleSystemRef = useRef(new ParticleSystem());
  
  const bgManagerRef = useRef(new BackgroundManager());
  const floorsRef = useRef<TowerFloor[]>([]);
  
  const scoreRef = useRef(0);
  const stabilityRef = useRef(100);
  const floorCountRef = useRef(0);
  const targetCameraYRef = useRef(0);
  const currentCameraYRef = useRef(0);

  const { canvasRef, gameState, setGameState, startGame, stopGame } = useGame(
    (dt) => update(dt),
    (ctx) => render(ctx)
  );

  const initGame = useCallback(() => {
    setScore(0);
    scoreRef.current = 0;
    
    setStability(TOWER_CONFIG.maxStability);
    stabilityRef.current = TOWER_CONFIG.maxStability;
    
    setFloorCount(0);
    floorCountRef.current = 0;
    
    setTargetCameraYRef(0);
    currentCameraYRef.current = 0;
    
    setCurrentWord(wordManagerRef.current.getRandomWord());
    setTypedSoFar("");
    
    // Add foundation block
    const foundation = new TowerFloor(0, 0, 0, 'normal', false, FLOOR_CONFIG);
    foundation.isPlaced = true;
    floorsRef.current = [foundation];
    
    resetTyping();
    startSession();
    startGame();
  }, [startGame, resetTyping, startSession]);

  const setTargetCameraYRef = (val: number) => {
    targetCameraYRef.current = val;
  };

  const handleGameOver = useCallback(() => {
    // Spawn massive particles for collapse
    if (canvasRef.current && floorsRef.current.length > 0) {
      const topFloor = floorsRef.current[floorsRef.current.length - 1];
      particleSystemRef.current.emit({
        x: canvasRef.current.width / 2,
        y: canvasRef.current.height / 2,
        color: '#94a3b8',
        size: 8,
        speed: 300,
        life: 2.0,
        decay: 1.0,
        count: 50
      });
    }

    AudioManager.play("wrong");
    stopGame();
    endSession();
  }, [stopGame, endSession, canvasRef]);

  // Keyboard Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === "Backspace") {
        if (typedSoFar.length > 0) {
          setTypedSoFar(prev => prev.slice(0, -1));
        }
        return;
      }

      if (e.key.length !== 1) return;
      if (e.key === " ") e.preventDefault();

      const char = e.key.toLowerCase();
      const expectedChar = currentWord[typedSoFar.length];
      
      if (char === expectedChar) {
        const newTyped = typedSoFar + char;
        setTypedSoFar(newTyped);
        registerKeystroke(true);
        AudioManager.play("type");

        // Recover some stability on correct key
        stabilityRef.current = Math.min(TOWER_CONFIG.maxStability, stabilityRef.current + 0.5);
        
        // Word complete
        if (newTyped === currentWord) {
          // Drop new floor
          floorCountRef.current++;
          
          let floorType: FloorType = 'normal';
          if (combo >= 5) floorType = 'golden';
          if (combo >= 10 && Math.random() > 0.5) floorType = 'glass';
          
          const newFloorY = -(floorCountRef.current * FLOOR_CONFIG.height);
          // Spawn it high above target
          const startY = newFloorY - 400;
          
          const newFloor = new TowerFloor(0, startY, newFloorY, floorType, false, FLOOR_CONFIG);
          floorsRef.current.push(newFloor);
          
          // Emit drop particles at the target (simulating dust when it lands)
          if (canvasRef.current) {
            particleSystemRef.current.emit({
              x: canvasRef.current.width / 2,
              y: canvasRef.current.height / 2 + 100, // Roughly where top of tower is visually
              color: isHeated ? '#f97316' : '#cbd5e1',
              size: isHeated ? 6 : 4,
              speed: 100,
              life: 1.0,
              decay: 1.5,
              count: isHeated ? 20 : 10,
              isHeated: isHeated
            });
          }

          AudioManager.play("type"); 
          
          // Score
          let pts = REWARD_CONFIG.pointsPerFloor;
          if (floorType === 'golden') pts *= REWARD_CONFIG.goldenMultiplier;
          pts = Math.floor(pts * (1 + combo * REWARD_CONFIG.comboBonusMultiplier));
          if (isHeated) pts = Math.floor(pts * 1.2);
          
          scoreRef.current += pts;
          setScore(scoreRef.current);
          
          // Big stability recover
          stabilityRef.current = Math.min(TOWER_CONFIG.maxStability, stabilityRef.current + TOWER_CONFIG.correctRecovery);
          
          // Adjust camera target
          setTargetCameraYRef(newFloorY + 200); // offset so tower isn't perfectly centered vertically

          // Next word
          setCurrentWord(wordManagerRef.current.getRandomWord());
          setTypedSoFar("");
        }
      } else {
        // Mistake
        registerKeystroke(false);
        AudioManager.play("wrong");
        
        // Heavy stability penalty
        stabilityRef.current -= TOWER_CONFIG.mistakePenalty;
        
        // Crack the top floor
        if (floorsRef.current.length > 0) {
          floorsRef.current[floorsRef.current.length - 1].cracked = true;
        }
      }
      
      setStability(stabilityRef.current);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, typedSoFar, currentWord, registerKeystroke, combo]);

  const update = (dt: number) => {
    if (!canvasRef.current) return;

    // Passive stability drain
    // Drain increases slightly every 20 floors
    const levelMultiplier = 1 + Math.floor(floorCountRef.current / 20) * TOWER_CONFIG.drainIncreasePerLevel;
    const currentDrain = TOWER_CONFIG.drainPerSecond * levelMultiplier;
    
    stabilityRef.current -= currentDrain * (dt / 1000);
    setStability(Math.max(0, stabilityRef.current));

    if (stabilityRef.current <= 0) {
      handleGameOver();
      return;
    }

    // Camera follow
    currentCameraYRef.current += (targetCameraYRef.current - currentCameraYRef.current) * TOWER_CONFIG.cameraSmoothness;
    setCameraY(currentCameraYRef.current);

    // Update background milestones
    bgManagerRef.current.currentFloor = floorCountRef.current;
    
    // Update floors
    floorsRef.current.forEach(f => f.update(dt));

    setFloorCount(floorCountRef.current);

    particleSystemRef.current.update(dt);
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    bgManagerRef.current.render(ctx);

    ctx.save();
    
    // Center horizontally, move camera vertically
    // currentCameraYRef is negative as we go up. We want to shift world down by that amount.
    ctx.translate(width / 2, height * 0.8 - currentCameraYRef.current);

    // Shake effect if stability is low
    if (stabilityRef.current < TOWER_CONFIG.crackThreshold) {
      const shakeAmount = (TOWER_CONFIG.crackThreshold - stabilityRef.current) * 0.2;
      ctx.translate(
        (Math.random() - 0.5) * shakeAmount,
        (Math.random() - 0.5) * shakeAmount
      );
    }

    // Render floors
    floorsRef.current.forEach(f => {
      // Small optimization: only render if roughly on screen
      const screenY = f.y + (height * 0.8 - currentCameraYRef.current);
      if (screenY > -200 && screenY < height + 200) {
        f.render(ctx);
      }
    });

    // Render particles
    ctx.restore(); // Particle system usually uses absolute coords, but since we emitted them relative to center we should render them after restore
    
    // We actually need to shift particles too if they are in world space.
    // Our particle system doesn't know about camera. We emitted them at screen coords.
    // So we just render them normally.
    particleSystemRef.current.render(ctx);
  };

  return {
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
    isHeated,
  };
}
