/**
 * RoadLayer
 * Renders the dark road band beneath the building row.
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { ROAD_Y_BOTTOM, ROAD_Y_TOP } from '../data/constants';

export class RoadLayer implements Layer {
  zIndex = 2;

  private patternCanvas: HTMLCanvasElement | null = null;
  private pattern: CanvasPattern | null = null;

  constructor() {
    if (typeof document === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = ROAD_Y_BOTTOM - ROAD_Y_TOP;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle speckle texture (deterministic)
    for (let x = 0; x < canvas.width; x += 4) {
      for (let y = 0; y < canvas.height; y += 4) {
        const seed = (x * 73856093) ^ (y * 19349663);
        const r = (seed >>> 0) % 100;
        if (r < 12) {
          ctx.fillStyle = r < 6 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.12)';
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    this.patternCanvas = canvas;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const roadHeight = ROAD_Y_BOTTOM - ROAD_Y_TOP;

    // Base band
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, ROAD_Y_TOP, ctx.canvas.width, roadHeight);

    // Bevel lines
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(0, ROAD_Y_TOP, ctx.canvas.width, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, ROAD_Y_BOTTOM - 1, ctx.canvas.width, 1);

    // Texture pattern (scrolls with camera)
    if (!this.pattern && this.patternCanvas) {
      this.pattern = ctx.createPattern(this.patternCanvas, 'repeat');
    }
    if (this.pattern && this.patternCanvas) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.translate(-(camera.x % this.patternCanvas.width), ROAD_Y_TOP);
      ctx.fillStyle = this.pattern;
      ctx.fillRect(0, 0, ctx.canvas.width + this.patternCanvas.width, roadHeight);
      ctx.restore();
    }
  }
}

