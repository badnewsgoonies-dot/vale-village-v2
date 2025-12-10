/**
 * Camera System
 * Handles viewport positioning, smooth follow, and coordinate conversion
 */

import { lerp, clamp } from './types';

export class Camera {
  /** Current camera position (world coordinates, top-left of viewport) */
  x: number = 0;
  y: number = 0;

  /** Target position for smooth following */
  private targetX: number = 0;
  private targetY: number = 0;

  /** Viewport dimensions */
  viewportWidth: number;
  viewportHeight: number;

  /** World bounds for camera clamping */
  worldWidth: number = 960;
  worldHeight: number = 640;

  /** Smooth follow speed (0-1, higher = faster) */
  followSpeed: number;

  constructor(
    viewportWidth: number,
    viewportHeight: number,
    followSpeed: number = 0.08
  ) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.followSpeed = followSpeed;
  }

  /**
   * Set world bounds for camera clamping
   */
  setWorldBounds(width: number, height: number): void {
    this.worldWidth = width;
    this.worldHeight = height;
  }

  /**
   * Set the target position (typically player position)
   * Camera will smoothly follow this point
   */
  setTarget(x: number, y: number): void {
    // Center camera on target
    this.targetX = x - this.viewportWidth / 2;
    this.targetY = y - this.viewportHeight / 2;

    // Clamp to world bounds
    this.targetX = clamp(this.targetX, 0, Math.max(0, this.worldWidth - this.viewportWidth));
    this.targetY = clamp(this.targetY, 0, Math.max(0, this.worldHeight - this.viewportHeight));
  }

  /**
   * Instantly snap camera to target (no smooth follow)
   */
  snapToTarget(): void {
    this.x = this.targetX;
    this.y = this.targetY;
  }

  /**
   * Update camera position (smooth follow)
   * @param dt - Delta time in milliseconds
   */
  update(dt: number): void {
    // Smooth interpolation toward target
    // Adjust lerp factor based on frame time for consistent feel
    const t = 1 - Math.pow(1 - this.followSpeed, dt / 16.67);

    this.x = lerp(this.x, this.targetX, t);
    this.y = lerp(this.y, this.targetY, t);

    // Snap if very close to avoid floating point drift
    if (Math.abs(this.x - this.targetX) < 0.01) this.x = this.targetX;
    if (Math.abs(this.y - this.targetY) < 0.01) this.y = this.targetY;
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.x,
      y: worldY - this.y,
    };
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.x,
      y: screenY + this.y,
    };
  }

  /**
   * Get parallax offset for a layer
   * @param factor - 0 = fixed, 1 = moves with camera, values in between create parallax
   */
  getParallaxOffset(factor: number): { x: number; y: number } {
    return {
      x: -this.x * factor,
      y: -this.y * factor,
    };
  }

  /**
   * Check if a world position is visible in viewport (with padding)
   */
  isVisible(worldX: number, worldY: number, width: number = 0, height: number = 0, padding: number = 64): boolean {
    const screenPos = this.worldToScreen(worldX, worldY);
    return (
      screenPos.x + width + padding > 0 &&
      screenPos.x - padding < this.viewportWidth &&
      screenPos.y + height + padding > 0 &&
      screenPos.y - padding < this.viewportHeight
    );
  }

  /**
   * Get the visible world bounds
   */
  getVisibleBounds(): { left: number; top: number; right: number; bottom: number } {
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.viewportWidth,
      bottom: this.y + this.viewportHeight,
    };
  }
}
