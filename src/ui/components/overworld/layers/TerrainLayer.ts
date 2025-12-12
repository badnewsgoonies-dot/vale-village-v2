/**
 * TerrainLayer
 * Renders ground tiles using sprite terrain with a lightweight
 * Golden Sun–style pseudo‑3D perspective (depth scaling).
 */

import type { Layer, Camera } from '../engine/types';
import type { GameMap } from '../../../../data/schemas/mapSchema';
import { clamp } from '../engine/types';
import { loadSprite } from '../../../sprites/loader';

type TileType = GameMap['tiles'][number][number]['type'];

const DEFAULT_TERRAIN_SPRITES: Partial<Record<TileType, string>> = {
  grass: '/sprites/scenery/outdoor/sm/Floating_Grass.gif',
  path: '/sprites/scenery/outdoor/sm/tile_platform.gif',
  water: '/sprites/scenery/outdoor/sm/Ice.gif',
};

const TERRAIN_TYPES: TileType[] = ['grass', 'path', 'water'];

export class TerrainLayer implements Layer {
  zIndex = 2; // In front of background (ground layer)

  private mapData: GameMap | null = null;
  private timeOfDay: number = 0.5;
  private tileSize: number = 32;

  private canvasWidth: number = 960;
  private canvasHeight: number = 640;

  private useSceneMode: boolean = false;
  private sceneScaleX: number = 1;
  private sceneScaleY: number = 1;

  private spriteCache: Map<string, HTMLImageElement> = new Map();
  private loadingSprites: Set<string> = new Set();

  // startY kept for backward-compat (no longer used directly)
  constructor(_startY: number = 300, canvasHeight: number = 640) {
    this.canvasHeight = canvasHeight;
  }

  setMap(map: GameMap): void {
    this.mapData = map;
    this.recomputeSceneScale();

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
    this.recomputeSceneScale();
  }

  setCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.recomputeSceneScale();
  }

  setSceneMode(enabled: boolean): void {
    this.useSceneMode = enabled;
    this.recomputeSceneScale();
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.mapData) return;

    if (this.useSceneMode) {
      this.renderSceneMode(ctx);
    } else {
      this.renderWorldMode(ctx, camera);
    }
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

        const spriteId = tile.spriteId || DEFAULT_TERRAIN_SPRITES[tile.type];
        if (!spriteId) continue;

        const worldX = tileX * this.tileSize;
        const worldY = tileY * this.tileSize;
        const screenPos = camera.worldToScreen(worldX, worldY);

        this.drawTile(
          ctx,
          screenPos.x,
          screenPos.y,
          this.tileSize,
          this.tileSize,
          spriteId,
          worldY + this.tileSize,
          worldHeightPx
        );
      }
    }
  }

  /**
   * Scene mode stretches the tile grid to the canvas so small maps
   * can still fill the pseudo‑3D scene (used for Vale Village).
   */
  private renderSceneMode(ctx: CanvasRenderingContext2D): void {
    if (!this.mapData) return;
    const worldWidthPx = this.mapData.width * this.tileSize;
    const worldHeightPx = this.mapData.height * this.tileSize;

    const cellWidth = this.tileSize * this.sceneScaleX;
    const cellHeight = this.tileSize * this.sceneScaleY;

    for (let tileY = 0; tileY < this.mapData.height; tileY++) {
      const row = this.mapData.tiles[tileY];
      if (!row) continue;

      for (let tileX = 0; tileX < this.mapData.width; tileX++) {
        const tile = row[tileX];
        if (!tile || !TERRAIN_TYPES.includes(tile.type)) continue;

        const spriteId = tile.spriteId || DEFAULT_TERRAIN_SPRITES[tile.type];
        if (!spriteId) continue;

        const worldX = tileX * this.tileSize;
        const worldY = tileY * this.tileSize;

        const screenX = worldWidthPx > 0 ? (worldX / worldWidthPx) * this.canvasWidth : worldX;
        const screenY = worldHeightPx > 0 ? (worldY / worldHeightPx) * this.canvasHeight : worldY;

        this.drawTile(
          ctx,
          screenX,
          screenY,
          cellWidth,
          cellHeight,
          spriteId,
          worldY + this.tileSize,
          worldHeightPx
        );
      }
    }
  }

  private drawTile(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    cellWidth: number,
    cellHeight: number,
    spriteId: string,
    worldYBottom: number,
    worldHeightPx: number
  ): void {
    const sprite = this.getSprite(spriteId);

    const depthNorm = worldHeightPx > 0 ? worldYBottom / worldHeightPx : 1;
    const perspectiveScale = 0.7 + clamp(depthNorm, 0, 1) * 0.3;

    const drawW = cellWidth * perspectiveScale;
    const drawH = cellHeight * perspectiveScale;
    const x = screenX + (cellWidth - drawW) / 2;
    const y = screenY + cellHeight - drawH;

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

  private recomputeSceneScale(): void {
    if (!this.useSceneMode || !this.mapData) {
      this.sceneScaleX = 1;
      this.sceneScaleY = 1;
      return;
    }
    const worldWidthPx = this.mapData.width * this.tileSize;
    const worldHeightPx = this.mapData.height * this.tileSize;
    this.sceneScaleX = worldWidthPx > 0 ? this.canvasWidth / worldWidthPx : 1;
    this.sceneScaleY = worldHeightPx > 0 ? this.canvasHeight / worldHeightPx : 1;
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
