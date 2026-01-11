"use strict";
/**
 * SceneTransition
 * Manages fade-to-black transitions between overworld and interior scenes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneTransition = void 0;
class SceneTransition {
    constructor() {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'idle'
        });
        Object.defineProperty(this, "progress", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // 0-1
        Object.defineProperty(this, "currentScene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'overworld'
        });
        Object.defineProperty(this, "targetScene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'overworld'
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                fadeDuration: 400,
                holdDuration: 100,
            }
        });
        Object.defineProperty(this, "onSceneChange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "onTransitionComplete", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "elapsedTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    /**
     * Start a transition to a new scene
     */
    startTransition(toScene, onSceneChange, onComplete) {
        if (this.state !== 'idle')
            return; // Already transitioning
        this.targetScene = toScene;
        this.state = 'fading-out';
        this.progress = 0;
        this.elapsedTime = 0;
        this.onSceneChange = onSceneChange || null;
        this.onTransitionComplete = onComplete || null;
    }
    /**
     * Update transition state
     */
    update(dt) {
        if (this.state === 'idle')
            return;
        this.elapsedTime += dt;
        // Guard against division by zero
        const fadeDuration = Math.max(1, this.config.fadeDuration);
        if (this.state === 'fading-out') {
            this.progress = Math.min(1, this.elapsedTime / fadeDuration);
            if (this.progress >= 1) {
                // Fade out complete - switch scene
                this.currentScene = this.targetScene;
                // Safely invoke callback (don't let exceptions lock state machine)
                try {
                    this.onSceneChange?.();
                }
                catch (e) {
                    console.error('SceneTransition onSceneChange callback failed:', e);
                }
                // Start hold then fade in
                this.state = 'fading-in';
                this.elapsedTime = -this.config.holdDuration; // Negative to add hold time
                this.progress = 1;
            }
        }
        else if (this.state === 'fading-in') {
            if (this.elapsedTime < 0) {
                // Still holding at black
                this.progress = 1;
            }
            else {
                this.progress = Math.max(0, 1 - this.elapsedTime / fadeDuration);
                if (this.progress <= 0) {
                    // Transition complete
                    this.state = 'idle';
                    this.progress = 0;
                    // Safely invoke callback
                    try {
                        this.onTransitionComplete?.();
                    }
                    catch (e) {
                        console.error('SceneTransition onTransitionComplete callback failed:', e);
                    }
                    this.onSceneChange = null;
                    this.onTransitionComplete = null;
                }
            }
        }
    }
    /**
     * Render transition overlay
     */
    render(ctx) {
        if (this.state === 'idle' || this.progress <= 0)
            return;
        ctx.save();
        // Full screen black overlay with alpha based on progress
        ctx.fillStyle = `rgba(0, 0, 0, ${this.progress})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Optional: Loading text when fully black
        if (this.progress > 0.9) {
            ctx.fillStyle = `rgba(255, 255, 255, ${(this.progress - 0.9) * 10})`;
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const text = this.targetScene === 'interior' ? 'Entering...' : 'Exiting...';
            ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2);
        }
        ctx.restore();
    }
    /**
     * Check if currently transitioning
     */
    isTransitioning() {
        return this.state !== 'idle';
    }
    /**
     * Get current scene type
     */
    getCurrentScene() {
        return this.currentScene;
    }
    /**
     * Get transition progress (0-1)
     */
    getProgress() {
        return this.progress;
    }
    /**
     * Get current state
     */
    getState() {
        return this.state;
    }
    /**
     * Force set scene without transition (for initialization)
     */
    setScene(scene) {
        this.currentScene = scene;
        this.targetScene = scene;
        this.state = 'idle';
        this.progress = 0;
    }
    /**
     * Configure transition timing
     */
    setConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
exports.SceneTransition = SceneTransition;
