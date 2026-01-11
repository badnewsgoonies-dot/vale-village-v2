/**
 * TerrainLayer
 * Renders ground tiles using sprite terrain with a lightweight
 * Golden Sun–style pseudo‑3D palette with depth shading.
 */

import type { Layer, Camera } from '../engine/types';
import type { GameMap } from '../../../../data/schemas/mapSchema';
import { loadSprite } from '../../../sprites/loader';

type TileType = GameMap['tiles'][number][number]['type'];

const DEFAULT_TERRAIN_SPRITES: Partial<Record<TileType, string>> = {
  // grass: Don't tile small sprites - use solid color fill instead
  // path: Removed - was creating ugly fence-like appearance
  water: '/sprites/scenery/outdoor/sm/Ice.gif',
};

// Grass and path tiles render as solid color, not stretched sprites
const SOLID_COLOR_TILES: Partial<Record<TileType, string>> = {
  grass: '#4a8a4a', // Forest green
  path: '#8B7355',  // Brown road
};

const TERRAIN_TYPES: TileType[] = ['grass', 'path', 'water'];

export class TerrainLayer implements Layer {
  zIndex = 2; // In front of background (ground layer)

  private mapData: GameMap | null = null;
  private timeOfDay: number = 0.5;
  private tileSize: number = 32;

  private canvasHeight: number = 640;


  private spriteCache: Map<string, HTMLImageElement> = new Map();
  private loadingSprites: Set<string> = new Set();

  // startY kept for backward-compat (no longer used directly)
  constructor(_startY: number = 300, canvasHeight: number = 640) {
    this.canvasHeight = canvasHeight;
  }

  setMap(map: GameMap): void {
    this.mapData = map;

    // Preload any referenced terrain sprites
    const ids = new Set<string>();
    for (const row of map.tiles) {
      for (const tile of row) {
        if (!tile) continue;
        if (!TERRAIN_TYPES.includes(tile.type)) continue;
        const id = tile.spriteId || DEFAULT_TERRAIN_SPRITES[tile.type];
        if (id) ids.add(id);
      }
    }
    for (const id of ids) {
      this.loadSpriteAsync(id);
    }
  }

  setTimeOfDay(time: number): void {
    this.timeOfDay = time;
  }

  setTileSize(size: number): void {
    this.tileSize = size;
  }

  setCanvasSize(height: number): void {
    this.canvasHeight = height;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.mapData) return;

    this.renderWorldMode(ctx, camera);
  }

  private renderWorldMode(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.mapData) return;

    const bounds = camera.getVisibleBounds();
    const startTileX = Math.max(0, Math.floor(bounds.left / this.tileSize));
    const endTileX = Math.min(this.mapData.width, Math.ceil(bounds.right / this.tileSize));
    const startTileY = Math.max(0, Math.floor(bounds.top / this.tileSize));
    const endTileY = Math.min(this.mapData.height, Math.ceil(bounds.bottom / this.tileSize));
    const worldHeightPx = this.mapData.height * this.tileSize;

    for (let tileY = startTileY; tileY < endTileY; tileY++) {
      const row = this.mapData.tiles[tileY];
      if (!row) continue;

      for (let tileX = startTileX; tileX < endTileX; tileX++) {
        const tile = row[tileX];
        if (!tile || !TERRAIN_TYPES.includes(tile.type)) continue;

        // Skip path tiles (they create ugly fence appearance in pseudo-3D view)
        if (tile.type === 'path') continue;

        const spriteId = tile.spriteId || DEFAULT_TERRAIN_SPRITES[tile.type];
        const solidColor = SOLID_COLOR_TILES[tile.type];

        const worldX = tileX * this.tileSize;
        const worldY = tileY * this.tileSize;
        const screenPos = camera.worldToScreen(worldX, worldY);

        // Skip grass tiles in upper portion - only render below 48% (behind buildings)
        if (solidColor && screenPos.y < this.canvasHeight * 0.48) {
          continue;
        }

        if (solidColor) {
          // Draw solid color for grass-type tiles (avoids ugly sprite tiling)
          this.drawSolidTile(ctx, screenPos.x, screenPos.y, this.tileSize, this.tileSize, solidColor, worldY + this.tileSize, worldHeightPx);
        } else if (spriteId) {
          this.drawTile(ctx, screenPos.x, screenPos.y, this.tileSize, this.tileSize, spriteId);
        }
      }
    }
  }


  private drawTile(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    cellWidth: number,
    cellHeight: number,
    spriteId: string
  ): void {
    const sprite = this.getSprite(spriteId);

    const drawW = cellWidth;
    const drawH = cellHeight;
    const x = screenX;
    const y = screenY;

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      ctx.drawImage(sprite, x, y, drawW, drawH);
    } else {
      // Placeholder fallback
      ctx.save();
      const isNight = this.timeOfDay < 0.25 || this.timeOfDay > 0.80;
      ctx.fillStyle = isNight ? '#2a3a2a' : '#4a7a4a';
      ctx.fillRect(x, y, drawW, drawH);
      ctx.restore();
    }

    // Simple night tint for cohesion
    if (this.timeOfDay < 0.25 || this.timeOfDay > 0.80) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(x, y, drawW, drawH);
      ctx.restore();
    }
  }

  private drawSolidTile(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    cellWidth: number,
    cellHeight: number,
    color: string,
    worldYBottom: number,
    worldHeightPx: number
  ): void {
    const depthNorm = worldHeightPx > 0 ? worldYBottom / worldHeightPx : 1;

    // For solid ground tiles, fill the ENTIRE cell (no gaps)
    // Add 1px overlap to prevent subpixel gaps
    const drawW = cellWidth + 1;
    const drawH = cellHeight + 1;

    ctx.save();
    // Adjust brightness based on depth for pseudo-3D effect
    const brightness = 0.85 + depthNorm * 0.15;
    ctx.fillStyle = this.adjustBrightness(color, brightness);
    ctx.fillRect(screenX, screenY, drawW, drawH);
    ctx.restore();

    // Night tint
    if (this.timeOfDay < 0.25 || this.timeOfDay > 0.80) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 30, 0.25)';
      ctx.fillRect(screenX, screenY, drawW, drawH);
      ctx.restore();
    }
  }

  private adjustBrightness(hex: string, factor: number): string {
    // Simple brightness adjustment for hex colors
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const nr = Math.min(255, Math.round(r * factor));
    const ng = Math.min(255, Math.round(g * factor));
    const nb = Math.min(255, Math.round(b * factor));
    return `rgb(${nr}, ${ng}, ${nb})`;
  }

  private async loadSpriteAsync(spriteId: string): Promise<void> {
    if (this.spriteCache.has(spriteId) || this.loadingSprites.has(spriteId)) {
      return;
    }
    this.loadingSprites.add(spriteId);
    try {
      const sprite = await loadSprite(spriteId);
      this.spriteCache.set(spriteId, sprite);
    } finally {
      this.loadingSprites.delete(spriteId);
    }
  }

  private getSprite(spriteId: string): HTMLImageElement | null {
    return this.spriteCache.get(spriteId) || null;
  }
}
