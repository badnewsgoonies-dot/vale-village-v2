/**
 * PlayerLayer
 * Renders the player sprite in world pixels via camera offset.
 * Bottom-center anchored with 4-directional sprites and shadow.
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { loadSprite } from '../../../sprites/loader';
import { getPlayerSprite, shouldMirrorSprite, type Direction } from '../../../sprites/mappings/overworldSprites';

export interface PlayerState {
  /** World X position (center of player) */
  x: number;
  /** World Y position (ground line / feet) */
  y: number;
  /** Current facing direction */
  facing: Direction;
  /** Player unit ID for sprite selection */
  unitId: string;
  /** Whether player is currently moving */
  isMoving: boolean;
}

const DEFAULT_PLAYER_WIDTH = 32;
const DEFAULT_PLAYER_HEIGHT = 48;

export class PlayerLayer implements Layer {
  zIndex = 4;

  private playerState: PlayerState;
  private spriteCache: Map<string, HTMLImageElement> = new Map();
  private loadingSprites: Set<string> = new Set();

  private width: number;
  private height: number;

  constructor(
    initialState: Partial<PlayerState> = {},
    dimensions: { width?: number; height?: number } = {}
  ) {
    this.playerState = {
      x: initialState.x ?? 200,
      y: initialState.y ?? 450,
      facing: initialState.facing ?? 'down',
      unitId: initialState.unitId ?? 'adept',
      isMoving: initialState.isMoving ?? false,
    };

    this.width = dimensions.width ?? DEFAULT_PLAYER_WIDTH;
    this.height = dimensions.height ?? DEFAULT_PLAYER_HEIGHT;

    // Preload initial sprite
    this.preloadSprite(this.playerState.unitId, this.playerState.facing);
  }

  private preloadSprite(unitId: string, direction: Direction): void {
    const spritePath = getPlayerSprite(unitId, direction);
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

  /** Update player state from external source (engine/input system) */
  setPlayerState(state: Partial<PlayerState>): void {
    if (state.x !== undefined) this.playerState.x = state.x;
    if (state.y !== undefined) this.playerState.y = state.y;
    if (state.facing !== undefined) {
      if (state.facing !== this.playerState.facing) {
        // Preload new direction sprite
        this.preloadSprite(this.playerState.unitId, state.facing);
      }
      this.playerState.facing = state.facing;
    }
    if (state.unitId !== undefined) {
      if (state.unitId !== this.playerState.unitId) {
        // Preload new character sprites
        this.preloadSprite(state.unitId, this.playerState.facing);
      }
      this.playerState.unitId = state.unitId;
    }
    if (state.isMoving !== undefined) this.playerState.isMoving = state.isMoving;
  }

  getPlayerState(): PlayerState {
    return { ...this.playerState };
  }

  /** Get player world position (for camera targeting) */
  getPosition(): { x: number; y: number } {
    return { x: this.playerState.x, y: this.playerState.y };
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const { x: worldX, y: worldY, facing, unitId } = this.playerState;
    const { x: screenX, y: screenY } = camera.worldToScreen(worldX, worldY);

    // Shadow on the ground (ellipse below feet)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 4, this.width * 0.4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Get sprite for current direction
    const spritePath = getPlayerSprite(unitId, facing);
    this.loadSpriteAsync(spritePath);
    const sprite = this.spriteCache.get(spritePath);

    if (!sprite) {
      // Placeholder rectangle until sprite loads
      ctx.save();
      ctx.fillStyle = 'rgba(100, 150, 255, 0.6)';
      ctx.fillRect(
        screenX - this.width / 2,
        screenY - this.height,
        this.width,
        this.height
      );
      ctx.restore();
      return;
    }

    // Handle sprite mirroring for left-facing
    const mirror = shouldMirrorSprite(facing);

    ctx.save();
    if (mirror) {
      // Flip horizontally around sprite center
      ctx.translate(screenX, screenY);
      ctx.scale(-1, 1);
      ctx.drawImage(
        sprite,
        -this.width / 2,
        -this.height,
        this.width,
        this.height
      );
    } else {
      // Normal bottom-center anchored draw
      ctx.drawImage(
        sprite,
        screenX - this.width / 2,
        screenY - this.height,
        this.width,
        this.height
      );
    }
    ctx.restore();
  }
}
