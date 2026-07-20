import { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../../engine/hooks/useGame';
import { useTypingEngine } from '../../engine/typing/TypingEngine';
import { WordManager } from '../../engine/typing/WordManager';
import { ParticleSystem } from '../../engine/effects/ParticleSystem';
import { AudioManager } from '../../engine/audio/AudioManager';
import { PlayerCar } from '../entities/PlayerCar';
import { AICar } from '../entities/AICar';
import { TrackManager } from '../entities/TrackManager';
import { RACE_MODES, RaceMode } from '../config/raceConfig';
import { TRACK_THEMES } from '../config/trackConfig';
import { AI_PROFILES, PLAYER_CAR_CONFIG } from '../config/carConfig';

const DICTIONARY = [
  "accelerate", "velocity", "drift", "engine", "exhaust", "turbo", 
  "asphalt", "circuit", "momentum", "nitro", "gearbox", "steering", 
  "transmission", "speed", "corner", "brake", "clutch", "suspension",
  "dashboard", "tire", "rim", "spoiler", "aerodynamics", "horsepower"
];

export function useTypeRaceGame() {
  const [raceMode, setRaceMode] = useState<RaceMode>('sprint');
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const [currentTyped, setCurrentTyped] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [playerSpeed, setPlayerSpeed] = useState(0);
  const [position, setPosition] = useState(1);
  const [nitroPercent, setNitroPercent] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [highestSpeed, setHighestSpeed] = useState(0);

  const { registerKeystroke, startSession, endSession, combo, wpm, accuracy, longestCombo, reset: resetTyping } = useTypingEngine();
  
  const isHeated = wpm > 60 && accuracy > 95;

  // Engine refs
  const wordManagerRef = useRef(new WordManager(DICTIONARY));
  const particleSystemRef = useRef(new ParticleSystem());
  const trackManagerRef = useRef<TrackManager | null>(null);
  const playerRef = useRef<PlayerCar | null>(null);
  const aiCarsRef = useRef<AICar[]>([]);
  
  const timeRemainingRef = useRef(0);
  const totalRacersRef = useRef(1);
  const mistakeInCurrentWordRef = useRef(false);
  const totalSpeedSumRef = useRef(0);
  const speedSamplesRef = useRef(0);

  const { canvasRef, gameState, setGameState, startGame, stopGame } = useGame(
    (dt) => update(dt),
    (ctx) => render(ctx)
  );

  const initGame = useCallback((mode: RaceMode) => {
    setRaceMode(mode);
    const config = RACE_MODES[mode];
    
    setTimeRemaining(config.durationSeconds * 1000);
    timeRemainingRef.current = config.durationSeconds * 1000;
    
    setCurrentTyped("");
    setTargetWord(wordManagerRef.current.getRandomWord());
    setPlayerSpeed(0);
    setPosition(1);
    setNitroPercent(0);
    setAverageSpeed(0);
    setHighestSpeed(0);
    
    totalSpeedSumRef.current = 0;
    speedSamplesRef.current = 0;
    mistakeInCurrentWordRef.current = false;
    
    totalRacersRef.current = config.aiOpponentCount + 1; // +1 for player
    
    // Initialize Entities
    trackManagerRef.current = new TrackManager(TRACK_THEMES['cyber']); // Hardcoded theme for now
    playerRef.current = new PlayerCar();
    
    aiCarsRef.current = [];
    for (let i = 0; i < config.aiOpponentCount; i++) {
      const profile = AI_PROFILES[i % AI_PROFILES.length];
      const lane = i % 2 === 0 ? -1 : 1; // Distributed in left/right lanes
      aiCarsRef.current.push(new AICar(lane, profile));
    }
    
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
        setCurrentTyped(prev => prev.slice(0, -1));
        return;
      }

      if (e.key.length !== 1) return;
      if (e.key === " ") e.preventDefault();

      const char = e.key.toLowerCase();
      const expectedChar = targetWord[currentTyped.length];
      
      if (char === expectedChar) {
        const newTyped = currentTyped + char;
        setCurrentTyped(newTyped);
        registerKeystroke(true);
        AudioManager.play("type");

        // Player typed a correct character, small speed boost based on combo
        if (playerRef.current) {
          const comboBoost = Math.min(combo * 0.05, 1.0);
          playerRef.current.speed += 0.05 + comboBoost;
        }

        // Word complete
        if (newTyped === targetWord) {
          if (!mistakeInCurrentWordRef.current && playerRef.current) {
            playerRef.current.addNitro(20); // Perfect word nitro
            if (playerRef.current.nitroMeter >= 100) {
              playerRef.current.activateNitro();
              AudioManager.play("type"); // placeholder for nitro sound
            }
          }
          setTargetWord(wordManagerRef.current.getRandomWord());
          setCurrentTyped("");
          mistakeInCurrentWordRef.current = false;
        }
      } else {
        registerKeystroke(false);
        AudioManager.play("wrong");
        mistakeInCurrentWordRef.current = true;
        
        // Mistake penalty
        if (playerRef.current) {
          playerRef.current.speed *= 0.5; // Heavy speed penalty
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, targetWord, currentTyped, registerKeystroke, combo]);

  const update = (dt: number) => {
    if (timeRemainingRef.current <= 0) {
      handleGameOver();
      return;
    }

    timeRemainingRef.current -= dt;
    setTimeRemaining(Math.max(0, timeRemainingRef.current));

    if (!playerRef.current || !canvasRef.current) return;

    // Base speed decay for player
    let baseTargetSpeed = wpm * PLAYER_CAR_CONFIG.wpmToSpeedMultiplier;
    if (playerRef.current.isNitroActive) {
      baseTargetSpeed *= PLAYER_CAR_CONFIG.nitroBoostMultiplier;
    }
    if (isHeated) {
      baseTargetSpeed *= 1.2;
    }
    
    // Smooth speed transition
    playerRef.current.speed += (baseTargetSpeed - playerRef.current.speed) * (dt / 1000) * 2;
    playerRef.current.speed = Math.max(0, playerRef.current.speed); // prevent negative

    playerRef.current.update(dt);
    
    const currentSpd = playerRef.current.speed;
    setPlayerSpeed(currentSpd);
    setNitroPercent(playerRef.current.nitroMeter);

    // Track highest/average speed
    setHighestSpeed(prev => Math.max(prev, currentSpd));
    totalSpeedSumRef.current += currentSpd;
    speedSamplesRef.current++;
    setAverageSpeed(totalSpeedSumRef.current / speedSamplesRef.current);

    // Update track scrolling
    if (trackManagerRef.current) {
      trackManagerRef.current.setScrollSpeed(currentSpd, dt);
    }

    // Update AI
    let myPos = 1;
    aiCarsRef.current.forEach(ai => {
      ai.update(dt);
      
      // If AI has traveled further, we are in a worse position
      if (ai.distanceTraveled > playerRef.current!.distanceTraveled) {
        myPos++;
      }
    });
    setPosition(myPos);

    particleSystemRef.current.update(dt);
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Render Track
    if (trackManagerRef.current) {
      trackManagerRef.current.render(ctx);
    }

    const playerDist = playerRef.current?.distanceTraveled || 0;
    const laneWidth = width * 0.2; // 20% of screen per lane roughly
    const centerX = width / 2;

    // Render AI Cars
    aiCarsRef.current.forEach(ai => {
      const relativeDist = ai.distanceTraveled - playerDist;
      
      // 1 unit of distance = 50 pixels on screen
      const screenY = height * 0.7 - (relativeDist * 50); 
      
      // Only render if roughly on screen
      if (screenY > -200 && screenY < height + 200) {
        ai.x = centerX + (ai.lane * laneWidth);
        ai.y = screenY;
        ai.render(ctx);
      }
    });

    // Render Player (always fixed near bottom)
    if (playerRef.current) {
      playerRef.current.x = centerX;
      playerRef.current.y = height * 0.7;
      playerRef.current.render(ctx);
    }

    particleSystemRef.current.render(ctx);
  };

  return {
    canvasRef,
    gameState,
    setGameState,
    initGame,
    raceMode,
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
    totalRacers: totalRacersRef.current
  };
}
