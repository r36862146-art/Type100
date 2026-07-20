import { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../../engine/hooks/useGame';
import { useTypingEngine } from '../../engine/typing/TypingEngine';
import { WordManager } from '../../engine/typing/WordManager';
import { ParticleSystem } from '../../engine/effects/ParticleSystem';
import { AudioManager } from '../../engine/audio/AudioManager';
import { Enemy } from '../entities/Enemy';
import { Laser } from '../entities/Laser';
import { PlayerShip } from '../entities/PlayerShip';
import { Powerup } from '../entities/Powerup';
import { getWaveConfig, WaveConfig } from '../config/waveConfig';
import { ENEMY_CONFIGS } from '../config/enemyConfig';
import { POWERUP_CONFIGS, PowerupType } from '../config/powerupConfig';

// Fallback dictionary just in case
const DICTIONARY = [
  "galaxy", "nebula", "spaceship", "asteroid", "meteor", "comet", 
  "starlight", "supernova", "planet", "orbit", "gravity", "eclipse", 
  "satellite", "universe", "cosmos", "voyager", "apollo", "astronaut",
  "laser", "plasma", "quantum", "thrust", "hyperdrive", "alien"
];

export function useSpaceTypeGame() {
  // UI State
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [currentTyped, setCurrentTyped] = useState("");
  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [activePowerup, setActivePowerup] = useState<PowerupType | null>(null);
  const [bossHealth, setBossHealth] = useState<{current: number, max: number} | null>(null);

  // Typing Engine
  const { registerKeystroke, startSession, endSession, combo, wpm, accuracy, longestCombo, reset: resetTyping } = useTypingEngine();
  
  const isHeated = wpm > 60 && accuracy > 95;

  // Refs for Game Loop Mutability
  const wordManagerRef = useRef(new WordManager(DICTIONARY));
  const particleSystemRef = useRef(new ParticleSystem());
  const playerRef = useRef<PlayerShip | null>(null);
  
  const enemiesRef = useRef<Enemy[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const powerupsRef = useRef<Powerup[]>([]);
  
  const activeTargetIdRef = useRef<string | null>(null);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  
  // Wave & Spawn Management
  const waveRef = useRef(1);
  const currentWaveConfigRef = useRef<WaveConfig>(getWaveConfig(1));
  const enemiesToSpawnRef = useRef<{type: keyof typeof ENEMY_CONFIGS}[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const waveTransitionTimerRef = useRef<number>(0);
  
  // Powerup Management
  const activePowerupRef = useRef<PowerupType | null>(null);
  const powerupTimerRef = useRef<number>(0);

  // Screen shake
  const screenShakeRef = useRef<number>(0);

  // Engine Hook
  const { canvasRef, gameState, setGameState, startGame, stopGame } = useGame(
    (dt) => update(dt),
    (ctx) => render(ctx)
  );

  const initWave = useCallback((waveIndex: number) => {
    waveRef.current = waveIndex;
    setWave(waveIndex);
    const config = getWaveConfig(waveIndex);
    currentWaveConfigRef.current = config;
    
    const toSpawn: {type: keyof typeof ENEMY_CONFIGS}[] = [];
    if (config.hasBoss) {
      toSpawn.push({type: "boss"});
    } else {
      config.composition.forEach(comp => {
        for(let i=0; i<comp.count; i++) {
          toSpawn.push({type: comp.type});
        }
      });
      // Shuffle spawn order
      for (let i = toSpawn.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [toSpawn[i], toSpawn[j]] = [toSpawn[j], toSpawn[i]];
      }
    }
    enemiesToSpawnRef.current = toSpawn;
    waveTransitionTimerRef.current = 3000; // 3 second delay before spawn starts
  }, []);

  const initGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setCurrentTyped("");
    setTargetWord(null);
    setActivePowerup(null);
    setBossHealth(null);
    
    scoreRef.current = 0;
    livesRef.current = 3;
    enemiesRef.current = [];
    lasersRef.current = [];
    powerupsRef.current = [];
    activeTargetIdRef.current = null;
    lastSpawnRef.current = performance.now();
    
    activePowerupRef.current = null;
    powerupTimerRef.current = 0;
    screenShakeRef.current = 0;
    
    resetTyping();
    startSession();
    
    initWave(1);
    
    if (canvasRef.current) {
      playerRef.current = new PlayerShip(canvasRef.current.width / 2, canvasRef.current.height - 50);
    }
    
    startGame();
  }, [canvasRef, startGame, resetTyping, startSession, initWave]);

  const handleGameOver = useCallback(() => {
    stopGame();
    endSession();
  }, [stopGame, endSession]);

  const fireLaser = useCallback((targetX: number, targetY: number, targetId: string) => {
    if (playerRef.current) {
      playerRef.current.fireRecoil();
      // Handle Rapid Fire Powerup
      if (activePowerupRef.current === "rapid_fire") {
        lasersRef.current.push(new Laser(playerRef.current.x - 10, playerRef.current.y, targetX, targetY, targetId));
        lasersRef.current.push(new Laser(playerRef.current.x + 10, playerRef.current.y, targetX, targetY, targetId));
      } else {
        lasersRef.current.push(new Laser(playerRef.current.x, playerRef.current.y, targetX, targetY, targetId));
      }
      AudioManager.play("type"); // Or a specific laser sound
    }
  }, []);

  const clearTarget = useCallback(() => {
    const prevTarget = enemiesRef.current.find(e => e.id === activeTargetIdRef.current) || 
                       powerupsRef.current.find(p => p.id === activeTargetIdRef.current);
    if (prevTarget) prevTarget.isTargeted = false;
    
    activeTargetIdRef.current = null;
    setCurrentTyped("");
    setTargetWord(null);
  }, []);

  // Keyboard Input Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === " ") {
        e.preventDefault();
        return;
      }
      
      // Cancel Lock-on
      if (e.key === "Backspace") {
        clearTarget();
        return;
      }

      if (e.key.length !== 1) return;
      
      const char = e.key.toLowerCase();
      const enemies = enemiesRef.current;
      const powerups = powerupsRef.current;
      let activeTargetId = activeTargetIdRef.current;

      if (!activeTargetId) {
        // Find NEAREST matching enemy or powerup
        let bestTarget: Enemy | Powerup | null = null;
        let minDistance = Infinity;

        // Check enemies
        for (const en of enemies) {
          if (en.word.startsWith(char) && en.typed === "" && en.visible) {
            const distanceMetric = canvasRef.current!.height - en.y; 
            if (distanceMetric < minDistance) {
              minDistance = distanceMetric;
              bestTarget = en;
            }
          }
        }
        
        // Check powerups
        for (const p of powerups) {
          if (p.word.startsWith(char) && p.typed === "") {
             const distanceMetric = canvasRef.current!.height - p.y;
             if (distanceMetric < minDistance) {
               minDistance = distanceMetric;
               bestTarget = p;
             }
          }
        }

        if (bestTarget) {
          bestTarget.typed = char;
          bestTarget.isTargeted = true;
          activeTargetIdRef.current = bestTarget.id;
          
          setCurrentTyped(bestTarget.typed);
          setTargetWord(bestTarget.word);
          
          registerKeystroke(true);
          fireLaser(bestTarget.x, bestTarget.y, bestTarget.id);
        } else {
          registerKeystroke(false);
          AudioManager.play("wrong");
        }
      } else {
        // Continue targeting
        const target = enemies.find(en => en.id === activeTargetId) || powerups.find(p => p.id === activeTargetId);
        
        if (target) {
          const expectedChar = target.word[target.typed.length];
          if (char === expectedChar) {
            target.typed += char;
            setCurrentTyped(target.typed);
            
            registerKeystroke(true);
            fireLaser(target.x, target.y, target.id);
            
            // Note: Enemy destruction logic is handled in the Update loop when Lasers hit.
            // Powerup collection is also handled when laser hits.
          } else {
            registerKeystroke(false);
            AudioManager.play("wrong");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, registerKeystroke, clearTarget, fireLaser]);

  const activatePowerup = (type: PowerupType) => {
    activePowerupRef.current = type;
    setActivePowerup(type);
    const config = POWERUP_CONFIGS[type];
    powerupTimerRef.current = config.durationMs;
    
    if (playerRef.current) {
      playerRef.current.activePowerup = type;
    }
    
    // Instant effects
    if (type === "smart_bomb") {
      screenShakeRef.current = 20;
      enemiesRef.current.forEach(e => {
         if (!e.config.isBoss) {
           e.currentHealth = 0; // Will be destroyed in next update
         } else {
           e.currentHealth -= 10;
         }
      });
      AudioManager.play("explosion");
    }
  };

  const spawnEnemy = (type: keyof typeof ENEMY_CONFIGS, canvasWidth: number) => {
    const config = ENEMY_CONFIGS[type];
    
    // Generate word of appropriate length
    let word = "";
    // Extremely rudimentary constraint satisfaction, WordManager normally just gives random
    // In a real app, wordManager would be configured to return by length.
    // We will just fetch until we get a good one, with a max attempts fail-safe.
    for(let attempts = 0; attempts < 10; attempts++) {
       word = wordManagerRef.current.getRandomWord();
       if (word.length >= config.wordLengthMin && word.length <= config.wordLengthMax) break;
    }
    // Fallback if dictionary fails
    if (word.length < config.wordLengthMin || word.length > config.wordLengthMax) {
       word = wordManagerRef.current.getRandomWord();
    }
    
    const x = Math.max(config.radius + 10, Math.random() * (canvasWidth - config.radius * 2 - 20));
    const speedMultiplier = 1 + (waveRef.current * 0.05); // Waves get progressively faster
    
    const enemy = new Enemy(x, -50, word, speedMultiplier, type);
    enemiesRef.current.push(enemy);
    
    if (config.isBoss) {
      setBossHealth({current: enemy.currentHealth, max: enemy.maxHealth});
    }
  };

  // Update Loop
  const update = (dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Powerup Timer
    if (activePowerupRef.current && powerupTimerRef.current > 0) {
      powerupTimerRef.current -= dt;
      if (powerupTimerRef.current <= 0) {
        activePowerupRef.current = null;
        setActivePowerup(null);
        if (playerRef.current) playerRef.current.activePowerup = null;
      }
    }

    // Screen Shake Decay
    if (screenShakeRef.current > 0) {
      screenShakeRef.current = Math.max(0, screenShakeRef.current - dt * 0.05);
    }

    // Time Dilation
    let timeScale = 1.0;
    if (activePowerupRef.current === "slow_time") timeScale = 0.5;
    if (activePowerupRef.current === "freeze") timeScale = 0.1;
    
    const scaledDt = dt * timeScale;

    // Wave Management & Spawning
    if (waveTransitionTimerRef.current > 0) {
      waveTransitionTimerRef.current -= dt;
    } else {
      const timeSinceSpawn = performance.now() - lastSpawnRef.current;
      if (enemiesToSpawnRef.current.length > 0 && timeSinceSpawn > currentWaveConfigRef.current.spawnIntervalMs) {
        const nextEnemy = enemiesToSpawnRef.current.shift()!;
        spawnEnemy(nextEnemy.type, canvas.width);
        lastSpawnRef.current = performance.now();
      } else if (enemiesToSpawnRef.current.length === 0 && enemiesRef.current.length === 0) {
        // Wave Complete
        initWave(waveRef.current + 1);
        clearTarget();
      }
    }

    // Update Entities
    if (playerRef.current) {
      playerRef.current.x = canvas.width / 2;
      playerRef.current.y = canvas.height - 50;
      playerRef.current.update(dt); // Player updates in real time
    }
    
    enemiesRef.current.forEach(e => e.update(scaledDt));
    lasersRef.current.forEach(l => l.update(dt)); // Lasers move in real time
    powerupsRef.current.forEach(p => p.update(scaledDt));
    particleSystemRef.current.update(dt);

    // Collision Logic (Laser hitting Enemy or Powerup)
    const newLasers: Laser[] = [];
    lasersRef.current.forEach(laser => {
      let hit = false;
      
      // Check enemies
      const targetEnemy = enemiesRef.current.find(e => e.id === laser.targetId);
      if (targetEnemy) {
        const dist = Math.hypot(targetEnemy.x - laser.x, targetEnemy.y - laser.y);
        if (dist < targetEnemy.config.radius) {
          hit = true;
          targetEnemy.currentHealth--;
          
          if (targetEnemy.config.isBoss) {
            setBossHealth({current: Math.max(0, targetEnemy.currentHealth), max: targetEnemy.maxHealth});
          }
          
          if (targetEnemy.currentHealth <= 0) {
            targetEnemy.destroy();
            AudioManager.play("explosion");
            screenShakeRef.current = targetEnemy.config.isBoss ? 15 : 2;
            
            // Particles
            particleSystemRef.current.emit({
              x: targetEnemy.x,
              y: targetEnemy.y,
              color: isHeated ? "#f97316" : targetEnemy.config.color,
              size: targetEnemy.config.isBoss ? 8 : 4,
              speed: targetEnemy.config.isBoss ? 0.5 : 0.2,
              life: 1000,
              decay: 1,
              count: targetEnemy.config.isBoss ? 50 : (isHeated ? 25 : 15),
              isHeated: isHeated
            });

            // Score calculation
            let multiplier = Math.min(1 + Math.floor(combo / 5), 5);
            let finalPoints = targetEnemy.config.points * multiplier;
            if (isHeated) finalPoints *= 1.2;
            if (activePowerupRef.current === "double_score") finalPoints *= 2;
            
            scoreRef.current += finalPoints;
            setScore(scoreRef.current);
            
            // Powerup Drop Chance
            if (Math.random() < currentWaveConfigRef.current.powerupDropChance && !targetEnemy.config.isBoss) {
               // Pick random powerup based on weights
               const totalWeight = Object.values(POWERUP_CONFIGS).reduce((sum, p) => sum + p.dropWeight, 0);
               let rand = Math.random() * totalWeight;
               let selectedType: PowerupType = "rapid_fire";
               for (const p of Object.values(POWERUP_CONFIGS)) {
                 if (rand < p.dropWeight) {
                   selectedType = p.type;
                   break;
                 }
                 rand -= p.dropWeight;
               }
               // Get a very short word for powerup (1-3 chars)
               let pWord = wordManagerRef.current.getRandomWord().substring(0, 3);
               powerupsRef.current.push(new Powerup(targetEnemy.x, targetEnemy.y, selectedType, pWord));
            }
            
            // Splitter logic
            if (targetEnemy.type === "splitter") {
               // Spawn two scouts
               const scout1 = new Enemy(targetEnemy.x - 30, targetEnemy.y, wordManagerRef.current.getRandomWord().substring(0,4), 1.2, "scout");
               const scout2 = new Enemy(targetEnemy.x + 30, targetEnemy.y, wordManagerRef.current.getRandomWord().substring(0,4), 1.2, "scout");
               scout1.velocityY = Math.abs(targetEnemy.velocityY) * 1.5;
               scout2.velocityY = Math.abs(targetEnemy.velocityY) * 1.5;
               enemiesRef.current.push(scout1, scout2);
            }
            
            if (activeTargetIdRef.current === targetEnemy.id) clearTarget();
          }
        }
      }
      
      // Check Powerups if laser didn't hit enemy
      if (!hit) {
        const targetPowerup = powerupsRef.current.find(p => p.id === laser.targetId);
        if (targetPowerup) {
           const dist = Math.hypot(targetPowerup.x - laser.x, targetPowerup.y - laser.y);
           if (dist < 20) {
              hit = true;
              targetPowerup.destroy();
              activatePowerup(targetPowerup.type);
              AudioManager.play("type"); // specific sound later
              
              if (activeTargetIdRef.current === targetPowerup.id) clearTarget();
           }
        }
      }

      if (!hit) newLasers.push(laser);
    });
    lasersRef.current = newLasers;

    // Clean up dead entities
    enemiesRef.current = enemiesRef.current.filter(e => e.alive);
    powerupsRef.current = powerupsRef.current.filter(p => p.alive);

    // Bottom Collision (Enemy reached bottom)
    const passedEnemies = enemiesRef.current.filter(e => e.y > canvas.height);
    if (passedEnemies.length > 0) {
      passedEnemies.forEach(e => {
        if (activeTargetIdRef.current === e.id) clearTarget();
      });
      
      enemiesRef.current = enemiesRef.current.filter(e => e.y <= canvas.height);
      
      if (activePowerupRef.current === "shield") {
         // Shield absorbs damage, but deactivated
         activePowerupRef.current = null;
         setActivePowerup(null);
         if (playerRef.current) playerRef.current.activePowerup = null;
         powerupTimerRef.current = 0;
         screenShakeRef.current = 5;
         AudioManager.play("explosion");
      } else {
         livesRef.current -= passedEnemies.length;
         setLives(Math.max(0, livesRef.current));
         screenShakeRef.current = 10;
         AudioManager.play("wrong");
         
         if (livesRef.current <= 0) {
           handleGameOver();
         }
      }
    }
    
    // Clean up passed powerups
    powerupsRef.current = powerupsRef.current.filter(p => {
       if (p.y > canvas.height) {
         if (activeTargetIdRef.current === p.id) clearTarget();
         return false;
       }
       return true;
    });
  };

  // Render Loop
  const render = (ctx: CanvasRenderingContext2D) => {
    // Draw Space Background
    ctx.fillStyle = "#0f172a"; // slate-900
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw Starfield (parallax effect based on time scale)
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    const speedScale = activePowerupRef.current === "slow_time" ? 0.5 : (activePowerupRef.current === "freeze" ? 0.1 : 1.0);
    for(let i=0; i<100; i++) {
      const sx = (i * 137) % ctx.canvas.width;
      const sy = (i * 251 + (gameState === "PLAYING" ? performance.now() * 0.02 * speedScale : 0)) % ctx.canvas.height;
      ctx.fillRect(sx, sy, Math.random() > 0.8 ? 2 : 1, Math.random() > 0.8 ? 2 : 1);
    }

    ctx.save();
    
    // Apply Screen Shake
    if (screenShakeRef.current > 0) {
       const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
       const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
       ctx.translate(shakeX, shakeY);
    }

    // Entities
    particleSystemRef.current.render(ctx);
    lasersRef.current.forEach(l => l.render(ctx));
    powerupsRef.current.forEach(p => p.render(ctx));
    enemiesRef.current.forEach(e => e.render(ctx));
    if (playerRef.current) playerRef.current.render(ctx);
    
    ctx.restore();
  };

  return {
    canvasRef,
    gameState,
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
    initGame,
    setGameState
  };
}
