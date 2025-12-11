/**
 * TerrainLayer
 * Renders ground bands, grass texture, paths, and water
 */

import type { Layer, Camera } from '../engine/types';
import type { GameMap } from '../../../../data/schemas/mapSchema';

interface TerrainBand {
  y: number;
  height: number;
  hue: number;
  saturation: number;
  lightness: number;
}

export class TerrainLayer implements Layer {
  zIndex = 1; // In front of background (was 2, swapped to fix rendering order)

  private bands: TerrainBand[] = [];
  private mapData: GameMap | null = null;
  private timeOfDay: number = 0.5;
  private tileSize: number = 32;

  constructor(startY: number = 300, canvasHeight: number = 640) {
    this.initBands(startY, canvasHeight);
  }

  private initBands(startY: number, canvasHeight: number): void {
    const bandHeight = (canvasHeight - startY) / 4;

    this.bands = [
      { y: startY, height: bandHeight, hue: 120, saturation: 35, lightness: 45 },
      { y: startY + bandHeight, height: bandHeight, hue: 115, saturation: 32, lightness: 40 },
      { y: startY + bandHeight * 2, height: bandHeight, hue: 110, saturation: 28, lightness: 35 },
      { y: startY + bandHeight * 3, height: bandHeight, hue: 105, saturation: 25, lightness: 30 },
    ];
  }

  setMap(map: GameMap): void {
    this.mapData = map;
  }

  setTimeOfDay(time: number): void {
    this.timeOfDay = time;
  }

  setTileSize(size: number): void {
    this.tileSize = size;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    // Draw terrain bands
    this.drawBands(ctx);

    // Draw grass texture
    this.drawGrassTexture(ctx, camera);

    // Draw paths from map data
    if (this.mapData) {
      this.drawPaths(ctx, camera);
      this.drawWater(ctx, camera);
    }
  }

  private drawBands(ctx: CanvasRenderingContext2D): void {
    if (!this.bands.length) return;

    const isNight = this.timeOfDay < 0.25 || this.timeOfDay > 0.80;
    const lightMod = isNight ? 0.5 : 1;

    for (const band of this.bands) {
      const adjustedLightness = band.lightness * lightMod;
      ctx.fillStyle = `hsl(${band.hue}, ${band.saturation}%, ${adjustedLightness}%)`;
      ctx.fillRect(0, band.y, ctx.canvas.width, band.height + 1); // +1 to prevent gaps
    }

    // Add subtle gradient overlay for depth
    const firstBandY = this.bands[0]?.y ?? 0;
    const gradient = ctx.createLinearGradient(0, firstBandY, 0, ctx.canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, firstBandY, ctx.canvas.width, ctx.canvas.height - firstBandY);
  }

  private drawGrassTexture(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.bands.length) return;
    // Draw subtle grass blades across terrain
    const offset = camera.getParallaxOffset(0.8);
    const startY = this.bands[0]?.y ?? 0;

    ctx.save();

    const isNight = this.timeOfDay < 0.25 || this.timeOfDay > 0.80;
    const grassColor = isNight ? 'rgba(30, 60, 30, 0.3)' : 'rgba(60, 100, 60, 0.3)';

