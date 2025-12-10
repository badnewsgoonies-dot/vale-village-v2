/**
 * InteriorFloorLayer
 * Renders wooden floor with subtle grid pattern for indoor scenes
 * Creates angled perspective illusion through gradient and pattern
 */

import type { Layer, Camera } from '../engine/types';

interface FloorConfig {
  woodColor: string;
  woodColorDark: string;
  gridColor: string;
  gridSize: number;
}

export class InteriorFloorLayer implements Layer {
  zIndex = 0;

  private config: FloorConfig = {
    woodColor: '#8B7355',
    woodColorDark: '#6B5344',
    gridColor: 'rgba(0, 0, 0, 0.1)',
    gridSize: 32,
  };

  private roomWidth: number = 320;
  private roomHeight: number = 240;
  private roomOffsetX: number = 320; // Center in 960px canvas
  private roomOffsetY: number = 200; // Position in canvas

  setRoomSize(width: number, height: number): void {
    this.roomWidth = width;
    this.roomHeight = height;
    // Center room in canvas
    this.roomOffsetX = (960 - width) / 2;
    this.roomOffsetY = (640 - height) / 2 + 50; // Slightly lower for ceiling space
  }

  render(ctx: CanvasRenderingContext2D, _camera: Camera): void {
    // Dark background (walls)
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw room walls (angled perspective)
    this.drawWalls(ctx);

    // Draw wooden floor
    this.drawFloor(ctx);

    // Draw floor grid
    this.drawGrid(ctx);
  }

  private drawWalls(ctx: CanvasRenderingContext2D): void {
    const x = this.roomOffsetX;
    const y = this.roomOffsetY;
    const w = this.roomWidth;
    const h = this.roomHeight;

    // Back wall
    const wallGradient = ctx.createLinearGradient(x, y - 80, x, y);
    wallGradient.addColorStop(0, '#4a4a5a');
    wallGradient.addColorStop(1, '#3a3a4a');

    ctx.fillStyle = wallGradient;
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 80);
    ctx.lineTo(x + w + 20, y - 80);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();

    // Left wall (perspective)
    const leftWallGradient = ctx.createLinearGradient(x - 60, y, x, y);
    leftWallGradient.addColorStop(0, '#2a2a3a');
    leftWallGradient.addColorStop(1, '#3a3a4a');

    ctx.fillStyle = leftWallGradient;
    ctx.beginPath();
    ctx.moveTo(x - 60, y - 40);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x - 60, y + h + 40);
    ctx.closePath();
    ctx.fill();

    // Right wall (perspective)
    const rightWallGradient = ctx.createLinearGradient(x + w, y, x + w + 60, y);
    rightWallGradient.addColorStop(0, '#3a3a4a');
    rightWallGradient.addColorStop(1, '#2a2a3a');

    ctx.fillStyle = rightWallGradient;
    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w + 60, y - 40);
    ctx.lineTo(x + w + 60, y + h + 40);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();

    // Wall trim/baseboard
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(x, y + h - 8, w, 8);
  }

  private drawFloor(ctx: CanvasRenderingContext2D): void {
    const x = this.roomOffsetX;
    const y = this.roomOffsetY;
    const w = this.roomWidth;
    const h = this.roomHeight;

    // Create wood plank pattern
    const plankHeight = 24;
    const plankCount = Math.ceil(h / plankHeight);

    for (let i = 0; i < plankCount; i++) {
      const plankY = y + i * plankHeight;
      const isEvenRow = i % 2 === 0;

      // Alternating plank colors for wood grain effect
      const baseColor = isEvenRow ? this.config.woodColor : this.config.woodColorDark;

      // Gradient for depth (planks closer = darker)
      const depthFactor = i / plankCount;
      const gradient = ctx.createLinearGradient(x, plankY, x, plankY + plankHeight);
      gradient.addColorStop(0, this.adjustBrightness(baseColor, 1 - depthFactor * 0.2));
      gradient.addColorStop(1, this.adjustBrightness(baseColor, 0.9 - depthFactor * 0.2));

      ctx.fillStyle = gradient;
      ctx.fillRect(x, plankY, w, plankHeight);

      // Plank gap line
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, plankY + plankHeight);
      ctx.lineTo(x + w, plankY + plankHeight);
      ctx.stroke();

      // Vertical gaps for plank segments (offset alternating rows)
      const segmentWidth = 80;
      const offset = isEvenRow ? 0 : segmentWidth / 2;

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      for (let sx = offset; sx < w; sx += segmentWidth) {
        ctx.beginPath();
        ctx.moveTo(x + sx, plankY);
        ctx.lineTo(x + sx, plankY + plankHeight);
        ctx.stroke();
      }
    }

    // Floor edge shadow (depth illusion)
    const shadowGradient = ctx.createLinearGradient(x, y, x, y + 30);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGradient;
    ctx.fillRect(x, y, w, 30);
  }

  private drawGrid(ctx: CanvasRenderingContext2D): void {
    const x = this.roomOffsetX;
    const y = this.roomOffsetY;
    const w = this.roomWidth;
    const h = this.roomHeight;
    const gridSize = this.config.gridSize;

    ctx.strokeStyle = this.config.gridColor;
    ctx.lineWidth = 1;

    // Subtle grid overlay (for alignment, barely visible)
    ctx.globalAlpha = 0.3;

    // Vertical lines
    for (let gx = gridSize; gx < w; gx += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x + gx, y);
      ctx.lineTo(x + gx, y + h);
      ctx.stroke();
    }

    // Horizontal lines
    for (let gy = gridSize; gy < h; gy += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, y + gy);
      ctx.lineTo(x + w, y + gy);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  private adjustBrightness(hex: string, factor: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const nr = Math.round(Math.min(255, r * factor));
    const ng = Math.round(Math.min(255, g * factor));
    const nb = Math.round(Math.min(255, b * factor));

    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  }

  getRoomBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.roomOffsetX,
      y: this.roomOffsetY,
      width: this.roomWidth,
      height: this.roomHeight,
    };
  }
}
