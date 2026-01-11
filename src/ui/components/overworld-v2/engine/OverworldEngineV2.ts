/**
 * OverworldEngineV2
 * Minimal orchestration layer for the new overworld renderer.
 */

import { Camera } from './Camera';
import { clamp } from './math';
import type { Layer } from './types';
import {
  DEFAULT_CAMERA_FOLLOW_SPEED,
  DEFAULT_MAX_DT_MS,
  DEFAULT_WORLD_HEIGHT,
  DEFAULT_WORLD_WIDTH,
} from '../data/constants';

export interface OverworldEngineV2Config {
  viewportWidth: number;
  viewportHeight: number;
  worldWidth: number;
  worldHeight: number;
  cameraFollowSpeed: number;
  maxDtMs: number;
}

const DEFAULT_CONFIG: OverworldEngineV2Config = {
  viewportWidth: 960,
  viewportHeight: 640,
  worldWidth: DEFAULT_WORLD_WIDTH,
  worldHeight: DEFAULT_WORLD_HEIGHT,
  cameraFollowSpeed: DEFAULT_CAMERA_FOLLOW_SPEED,
  maxDtMs: DEFAULT_MAX_DT_MS,
};

export type EngineUpdateCallback = (dtMs: number, engine: OverworldEngineV2) => void;

export class OverworldEngineV2 {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: OverworldEngineV2Config;
  private camera: Camera;

  private running: boolean = false;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;

  private layers: Layer[] = [];
  private onUpdateCallback: EngineUpdateCallback | null = null;

  constructor(canvas: HTMLCanvasElement, config: Partial<OverworldEngineV2Config> = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D rendering context');
    this.ctx = ctx;

    this.config = { ...DEFAULT_CONFIG, ...config };

    this.ctx.imageSmoothingEnabled = false;

    this.camera = new Camera(
      this.config.viewportWidth,
      this.config.viewportHeight,
      this.config.cameraFollowSpeed
    );
    this.camera.setWorldBounds(this.config.worldWidth, this.config.worldHeight);
  }

  getCamera(): Camera {
    return this.camera;
  }

  setWorldBounds(worldWidth: number, worldHeight: number): void {
    this.config.worldWidth = worldWidth;
    this.config.worldHeight = worldHeight;
    this.camera.setWorldBounds(worldWidth, worldHeight);
  }

  setLayers(layers: Layer[]): void {
    this.layers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  }

  addLayer(layer: Layer): void {
    this.layers.push(layer);
    this.layers.sort((a, b) => a.zIndex - b.zIndex);
  }

  /** Register a callback invoked each frame before layer updates */
  onUpdate(callback: EngineUpdateCallback | null): void {
    this.onUpdateCallback = callback;
  }

  setTimeOfDay(t: number): void {
    for (const layer of this.layers) {
      layer.setTimeOfDay?.(t);
    }
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = performance.now();
    this.loop();
  }

  stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  pause(): void {
    this.stop();
  }

  resume(): void {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = performance.now();
    this.loop();
  }

  private loop = (): void => {
    if (!this.running) return;

    const now = performance.now();
    const rawDt = now - this.lastFrameTime;
    const dt = clamp(rawDt, 0, this.config.maxDtMs);
    this.lastFrameTime = now;

    this.update(dt);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dtMs: number): void {
    // Call custom update callback first (for input/movement)
    this.onUpdateCallback?.(dtMs, this);

    this.camera.update(dtMs);
    for (const layer of this.layers) {
      layer.update?.(dtMs);
    }
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const layer of this.layers) {
      layer.render(this.ctx, this.camera);
    }
  }
}

