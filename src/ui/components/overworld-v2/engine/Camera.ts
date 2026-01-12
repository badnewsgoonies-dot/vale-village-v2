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

  /** Current zoom level (1.0 = normal) */
  zoom: number = 1.0;
  private targetZoom: number = 1.0;
  private zoomSpeed: number = 0.05;

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

  setZoom(level: number, immediate: boolean = false): void {
    this.targetZoom = level;
    if (immediate) this.zoom = level;
  }

  setTarget(worldX: number, worldY: number): void {
    // When zoomed, the focal point stays centered
    this.targetX = worldX - (this.viewportWidth / 2) / this.zoom;
    this.targetY = worldY - (this.viewportHeight / 2) / this.zoom;

    this.targetX = clamp(this.targetX, 0, Math.max(0, this.worldWidth - this.viewportWidth / this.zoom));
    this.targetY = clamp(this.targetY, 0, Math.max(0, this.worldHeight - this.viewportHeight / this.zoom));
  }

  snapToTarget(): void {
    this.x = this.targetX;
    this.y = this.targetY;
    this.zoom = this.targetZoom;
  }

  /**
   * Update camera position (smooth follow)
   * @param dtMs - Delta time in milliseconds
   */
  update(dtMs: number): void {
    const t = 1 - Math.pow(1 - this.followSpeed, dtMs / 16.67);
    const zt = 1 - Math.pow(1 - this.zoomSpeed, dtMs / 16.67);

    this.x = lerp(this.x, this.targetX, t);
    this.y = lerp(this.y, this.targetY, t);
    this.zoom = lerp(this.zoom, this.targetZoom, zt);

    if (Math.abs(this.x - this.targetX) < 0.01) this.x = this.targetX;
    if (Math.abs(this.y - this.targetY) < 0.01) this.y = this.targetY;
    if (Math.abs(this.zoom - this.targetZoom) < 0.001) this.zoom = this.targetZoom;
  }

  /**
   * Render-snapped camera position (integer pixels) to avoid subpixel jitter.
   * Keeps internal `x/y` as floats for smooth following.
   */
  getRenderX(): number {
    return Math.round(this.x);
  }

  getRenderY(): number {
    return Math.round(this.y);
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return { 
      x: (worldX - this.x) * this.zoom, 
      y: (worldY - this.y) * this.zoom 
    };
  }

  /**
   * Pixel-snapped world→screen transform.
   * Prefer this for pixel-art sprites to avoid subpixel shimmer.
   */
  worldToScreenSnapped(worldX: number, worldY: number): { x: number; y: number } {
    return { 
      x: Math.round((worldX - this.x) * this.zoom), 
      y: Math.round((worldY - this.y) * this.zoom) 
    };
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return { 
      x: (screenX / this.zoom) + this.x, 
      y: (screenY / this.zoom) + this.y 
    };
  }

  getParallaxOffset(factor: number): { x: number; y: number } {
    return { x: -this.x * factor * this.zoom, y: -this.y * factor * this.zoom };
  }

  isVisible(
    worldX: number,
    worldY: number,
    width: number = 0,
    height: number = 0,
    padding: number = 64
  ): boolean {
    const screenPos = this.worldToScreen(worldX, worldY);
    const scaledWidth = width * this.zoom;
    const scaledHeight = height * this.zoom;
    const scaledPadding = padding * this.zoom;

    return (
      screenPos.x + scaledWidth + scaledPadding > 0 &&
      screenPos.x - scaledPadding < this.viewportWidth &&
      screenPos.y + scaledHeight + scaledPadding > 0 &&
      screenPos.y - scaledPadding < this.viewportHeight
    );
  }

  getVisibleBounds(): { left: number; top: number; right: number; bottom: number } {
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.viewportWidth / this.zoom,
      bottom: this.y + this.viewportHeight / this.zoom,
    };
  }
}
