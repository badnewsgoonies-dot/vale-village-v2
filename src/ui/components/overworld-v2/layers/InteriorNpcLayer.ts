/**
 * InteriorNpcLayer
 * Renders a single NPC inside interior scenes.
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { loadSprite } from '../../../sprites/loader';
import { getNPCSprite } from '../../../sprites/mappings/overworldSprites';

export interface InteriorNpcState {
  id: string;
  x: number;
  y: number;
}

const DEFAULT_NPC_WIDTH = 32;
const DEFAULT_NPC_HEIGHT = 48;

export class InteriorNpcLayer implements Layer {
  zIndex = 2;

  private npc: InteriorNpcState;
  private spriteCache: Map<string, HTMLImageElement> = new Map();
  private loadingSprites: Set<string> = new Set();

  private width: number;
  private height: number;

  constructor(npc: InteriorNpcState, dimensions: { width?: number; height?: number } = {}) {
    this.npc = { ...npc };
    this.width = dimensions.width ?? DEFAULT_NPC_WIDTH;
    this.height = dimensions.height ?? DEFAULT_NPC_HEIGHT;

    this.preloadSprite();
  }

  private preloadSprite(): void {
    const spritePath = getNPCSprite(this.npc.id);
    this.loadSpriteAsync(spritePath);
  }

  private loadSpriteAsync(spritePath: string): void {
    if (this.spriteCache.has(spritePath) || this.loadingSprites.has(spritePath)) return;
    this.loadingSprites.add(spritePath);

    loadSprite(spritePath)
      .then((img) => {
        this.spriteCache.set(spritePath, img);
      })
      .finally(() => {
        this.loadingSprites.delete(spritePath);
      });
  }

  getPosition(): { x: number; y: number } {
    return { x: this.npc.x, y: this.npc.y };
  }

  getId(): string {
    return this.npc.id;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const { x: worldX, y: worldY } = this.npc;
    const { x: screenX, y: screenY } = camera.worldToScreenSnapped(worldX, worldY);
    const z = camera.zoom;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 4 * z, this.width * 0.4 * z, 6 * z, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const spritePath = getNPCSprite(this.npc.id);
    this.loadSpriteAsync(spritePath);
    const sprite = this.spriteCache.get(spritePath);

    if (!sprite) {
      ctx.save();
      ctx.fillStyle = 'rgba(220, 100, 100, 0.6)';
      ctx.fillRect(
        screenX - (this.width * z) / 2,
        screenY - this.height * z,
        this.width * z,
        this.height * z
      );
      ctx.restore();
      return;
    }

    ctx.drawImage(
      sprite,
      screenX - (this.width * z) / 2,
      screenY - this.height * z,
      this.width * z,
      this.height * z
    );
  }
}