    // Use a deterministic pattern based on position
    for (let screenX = 0; screenX < ctx.canvas.width; screenX += 8) {
      const worldX = screenX - offset.x * 0.2;

      for (let screenY = startY + 10; screenY < ctx.canvas.height; screenY += 12) {
        // Pseudo-random based on position
        const seed = Math.sin(worldX * 0.1 + screenY * 0.05) * 10000;
        const variation = seed - Math.floor(seed);

        if (variation > 0.6) {
          const bladeHeight = 4 + variation * 6;
          const lean = Math.sin(worldX * 0.02 + Date.now() * 0.0005) * 2;

          ctx.strokeStyle = grassColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.quadraticCurveTo(
            screenX + lean,
            screenY - bladeHeight / 2,
            screenX + lean * 1.5,
            screenY - bladeHeight
          );
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  private drawPaths(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.mapData) return;

    const bounds = camera.getVisibleBounds();
    const startTileX = Math.max(0, Math.floor(bounds.left / this.tileSize));
    const endTileX = Math.min(this.mapData.width, Math.ceil(bounds.right / this.tileSize));
    const startTileY = Math.max(0, Math.floor(bounds.top / this.tileSize));
    const endTileY = Math.min(this.mapData.height, Math.ceil(bounds.bottom / this.tileSize));

    const isNight = this.timeOfDay < 0.25 || this.timeOfDay > 0.80;

    for (let tileY = startTileY; tileY < endTileY; tileY++) {
      const row = this.mapData.tiles[tileY];
      if (!row) continue;

      for (let tileX = startTileX; tileX < endTileX; tileX++) {
        const tile = row[tileX];
        if (!tile) continue;

        if (tile.type === 'path') {
          const worldX = tileX * this.tileSize;
          const worldY = tileY * this.tileSize;
          const screenPos = camera.worldToScreen(worldX, worldY);

          // Path base color
          ctx.fillStyle = isNight ? '#3a3530' : '#c4a882';
          ctx.fillRect(screenPos.x, screenPos.y, this.tileSize, this.tileSize);

          // Path texture (subtle stone pattern)
          this.drawPathTexture(ctx, screenPos.x, screenPos.y, tileX + tileY * 100);
        }
      }
    }
  }

  private drawPathTexture(ctx: CanvasRenderingContext2D, x: number, y: number, seed: number): void {
    ctx.save();

    // Subtle stone/dirt pattern
    const stoneCount = 3 + (seed % 3);
    for (let i = 0; i < stoneCount; i++) {
      const stoneSeed = Math.sin(seed * (i + 1) * 0.1) * 10000;
      const variation = stoneSeed - Math.floor(stoneSeed);

      const stoneX = x + variation * 24 + 4;
      const stoneY = y + ((stoneSeed * 7) % 24) + 4;
      const stoneSize = 4 + (variation * 6);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.ellipse(stoneX, stoneY, stoneSize, stoneSize * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawWater(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.mapData) return;

    const bounds = camera.getVisibleBounds();
    const startTileX = Math.max(0, Math.floor(bounds.left / this.tileSize));
    const endTileX = Math.min(this.mapData.width, Math.ceil(bounds.right / this.tileSize));
    const startTileY = Math.max(0, Math.floor(bounds.top / this.tileSize));
    const endTileY = Math.min(this.mapData.height, Math.ceil(bounds.bottom / this.tileSize));

    const time = Date.now() * 0.001;
    const isNight = this.timeOfDay < 0.25 || this.timeOfDay > 0.80;

    for (let tileY = startTileY; tileY < endTileY; tileY++) {
      const row = this.mapData.tiles[tileY];
      if (!row) continue;

      for (let tileX = startTileX; tileX < endTileX; tileX++) {
        const tile = row[tileX];
        if (!tile) continue;

        if (tile.type === 'water') {
          const worldX = tileX * this.tileSize;
          const worldY = tileY * this.tileSize;
          const screenPos = camera.worldToScreen(worldX, worldY);

          // Water base
          const waterGradient = ctx.createLinearGradient(
            screenPos.x, screenPos.y,
            screenPos.x, screenPos.y + this.tileSize
          );

          if (isNight) {
            waterGradient.addColorStop(0, '#1a2a3a');
            waterGradient.addColorStop(1, '#0a1a2a');
          } else {
            waterGradient.addColorStop(0, '#4a8aaa');
            waterGradient.addColorStop(1, '#3a7a9a');
          }

          ctx.fillStyle = waterGradient;
          ctx.fillRect(screenPos.x, screenPos.y, this.tileSize, this.tileSize);

          // Animated wave highlights
          const waveOffset = Math.sin(time + tileX * 0.5) * 3;
          ctx.strokeStyle = isNight ? 'rgba(100, 150, 200, 0.2)' : 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(screenPos.x, screenPos.y + 10 + waveOffset);
          ctx.quadraticCurveTo(
            screenPos.x + this.tileSize / 2, screenPos.y + 8 + waveOffset,
            screenPos.x + this.tileSize, screenPos.y + 10 + waveOffset
          );
          ctx.stroke();
        }
      }
    }
  }
}
