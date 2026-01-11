"use strict";
/**
 * Camera System
 * Handles viewport positioning, smooth follow, and coordinate conversion
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const types_1 = require("./types");
class Camera {
    constructor(viewportWidth, viewportHeight, followSpeed = 0.08) {
        /** Current camera position (world coordinates, top-left of viewport) */
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
        /** Viewport dimensions */
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
        /** World bounds for camera clamping */
        Object.defineProperty(this, "worldWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 960
        });
        Object.defineProperty(this, "worldHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 640
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
    }
    /**
     * Set world bounds for camera clamping
     */
    setWorldBounds(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
    }
    /**
     * Set the target position (typically player position)
     * Camera will smoothly follow this point
     */
    setTarget(x, y) {
        // Center camera on target
        this.targetX = x - this.viewportWidth / 2;
        this.targetY = y - this.viewportHeight / 2;
        // Clamp to world bounds
        this.targetX = (0, types_1.clamp)(this.targetX, 0, Math.max(0, this.worldWidth - this.viewportWidth));
        this.targetY = (0, types_1.clamp)(this.targetY, 0, Math.max(0, this.worldHeight - this.viewportHeight));
    }
    /**
     * Instantly snap camera to target (no smooth follow)
     */
    snapToTarget() {
        this.x = this.targetX;
        this.y = this.targetY;
    }
    /**
     * Update camera position (smooth follow)
     * @param dt - Delta time in milliseconds
     */
    update(dt) {
        // Smooth interpolation toward target
        // Adjust lerp factor based on frame time for consistent feel
        const t = 1 - Math.pow(1 - this.followSpeed, dt / 16.67);
        this.x = (0, types_1.lerp)(this.x, this.targetX, t);
        this.y = (0, types_1.lerp)(this.y, this.targetY, t);
        // Snap if very close to avoid floating point drift
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
    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX, worldY) {
        const renderX = this.getRenderX();
        const renderY = this.getRenderY();
        return {
            x: worldX - renderX,
            y: worldY - renderY,
        };
    }
    /**
     * Convert screen coordinates to world coordinates
     */
    screenToWorld(screenX, screenY) {
        const renderX = this.getRenderX();
        const renderY = this.getRenderY();
        return {
            x: screenX + renderX,
            y: screenY + renderY,
        };
    }
    /**
     * Get parallax offset for a layer
     * @param factor - 0 = fixed, 1 = moves with camera, values in between create parallax
     */
    getParallaxOffset(factor) {
        const renderX = this.getRenderX();
        const renderY = this.getRenderY();
        return {
            x: -renderX * factor,
            y: -renderY * factor,
        };
    }
    /**
     * Check if a world position is visible in viewport (with padding)
     */
    isVisible(worldX, worldY, width = 0, height = 0, padding = 64) {
        const screenPos = this.worldToScreen(worldX, worldY);
        return (screenPos.x + width + padding > 0 &&
            screenPos.x - padding < this.viewportWidth &&
            screenPos.y + height + padding > 0 &&
            screenPos.y - padding < this.viewportHeight);
    }
    /**
     * Get the visible world bounds
     */
    getVisibleBounds() {
        const renderX = this.getRenderX();
        const renderY = this.getRenderY();
        return {
            left: renderX,
            top: renderY,
            right: renderX + this.viewportWidth,
            bottom: renderY + this.viewportHeight,
        };
    }
}
exports.Camera = Camera;
