"use strict";
/**
 * Camera System (V2)
 * Handles viewport positioning and smooth follow in world pixels.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const math_1 = require("./math");
class Camera {
    constructor(viewportWidth, viewportHeight, followSpeed = 0.08) {
        /** Current camera position (world pixels, top-left of viewport) */
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /** Target position for smooth following */
        Object.defineProperty(this, "targetX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "targetY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /** Viewport dimensions (screen pixels) */
        Object.defineProperty(this, "viewportWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "viewportHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** World bounds for camera clamping (world pixels) */
        Object.defineProperty(this, "worldWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "worldHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Smooth follow speed (0-1, higher = faster) */
        Object.defineProperty(this, "followSpeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.followSpeed = followSpeed;
        this.worldWidth = viewportWidth;
        this.worldHeight = viewportHeight;
    }
    setWorldBounds(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
    }
    setTarget(worldX, worldY) {
        this.targetX = worldX - this.viewportWidth / 2;
        this.targetY = worldY - this.viewportHeight / 2;
        this.targetX = (0, math_1.clamp)(this.targetX, 0, Math.max(0, this.worldWidth - this.viewportWidth));
        this.targetY = (0, math_1.clamp)(this.targetY, 0, Math.max(0, this.worldHeight - this.viewportHeight));
    }
    snapToTarget() {
        this.x = this.targetX;
        this.y = this.targetY;
    }
    /**
     * Update camera position (smooth follow)
     * @param dtMs - Delta time in milliseconds
     */
    update(dtMs) {
        const t = 1 - Math.pow(1 - this.followSpeed, dtMs / 16.67);
        this.x = (0, math_1.lerp)(this.x, this.targetX, t);
        this.y = (0, math_1.lerp)(this.y, this.targetY, t);
        if (Math.abs(this.x - this.targetX) < 0.01)
            this.x = this.targetX;
        if (Math.abs(this.y - this.targetY) < 0.01)
            this.y = this.targetY;
    }
    /**
     * Render-snapped camera position (integer pixels) to avoid subpixel jitter.
     * Keeps internal `x/y` as floats for smooth following.
     */
    getRenderX() {
        return Math.round(this.x);
    }
    getRenderY() {
        return Math.round(this.y);
    }
    worldToScreen(worldX, worldY) {
        return { x: worldX - this.x, y: worldY - this.y };
    }
    /**
     * Pixel-snapped world→screen transform.
     * Prefer this for pixel-art sprites to avoid subpixel shimmer.
     */
    worldToScreenSnapped(worldX, worldY) {
        return { x: Math.round(worldX - this.x), y: Math.round(worldY - this.y) };
    }
    screenToWorld(screenX, screenY) {
        return { x: screenX + this.x, y: screenY + this.y };
    }
    getParallaxOffset(factor) {
        return { x: -this.x * factor, y: -this.y * factor };
    }
    isVisible(worldX, worldY, width = 0, height = 0, padding = 64) {
        const screenPos = this.worldToScreen(worldX, worldY);
        return (screenPos.x + width + padding > 0 &&
            screenPos.x - padding < this.viewportWidth &&
            screenPos.y + height + padding > 0 &&
            screenPos.y - padding < this.viewportHeight);
    }
    getVisibleBounds() {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.viewportWidth,
            bottom: this.y + this.viewportHeight,
        };
    }
}
exports.Camera = Camera;
