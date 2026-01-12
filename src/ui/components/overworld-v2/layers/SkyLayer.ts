/**
 * SkyLayer
 * Renders sky gradient, clouds, and celestial bodies (sun/moon)
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { lerp } from '../engine/math';
import { SKY_HEIGHT, CLOUD_COUNT } from '../data/constants';

interface SkyColors {
  top: string;
  bottom: string;
}

// Time-of-day color palette
const SKY_COLORS: Array<{ t: number; top: string; bottom: string }> = [
  { t: 0.00, top: '#0a0a1a', bottom: '#1a1a2a' }, // Midnight
  { t: 0.20, top: '#1a1a2a', bottom: '#2a2a3a' }, // Late night
  { t: 0.25, top: '#2a2040', bottom: '#4a3050' }, // Pre-dawn
  { t: 0.30, top: '#6a4060', bottom: '#e8a050' }, // Dawn
  { t: 0.35, top: '#7090b0', bottom: '#c0a890' }, // Early morning
  { t: 0.45, top: '#5a8aa8', bottom: '#8ab8d0' }, // Morning
  { t: 0.50, top: '#5090c0', bottom: '#90c8e8' }, // Noon
  { t: 0.60, top: '#5a8aa8', bottom: '#8ab8d0' }, // Afternoon
  { t: 0.70, top: '#c07050', bottom: '#e89040' }, // Late afternoon
  { t: 0.75, top: '#d85050', bottom: '#e8a060' }, // Dusk
  { t: 0.80, top: '#4a3050', bottom: '#2a2040' }, // Evening
  { t: 0.85, top: '#1a1a2a', bottom: '#2a2a3a' }, // Night
  { t: 1.00, top: '#0a0a1a', bottom: '#1a1a2a' }, // Midnight
];

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
}

export class SkyLayer implements Layer {
  zIndex = 0;

  private timeOfDay: number = 0.5; // 0=midnight, 0.5=noon
  private clouds: Cloud[] = [];
  private cloudOffset: number = 0;
  private skyHeight: number = SKY_HEIGHT; // Height of sky area (4/10 of 640px)

  /** Cached sky gradient colors */
  private cachedColors: SkyColors = { top: '#5090c0', bottom: '#90c8e8' };
  /** Dirty flag - true when time of day changes require gradient recalculation */
  private skyDirty: boolean = true;

  constructor() {
    this.initClouds();
  }

  private initClouds(): void {
    // Generate random clouds
    for (let i = 0; i < CLOUD_COUNT; i++) {
      this.clouds.push({
        x: Math.random() * 960,
        y: 30 + Math.random() * 150,
        width: 80 + Math.random() * 120,
        height: 30 + Math.random() * 40,
        speed: 0.01 + Math.random() * 0.02,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
  }

  setTimeOfDay(time: number): void {
    const newTime = time % 1;
    if (newTime !== this.timeOfDay) {
      this.timeOfDay = newTime;
      this.skyDirty = true; // Mark gradient for recalculation
    }
  }

  update(dtMs: number): void {
    // Animate clouds
    this.cloudOffset += dtMs * 0.01;

    for (const cloud of this.clouds) {
      cloud.x += cloud.speed * dtMs;
      if (cloud.x > 960 + cloud.width) {
        cloud.x = -cloud.width;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, _camera: Camera): void {
    const width = ctx.canvas.width;

    // Only recalculate sky colors when time of day changes
    if (this.skyDirty) {
      this.cachedColors = this.getSkyColors();
      this.skyDirty = false;
    }

    // Draw sky gradient using cached colors
    const gradient = ctx.createLinearGradient(0, 0, 0, this.skyHeight);
    gradient.addColorStop(0, this.cachedColors.top);
    gradient.addColorStop(1, this.cachedColors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, this.skyHeight);

    // Draw celestial body (sun or moon)
    this.drawCelestialBody(ctx);

    // Draw stars at night
    if (this.isNight()) {
      this.drawStars(ctx);
    }

    // Draw clouds
    this.drawClouds(ctx);
  }

  private getSkyColors(): SkyColors {
    const t = this.timeOfDay;

    if (SKY_COLORS.length < 2) {
      return { top: '#0a0a1a', bottom: '#1a1a2a' };
    }

    // Find bracketing colors
    let lower = SKY_COLORS[0]!;
    let upper = SKY_COLORS[1]!;

    for (let i = 0; i < SKY_COLORS.length - 1; i++) {
      const current = SKY_COLORS[i]!;
      const next = SKY_COLORS[i + 1]!;

      if (t >= current.t && t <= next.t) {
        lower = current;
        upper = next;
        break;
      }
    }

    const range = upper.t - lower.t;
    const progress = range > 0 ? (t - lower.t) / range : 0;

    return {
      top: this.lerpColor(lower.top, upper.top, progress),
      bottom: this.lerpColor(lower.bottom, upper.bottom, progress),
    };
  }

  private lerpColor(color1: string, color2: string, t: number): string {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(lerp(r1, r2, t));
    const g = Math.round(lerp(g1, g2, t));
    const b = Math.round(lerp(b1, b2, t));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private isNight(): boolean {
    return this.timeOfDay < 0.25 || this.timeOfDay > 0.80;
  }

  private isDay(): boolean {
    return this.timeOfDay > 0.30 && this.timeOfDay < 0.75;
  }

  private drawCelestialBody(ctx: CanvasRenderingContext2D): void {
    // Calculate position based on time (arc across sky)
    const dayProgress = ((this.timeOfDay - 0.25) / 0.5 + 1) % 1;
    const angle = Math.PI * dayProgress;
    const centerX = ctx.canvas.width / 2;
    const radius = 200;

    const x = centerX + Math.cos(angle + Math.PI) * radius * 1.5;
    const y = this.skyHeight - 50 - Math.sin(angle) * 150;

    if (this.isDay()) {
      // Sun
      ctx.save();

      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 60);
      glowGradient.addColorStop(0, 'rgba(255, 255, 200, 0.6)');
      glowGradient.addColorStop(0.5, 'rgba(255, 220, 100, 0.3)');
      glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, 60, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fffacd';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    } else if (this.isNight()) {
      // Moon
      ctx.save();

      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
      glowGradient.addColorStop(0, 'rgba(200, 220, 255, 0.4)');
      glowGradient.addColorStop(1, 'rgba(180, 200, 255, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e8e8f0';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(180, 180, 190, 0.3)';
      ctx.beginPath();
      ctx.arc(x - 4, y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 5, y + 4, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  private drawStars(ctx: CanvasRenderingContext2D): void {
    const starPositions = [
      { x: 50, y: 30 }, { x: 150, y: 80 }, { x: 280, y: 45 },
      { x: 320, y: 120 }, { x: 450, y: 35 }, { x: 520, y: 90 },
      { x: 610, y: 55 }, { x: 700, y: 100 }, { x: 780, y: 40 },
      { x: 850, y: 85 }, { x: 100, y: 150 }, { x: 380, y: 160 },
      { x: 560, y: 140 }, { x: 720, y: 170 }, { x: 900, y: 130 },
      { x: 200, y: 200 }, { x: 420, y: 190 }, { x: 650, y: 210 },
    ];

    // Star visibility (fade in/out during dusk/dawn)
    let alpha = 1;
    if (this.timeOfDay > 0.20 && this.timeOfDay < 0.30) {
      alpha = 1 - (this.timeOfDay - 0.20) / 0.10;
    } else if (this.timeOfDay > 0.75 && this.timeOfDay < 0.85) {
      alpha = (this.timeOfDay - 0.75) / 0.10;
    } else if (this.timeOfDay >= 0.30 && this.timeOfDay <= 0.75) {
      alpha = 0;
    }

    if (alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = alpha * 0.8;

    for (let i = 0; i < starPositions.length; i++) {
      const star = starPositions[i]!;
      const twinkle = 0.5 + Math.sin(Date.now() * 0.003 + i * 1.7) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 1 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawClouds(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Cloud color based on time of day
    let cloudColor = 'rgba(255, 255, 255, ';
    if (this.timeOfDay < 0.30 || this.timeOfDay > 0.75) {
      cloudColor = 'rgba(200, 180, 220, ';
    } else if (this.timeOfDay > 0.70 && this.timeOfDay <= 0.75) {
      cloudColor = 'rgba(255, 180, 150, ';
    }

    for (const cloud of this.clouds) {
      ctx.globalAlpha = cloud.opacity;

      const gradient = ctx.createRadialGradient(
        cloud.x + cloud.width / 2,
        cloud.y + cloud.height / 2,
        0,
        cloud.x + cloud.width / 2,
        cloud.y + cloud.height / 2,
        cloud.width / 2
      );
      gradient.addColorStop(0, cloudColor + '0.6)');
      gradient.addColorStop(0.7, cloudColor + '0.3)');
      gradient.addColorStop(1, cloudColor + '0)');

      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.ellipse(
        cloud.x + cloud.width * 0.3,
        cloud.y + cloud.height * 0.5,
        cloud.width * 0.25,
        cloud.height * 0.4,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(
        cloud.x + cloud.width * 0.5,
        cloud.y + cloud.height * 0.4,
        cloud.width * 0.3,
        cloud.height * 0.45,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(
        cloud.x + cloud.width * 0.7,
        cloud.y + cloud.height * 0.5,
        cloud.width * 0.25,
        cloud.height * 0.4,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }
}

