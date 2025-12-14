/**
 * Camera System (V2)
 * Handles viewport positioning and smooth follow in world pixels.
 */

import { lerp, clamp } from './math';

export class Camera {
  /** Current camera position (world pixels, top-left of viewport) */
  x: number = 0;
  y: number = 0;

  /** Target position for smooth following */
  private targetX: number = 0;
  private targetY: number = 0;

  /** Viewport dimensions (screen pixels) */
  viewportWidth: number;
  viewportHeight: number;

  /** World bounds for camera clamping (world pixels) */
  worldWidth: number;
  worldHeight: number;

  /** Smooth follow speed (0-1, higher = faster) */
  followSpeed: number;

  constructor(viewportWidth: number, viewportHeight: number, followSpeed: number = 0.08) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.followSpeed = followSpeed;

    this.worldWidth = viewportWidth;
    this.worldHeight = viewportHeight;
  }

  setWorldBounds(width: number, height: number): void {
    this.worldWidth = width;
    this.worldHeight = height;
  }

  setTarget(worldX: number, worldY: number): void {
    this.targetX = worldX - this.viewportWidth / 2;
    this.targetY = worldY - this.viewportHeight / 2;

    this.targetX = clamp(this.targetX, 0, Math.max(0, this.worldWidth - this.viewportWidth));
    this.targetY = clamp(this.targetY, 0, Math.max(0, this.worldHeight - this.viewportHeight));
  }

  snapToTarget(): void {
    this.x = this.targetX;
    this.y = this.targetY;
  }

  /**
   * Update camera position (smooth follow)
   * @param dtMs - Delta time in milliseconds
   */
  update(dtMs: number): void {
    const t = 1 - Math.pow(1 - this.followSpeed, dtMs / 16.67);

    this.x = lerp(this.x, this.targetX, t);
    this.y = lerp(this.y, this.targetY, t);

    if (Math.abs(this.x - this.targetX) < 0.01) this.x = this.targetX;
    if (Math.abs(this.y - this.targetY) < 0.01) this.y = this.targetY;
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return { x: worldX - this.x, y: worldY - this.y };
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return { x: screenX + this.x, y: screenY + this.y };
  }

  getParallaxOffset(factor: number): { x: number; y: number } {
    return { x: -this.x * factor, y: -this.y * factor };
  }

  isVisible(
    worldX: number,
    worldY: number,
    width: number = 0,
    height: number = 0,
    padding: number = 64
  ): boolean {
    const screenPos = this.worldToScreen(worldX, worldY);
    return (
      screenPos.x + width + padding > 0 &&
      screenPos.x - padding < this.viewportWidth &&
      screenPos.y + height + padding > 0 &&
      screenPos.y - padding < this.viewportHeight
    );
  }

  getVisibleBounds(): { left: number; top: number; right: number; bottom: number } {
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.viewportWidth,
      bottom: this.y + this.viewportHeight,
    };
  }
}

