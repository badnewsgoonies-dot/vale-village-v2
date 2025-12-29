/**
 * TerrainLayer
 * Renders the overworld ground band (grass) beneath the mountains.
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { SKY_HEIGHT } from '../data/constants';

export class TerrainLayer implements Layer {
  // Above background, below road/entities.
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

    // Base grass color - made greener (less blue) to read as clearly green in the scene.
    ctx.fillStyle = '#3cbf48';
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

    // Small pixel-art shrubs/bushes added into the repeating pattern to give foreground detail.
    // Shapes are small clusters of pixels with two-tone greens and a darker base to read as bushes.
    const shrubColors = ['#2b8e2b', '#4bb84b', '#154e18'];
    const shrubPositions = [
      { x: 6, y: 44 },
      { x: 30, y: 50 },
      { x: 50, y: 46 },
      { x: 18, y: 36 },
    ];

    for (const pos of shrubPositions) {
      // darker base
      ctx.fillStyle = shrubColors[2];
      ctx.fillRect(pos.x + 1, pos.y + 2, 4, 2);
      // main volume
      ctx.fillStyle = shrubColors[0];
      ctx.fillRect(pos.x, pos.y, 6, 3);
      // highlights
      ctx.fillStyle = shrubColors[1];
      ctx.fillRect(pos.x + 1, pos.y + 1, 2, 1);
      ctx.fillRect(pos.x + 3, pos.y + 1, 2, 1);
      // a few stray pixels for texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(pos.x + 2, pos.y + 3, 1, 1);
    }

    this.patternCanvas = canvas;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const top = SKY_HEIGHT;
    const height = ctx.canvas.height - top;

    const gradient = ctx.createLinearGradient(0, top, 0, top + height);
    // Use greener gradient stops so the band reads as green on a variety of displays.
    gradient.addColorStop(0, '#3cbf48');
    gradient.addColorStop(1, '#1f6a1b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, top, ctx.canvas.width, height);

    if (!this.pattern && this.patternCanvas) {
      this.pattern = ctx.createPattern(this.patternCanvas, 'repeat');
    }
    if (this.pattern && this.patternCanvas) {
      ctx.save();
      // Slightly stronger pattern alpha to make shrubs/bushes more visible without hiding entities above.
      ctx.globalAlpha = 0.45;
      const snappedCameraX = Math.round(camera.x);
      ctx.translate(-(snappedCameraX % this.patternCanvas.width), top);
      ctx.fillStyle = this.pattern;
      ctx.fillRect(0, 0, ctx.canvas.width + this.patternCanvas.width, height);
      ctx.restore();
    }
  }
}
