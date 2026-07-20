import { Entity } from "../entities/Entity";
import { useGameSettings } from '../store/useGameSettings';

export interface ParticleOptions {
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  angle: number;
  life: number;
  decay: number;
  isHeated?: boolean;
}

export class Particle extends Entity {
  public color: string = "#fff";
  public life: number = 0;
  public decay: number = 0;
  public initialLife: number = 0;
  public isHeated: boolean = false;

  constructor() {
    // Initialize with dummy values, will be reset by pool
    super(0, 0, 1, 1);
  }

  public init(options: ParticleOptions) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.size;
    this.height = options.size;
    this.color = options.color;
    this.life = options.life;
    this.initialLife = options.life;
    this.decay = options.decay;
    this.isHeated = options.isHeated || false;
    
    this.velocityX = Math.cos(options.angle) * options.speed;
    this.velocityY = Math.sin(options.angle) * options.speed;
    
    this.alive = true;
    this.visible = true;
  }

  public override update(deltaTime: number): void {
    if (!this.alive) return;
    super.update(deltaTime);
    this.life -= this.decay * deltaTime;
    if (this.life <= 0) {
      this.alive = false; // Mark dead for pool recycling
    }
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive || !this.visible) return;
    
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.initialLife);
    
    // Draw Heat glow
    if (this.isHeated) {
      ctx.fillStyle = "rgba(249, 115, 22, 0.4)"; // orange-500 with opacity
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private pool: Particle[] = [];
  private static MAX_PARTICLES = 1000;

  constructor() {
    // Pre-allocate pool
    for (let i = 0; i < 200; i++) {
      this.pool.push(new Particle());
    }
  }

  public emit(options: Omit<ParticleOptions, 'angle'> & { count: number }) {
    const settings = useGameSettings.getState();
    if (settings.reducedMotion) return;

    let multiplier = 1;
    switch (settings.quality) {
      case 'low': multiplier = 0.25; break;
      case 'medium': multiplier = 0.5; break;
      case 'high': multiplier = 1; break;
      case 'ultra': multiplier = 1.5; break;
    }

    const finalCount = Math.max(1, Math.floor(options.count * multiplier));

    for (let i = 0; i < finalCount; i++) {
      // Hard cap to prevent memory leaks
      if (this.particles.length >= ParticleSystem.MAX_PARTICLES) return;

      const angle = Math.random() * Math.PI * 2;
      const pOptions = { ...options, angle };

      let p = this.pool.pop();
      if (!p) {
        p = new Particle();
      }
      
      p.init(pOptions);
      this.particles.push(p);
    }
  }

  public update(deltaTime: number) {
    let aliveCount = 0;
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.update(deltaTime);
      
      if (p.alive) {
        // Keep alive particles at the front of the array
        this.particles[aliveCount] = p;
        aliveCount++;
      } else {
        // Return dead particle to pool
        this.pool.push(p);
      }
    }
    
    // Trim the array to only contain alive particles
    this.particles.length = aliveCount;
  }

  public render(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].render(ctx);
    }
  }
}
