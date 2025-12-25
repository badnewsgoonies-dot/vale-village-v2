/**
 * TerrainLayer
 * Renders the overworld ground band (grass) beneath the mountains.
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { SKY_HEIGHT } from '../data/constants';

export class TerrainLayer implements Layer {
  zIndex = 1.5;

  private patternCanvas: HTMLCanvasElement | null = null;
  private pattern: CanvasPattern | null = null;

  constructor() {
    if (typeof document === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#2f6a2f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grass noise (deterministic).
    for (let x = 0; x < canvas.width; x += 4) {
      for (let y = 0; y < canvas.height; y += 4) {
        const seed = (x * 73856093) ^ (y * 19349663);
        const r = (seed >>> 0) % 100;
        if (r < 14) {
          ctx.fillStyle = r < 7 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.08)';
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    this.patternCanvas = canvas;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const top = SKY_HEIGHT;
    const height = ctx.canvas.height - top;

    const gradient = ctx.createLinearGradient(0, top, 0, top + height);
    gradient.addColorStop(0, '#2f6a2f');
    gradient.addColorStop(1, '#1f4522');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, top, ctx.canvas.width, height);

    if (!this.pattern && this.patternCanvas) {
      this.pattern = ctx.createPattern(this.patternCanvas, 'repeat');
    }
    if (this.pattern && this.patternCanvas) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      const snappedCameraX = Math.round(camera.x);
      ctx.translate(-(snappedCameraX % this.patternCanvas.width), top);
      ctx.fillStyle = this.pattern;
      ctx.fillRect(0, 0, ctx.canvas.width + this.patternCanvas.width, height);
      ctx.restore();
    }
  }
}
