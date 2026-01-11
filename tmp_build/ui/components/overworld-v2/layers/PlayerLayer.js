"use strict";
/**
 * PlayerLayer
 * Renders the player sprite in world pixels via camera offset.
 * Bottom-center anchored with 4-directional sprites and shadow.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerLayer = void 0;
const loader_1 = require("../../../sprites/loader");
const overworldSprites_1 = require("../../../sprites/mappings/overworldSprites");
const DEFAULT_PLAYER_WIDTH = 32;
const DEFAULT_PLAYER_HEIGHT = 48;
class PlayerLayer {
    constructor(initialState = {}, dimensions = {}) {
        Object.defineProperty(this, "zIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4
        });
        Object.defineProperty(this, "playerState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "spriteCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "loadingSprites", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** Whether to render the sprite image (default true). Set false if using DOM overlay. */
        Object.defineProperty(this, "shouldRenderSprite", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        this.playerState = {
            x: initialState.x ?? 200,
            y: initialState.y ?? 490, // Adjusted for new road position (460-520)
            facing: initialState.facing ?? 'down',
            unitId: initialState.unitId ?? 'adept',
            isMoving: initialState.isMoving ?? false,
        };
        this.width = dimensions.width ?? DEFAULT_PLAYER_WIDTH;
        this.height = dimensions.height ?? DEFAULT_PLAYER_HEIGHT;
        // Preload initial sprite
        this.preloadSprite(this.playerState.unitId, this.playerState.facing);
    }
    preloadSprite(unitId, direction) {
        const spritePath = (0, overworldSprites_1.getPlayerSprite)(unitId, direction);
        this.loadSpriteAsync(spritePath);
    }
    loadSpriteAsync(spritePath) {
        if (this.spriteCache.has(spritePath) || this.loadingSprites.has(spritePath))
            return;
        this.loadingSprites.add(spritePath);
        (0, loader_1.loadSprite)(spritePath)
            .then((img) => {
            this.spriteCache.set(spritePath, img);
        })
            .finally(() => {
            this.loadingSprites.delete(spritePath);
        });
    }
    /** Update player state from external source (engine/input system) */
    setPlayerState(state) {
        if (state.x !== undefined)
            this.playerState.x = state.x;
        if (state.y !== undefined)
            this.playerState.y = state.y;
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
        if (state.isMoving !== undefined)
            this.playerState.isMoving = state.isMoving;
    }
    getPlayerState() {
        return { ...this.playerState };
    }
    /** Get player world position (for camera targeting) */
    getPosition() {
        return { x: this.playerState.x, y: this.playerState.y };
    }
    render(ctx, camera) {
        const { x: worldX, y: worldY, facing, unitId } = this.playerState;
        const { x: screenX, y: screenY } = camera.worldToScreenSnapped(worldX, worldY);
        // Shadow on the ground (ellipse below feet)
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 4, this.width * 0.4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (!this.shouldRenderSprite)
            return;
        // Get sprite for current direction
        const spritePath = (0, overworldSprites_1.getPlayerSprite)(unitId, facing);
        this.loadSpriteAsync(spritePath);
        const sprite = this.spriteCache.get(spritePath);
        if (!sprite) {
            // Placeholder rectangle until sprite loads
            ctx.save();
            ctx.fillStyle = 'rgba(100, 150, 255, 0.6)';
            ctx.fillRect(screenX - this.width / 2, screenY - this.height, this.width, this.height);
            ctx.restore();
            return;
        }
        // Handle sprite mirroring for left-facing
        const mirror = (0, overworldSprites_1.shouldMirrorSprite)(facing);
        ctx.save();
        if (mirror) {
            // Flip horizontally around sprite center
            ctx.translate(screenX, screenY);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, -this.width / 2, -this.height, this.width, this.height);
        }
        else {
            // Normal bottom-center anchored draw
            ctx.drawImage(sprite, screenX - this.width / 2, screenY - this.height, this.width, this.height);
        }
        ctx.restore();
    }
}
exports.PlayerLayer = PlayerLayer;
