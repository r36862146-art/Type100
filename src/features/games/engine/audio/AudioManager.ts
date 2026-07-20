import { Howl, Howler } from 'howler';
import { useGameSettings } from '../store/useGameSettings';

export type SoundEffect = "type" | "correct" | "wrong" | "explosion" | "win" | "lose";

class AudioSystem {
  private sounds: Map<SoundEffect, Howl> = new Map();
  private lastPlayed: Map<SoundEffect, number> = new Map();
  private maxConcurrency = 3; // Prevent sound clipping on rapid typing

  constructor() {
    // We would normally load real assets here
    // Example: this.sounds.set("type", new Howl({ src: ['/sounds/type.mp3'] }));
  }

  public init() {
    // Load default sounds
  }

  public play(effect: SoundEffect, isMusic: boolean = false) {
    const settings = useGameSettings.getState();
    const masterVol = settings.masterVolume;
    const categoryVol = isMusic ? settings.musicVolume : settings.sfxVolume;
    
    const finalVolume = masterVol * categoryVol;
    if (finalVolume <= 0) return;

    // Rate limiting logic for rapid sounds like "type"
    const now = performance.now();
    const lastTime = this.lastPlayed.get(effect) || 0;
    
    if (effect === "type" && now - lastTime < 30) {
        return; // Skip if triggered less than 30ms ago
    }

    const sound = this.sounds.get(effect);
    if (sound) {
      sound.volume(finalVolume);
      sound.play();
      this.lastPlayed.set(effect, now);
    }
  }

  // Legacy compatibility methods
  public setMute(muted: boolean) {
    if (muted) {
        useGameSettings.getState().setMasterVolume(0);
    } else {
        useGameSettings.getState().setMasterVolume(1);
    }
  }

  public setVolume(volume: number) {
    useGameSettings.getState().setMasterVolume(volume);
  }

  public isMuted() {
    return useGameSettings.getState().masterVolume === 0;
  }
}

export const AudioManager = new AudioSystem();
