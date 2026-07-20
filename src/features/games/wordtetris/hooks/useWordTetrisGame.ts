import { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../../engine/hooks/useGame';
import { useTypingEngine } from '../../engine/typing/TypingEngine';
import { WordManager } from '../../engine/typing/WordManager';
import { ParticleSystem } from '../../engine/effects/ParticleSystem';
import { AudioManager } from '../../engine/audio/AudioManager';
import { FallingWord } from '../entities/FallingWord';
import { DifficultyLevel, DIFFICULTY_LEVELS } from '../config/difficultyConfig';
import { SPAWN_CONFIG } from '../config/spawnConfig';
import { calculateScore } from '../config/rewardConfig';
import { THEME_CONFIGS } from '../config/themeConfig';

const DICTIONARY = [
  "survival", "tetris", "falling", "danger", "gravity", "speed", 
  "accuracy", "keyboard", "reaction", "focus", "pressure", "endless",
  "challenge", "combo", "multiplier", "target", "precision", "rhythm"
];

export function useWordTetrisGame() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [targetedWordStr, setTargetedWordStr] = useState("");
  const [typedSoFar, setTypedSoFar] = useState("");
  const [dangerFlash, setDangerFlash] = useState(0); // 0 to 1 for screen red flash

  const { registerKeystroke, startSession, endSession, combo, wpm, accuracy, longestCombo, reset: resetTyping } = useTypingEngine();
  
  const isHeated = wpm > 60 && accuracy > 95;

  const wordManagerRef = useRef(new WordManager(DICTIONARY));
  const particleSystemRef = useRef(new ParticleSystem());
  const wordsRef = useRef<FallingWord[]>([]);
  const targetedWordIdRef = useRef<string | null>(null);
  
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const wordsDestroyedRef = useRef(0);
  const timeSinceLastSpawnRef = useRef(0);
  const theme = THEME_CONFIGS['dark_neon'];

  const { canvasRef, gameState, setGameState, startGame, stopGame } = useGame(
    (dt) => update(dt),
    (ctx) => render(ctx)
  );

  const initGame = useCallback((diff: DifficultyLevel) => {
    setDifficulty(diff);
    
    setScore(0);
    scoreRef.current = 0;
    
    setLives(3);
    livesRef.current = 3;
    
    setLevel(1);
    levelRef.current = 1;
    
    wordsDestroyedRef.current = 0;
    timeSinceLastSpawnRef.current = 0;
    
    setTargetedWordStr("");
    setTypedSoFar("");
    setDangerFlash(0);
    
    wordsRef.current = [];
    targetedWordIdRef.current = null;
    
    resetTyping();
    startSession();
    startGame();
  }, [startGame, resetTyping, startSession]);

  const handleGameOver = useCallback(() => {
    stopGame();
    endSession();
  }, [stopGame, endSession]);

  // Keyboard Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === "Backspace") {
        if (typedSoFar.length > 0) {
          setTypedSoFar(prev => prev.slice(0, -1));
          
          if (targetedWordIdRef.current) {
            const target = wordsRef.current.find(w => w.id === targetedWordIdRef.current);
            if (target) {
              target.typedIndex = Math.max(0, target.typedIndex - 1);
            }
          }
        }
        return;
      }

      if (e.key.length !== 1) return;
      if (e.key === " ") e.preventDefault();

      const char = e.key.toLowerCase();
      
      let targetEntity = wordsRef.current.find(w => w.id === targetedWordIdRef.current);

      // If we don't have a target, try to find one that starts with the character
      if (!targetEntity) {
        // Sort by y to target lowest word first if multiple match
        const availableWords = [...wordsRef.current].sort((a, b) => b.y - a.y);
        targetEntity = availableWords.find(w => w.text.startsWith(char));
        
        if (targetEntity) {
          targetedWordIdRef.current = targetEntity.id;
          wordsRef.current.forEach(w => w.isTargeted = false);
          targetEntity.isTargeted = true;
          setTargetedWordStr(targetEntity.text);
        }
      }

      if (targetEntity) {
        const expectedChar = targetEntity.text[targetEntity.typedIndex];
        
        if (char === expectedChar) {
          targetEntity.typedIndex++;
          const newTyped = targetEntity.text.substring(0, targetEntity.typedIndex);
          setTypedSoFar(newTyped);
          registerKeystroke(true);
          AudioManager.play("type");

          // Word Complete
          if (targetEntity.typedIndex === targetEntity.text.length) {
            // Destroy word
            targetEntity.alive = false;
            wordsRef.current = wordsRef.current.filter(w => w.id !== targetEntity!.id);
            
            // Add particles
            particleSystemRef.current.emit({
              x: targetEntity.x,
              y: targetEntity.y,
              color: isHeated ? "#f97316" : theme.typedTextColor,
              size: isHeated ? 6 : (4 + Math.random() * 4),
              speed: 100 + Math.random() * 200,
              life: 1.0,
              decay: 1.0,
              count: isHeated ? 25 : 15,
              isHeated: isHeated
            });

            AudioManager.play("type"); // placeholder for destroy sound
            
            // Add score
            let pts = calculateScore(targetEntity.text.length, combo);
            if (isHeated) pts *= 1.2;
            
            scoreRef.current += pts;
            setScore(scoreRef.current);
            
            wordsDestroyedRef.current++;
            
            // Level up every 10 words
            if (wordsDestroyedRef.current % 10 === 0) {
              levelRef.current++;
              setLevel(levelRef.current);
            }

            // Reset targeting
            targetedWordIdRef.current = null;
            setTargetedWordStr("");
            setTypedSoFar("");
          }
        } else {
          registerKeystroke(false);
          AudioManager.play("wrong");
        }
      } else {
        // Typed a character that doesn't match any word's start
        registerKeystroke(false);
        AudioManager.play("wrong");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, typedSoFar, registerKeystroke, combo, theme]);

  const update = (dt: number) => {
    if (livesRef.current <= 0) {
      handleGameOver();
      return;
    }

    if (!canvasRef.current) return;
    const canvasHeight = canvasRef.current.height;
    const canvasWidth = canvasRef.current.width;

    const diffConfig = DIFFICULTY_LEVELS[difficulty];
    
    // Spawn Logic
    timeSinceLastSpawnRef.current += dt;
    const currentSpawnInterval = Math.max(
      SPAWN_CONFIG.minSpawnIntervalMs,
      SPAWN_CONFIG.baseSpawnIntervalMs * Math.pow(SPAWN_CONFIG.spawnIntervalMultiplierPerLevel, levelRef.current - 1)
    );

    if (
      timeSinceLastSpawnRef.current > currentSpawnInterval && 
      wordsRef.current.length < diffConfig.maxActiveWords
    ) {
      timeSinceLastSpawnRef.current = 0;
      
      const newWordText = wordManagerRef.current.getRandomWord();
      
      // Calculate random X position ensuring it stays within padding
      const padding = SPAWN_CONFIG.horizontalPadding;
      // Rough estimate of width: 12px per char
      const estimatedWidth = newWordText.length * 12 + 30; 
      const minX = padding + estimatedWidth / 2;
      const maxX = canvasWidth - padding - estimatedWidth / 2;
      const randomX = minX + Math.random() * (maxX - minX);

      // Check vertical spacing with other words (don't spawn too close to a recent spawn)
      let canSpawn = true;
      for (const w of wordsRef.current) {
        if (w.y < SPAWN_CONFIG.verticalSpacing) {
          canSpawn = false;
          break;
        }
      }

      if (canSpawn) {
        const fallSpeed = diffConfig.baseFallSpeed * Math.pow(diffConfig.speedMultiplierPerLevel, levelRef.current - 1);
        const newWord = new FallingWord(randomX, -30, newWordText, fallSpeed, theme);
        wordsRef.current.push(newWord);
      }
    }

    // Update words and check danger zone
    const dangerZoneY = canvasHeight - 100;
    
    for (let i = wordsRef.current.length - 1; i >= 0; i--) {
      const word = wordsRef.current[i];
      word.update(dt);
      
      if (word.y > dangerZoneY) {
        // Hit danger zone
        word.alive = false;
        wordsRef.current.splice(i, 1);
        
        livesRef.current--;
        setLives(livesRef.current);
        setDangerFlash(1.0);
        
        // Reset typing engine combo explicitly because of life loss
        AudioManager.play("wrong"); // placeholder for hurt sound

        if (word.id === targetedWordIdRef.current) {
          targetedWordIdRef.current = null;
          setTargetedWordStr("");
          setTypedSoFar("");
        }
      }
    }

    // Flash decay
    if (dangerFlash > 0) {
      setDangerFlash(prev => Math.max(0, prev - (dt / 500))); // Half-second decay
    }

    particleSystemRef.current.update(dt);
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Background
    ctx.fillStyle = theme.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Danger Zone
    const dangerZoneHeight = 100;
    const dangerY = height - dangerZoneHeight;
    
    // Draw danger line
    ctx.beginPath();
    ctx.moveTo(0, dangerY);
    ctx.lineTo(width, dangerY);
    ctx.strokeStyle = theme.dangerZoneColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill danger area
    const gradient = ctx.createLinearGradient(0, dangerY, 0, height);
    gradient.addColorStop(0, theme.dangerZoneColor);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, dangerY, width, dangerZoneHeight);

    // Flash Effect
    if (dangerFlash > 0) {
      ctx.fillStyle = `rgba(239, 68, 68, ${dangerFlash * 0.3})`; // Red tint
      ctx.fillRect(0, 0, width, height);
    }

    // Words
    wordsRef.current.forEach(w => w.render(ctx));

    // Particles
    particleSystemRef.current.render(ctx);
  };

  return {
    canvasRef,
    gameState,
    setGameState,
    initGame,
    difficulty,
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
    wordsDestroyed: wordsDestroyedRef.current
  };
}
