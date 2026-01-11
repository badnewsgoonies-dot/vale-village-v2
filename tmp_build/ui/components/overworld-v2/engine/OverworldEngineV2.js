"use strict";
/**
 * OverworldEngineV2
 * Minimal orchestration layer for the new overworld renderer.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldEngineV2 = void 0;
const Camera_1 = require("./Camera");
const math_1 = require("./math");
const constants_1 = require("../data/constants");
const DEFAULT_CONFIG = {
    viewportWidth: 960,
    viewportHeight: 640,
    worldWidth: constants_1.DEFAULT_WORLD_WIDTH,
    worldHeight: constants_1.DEFAULT_WORLD_HEIGHT,
    cameraFollowSpeed: constants_1.DEFAULT_CAMERA_FOLLOW_SPEED,
    maxDtMs: constants_1.DEFAULT_MAX_DT_MS,
};
class OverworldEngineV2 {
    constructor(canvas, config = {}) {
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "camera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "running", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "animationFrameId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "lastFrameTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "layers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "onUpdateCallback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "loop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (!this.running)
                    return;
                const now = performance.now();
                const rawDt = now - this.lastFrameTime;
                const dt = (0, math_1.clamp)(rawDt, 0, this.config.maxDtMs);
                this.lastFrameTime = now;
                this.update(dt);
                this.render();
                this.animationFrameId = requestAnimationFrame(this.loop);
            }
        });
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw new Error('Failed to get 2D rendering context');
        this.ctx = ctx;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.ctx.imageSmoothingEnabled = false;
        this.camera = new Camera_1.Camera(this.config.viewportWidth, this.config.viewportHeight, this.config.cameraFollowSpeed);
        this.camera.setWorldBounds(this.config.worldWidth, this.config.worldHeight);
    }
    getCamera() {
        return this.camera;
    }
    setWorldBounds(worldWidth, worldHeight) {
        this.config.worldWidth = worldWidth;
        this.config.worldHeight = worldHeight;
        this.camera.setWorldBounds(worldWidth, worldHeight);
    }
    setLayers(layers) {
        this.layers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
    }
    addLayer(layer) {
        this.layers.push(layer);
        this.layers.sort((a, b) => a.zIndex - b.zIndex);
    }
    /** Register a callback invoked each frame before layer updates */
    onUpdate(callback) {
        this.onUpdateCallback = callback;
    }
    setTimeOfDay(t) {
        for (const layer of this.layers) {
            layer.setTimeOfDay?.(t);
        }
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        this.lastFrameTime = performance.now();
        this.loop();
    }
    stop() {
        this.running = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    pause() {
        this.stop();
    }
    resume() {
        if (this.running)
            return;
        this.running = true;
        this.lastFrameTime = performance.now();
        this.loop();
    }
    update(dtMs) {
        // Call custom update callback first (for input/movement)
        this.onUpdateCallback?.(dtMs, this);
        this.camera.update(dtMs);
        for (const layer of this.layers) {
            layer.update?.(dtMs);
        }
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const layer of this.layers) {
            layer.render(this.ctx, this.camera);
        }
    }
}
exports.OverworldEngineV2 = OverworldEngineV2;
