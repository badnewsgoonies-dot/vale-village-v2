/**
 * Engine Types
 * Core type definitions for the canvas overworld engine
 */

import type { NPC } from '../../../../data/schemas/mapSchema';

/** World position in pixels (not tiles) - allows smooth sub-pixel movement */
export interface WorldPosition {
  x: number;
  y: number;
}

/** Tile position (integer grid coordinates) */
export interface TilePosition {
  x: number;
  y: number;
}

/** Direction enum for movement and facing */
export type Direction = 'up' | 'down' | 'left' | 'right';

/** Velocity vector for smooth movement */
export interface Velocity {
  x: number;
  y: number;
}

/** Entity types for Y-sorting */
export type EntityType = 'building' | 'tree' | 'decoration' | 'npc' | 'player';

/** Base entity for Y-sorted rendering */
export interface Entity {
  type: EntityType;
  id: string;
  x: number;       // World X (pixels)
  y: number;       // World Y (pixels) - used for depth sorting
  width: number;
  height: number;
  spriteId: string;
  // Optional animation properties
  animOffset?: number;
  swayAmount?: number;
}

/** Player entity with additional state */
export interface PlayerEntity extends Entity {
  type: 'player';
  facing: Direction;
  velocity: Velocity;
  speed: number;
}

/** NPC entity with dialogue state */
export interface NPCEntity extends Entity {
  type: 'npc';
  npcData: NPC;
  facing: Direction;
}

/** Building entity with entry trigger */
export interface BuildingEntity extends Entity {
  type: 'building';
  triggerId?: string;
  doorPosition?: WorldPosition;
  hasWindowGlow?: boolean;
}

/** Layer interface for render ordering */
export interface Layer {
  zIndex: number;
  render(ctx: CanvasRenderingContext2D, camera: Camera): void;
  update?(dt: number): void;
}

/** Camera interface for viewport management */
export interface Camera {
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
  worldToScreen(worldX: number, worldY: number): { x: number; y: number };
  screenToWorld(screenX: number, screenY: number): { x: number; y: number };
  getParallaxOffset(factor: number): { x: number; y: number };
  isVisible(worldX: number, worldY: number, width?: number, height?: number, padding?: number): boolean;
  getVisibleBounds(): { left: number; top: number; right: number; bottom: number };
  setTarget(x: number, y: number): void;
  update(dt: number): void;
}

/** Scene type determines which layers are active */
export type SceneType = 'overworld' | 'interior';

/** Engine configuration */
export interface EngineConfig {
  canvasWidth: number;
  canvasHeight: number;
  tileSize: number;
  playerSpeed: number;       // Pixels per second
  cameraFollowSpeed: number; // 0-1 lerp factor
}

/** Default engine configuration */
export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  canvasWidth: 960,
  canvasHeight: 640,
  tileSize: 32,
  playerSpeed: 160,       // 5 tiles per second
  cameraFollowSpeed: 0.08, // Smooth follow
};

/** Input state for continuous movement */
export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
}

/** Convert tile position to world position */
export function tileToWorld(tile: TilePosition, tileSize: number = 32): WorldPosition {
  return {
    x: tile.x * tileSize + tileSize / 2,
    y: tile.y * tileSize + tileSize / 2,
  };
}

/** Convert world position to tile position */
export function worldToTile(world: WorldPosition, tileSize: number = 32): TilePosition {
  return {
    x: Math.floor(world.x / tileSize),
    y: Math.floor(world.y / tileSize),
  };
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
