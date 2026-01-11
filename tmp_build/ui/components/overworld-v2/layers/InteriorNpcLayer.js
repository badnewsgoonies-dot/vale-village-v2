"use strict";
/**
 * InteriorNpcLayer
 * Renders a single NPC inside interior scenes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteriorNpcLayer = void 0;
const loader_1 = require("../../../sprites/loader");
const overworldSprites_1 = require("../../../sprites/mappings/overworldSprites");
const DEFAULT_NPC_WIDTH = 32;
const DEFAULT_NPC_HEIGHT = 48;
class InteriorNpcLayer {
    constructor(npc, dimensions = {}) {
        Object.defineProperty(this, "zIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2
        });
        Object.defineProperty(this, "npc", {
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
        this.npc = { ...npc };
        this.width = dimensions.width ?? DEFAULT_NPC_WIDTH;
        this.height = dimensions.height ?? DEFAULT_NPC_HEIGHT;
        this.preloadSprite();
    }
    preloadSprite() {
        const spritePath = (0, overworldSprites_1.getNPCSprite)(this.npc.id);
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
    getPosition() {
        return { x: this.npc.x, y: this.npc.y };
    }
    render(ctx, camera) {
        const { x: worldX, y: worldY } = this.npc;
        const { x: screenX, y: screenY } = camera.worldToScreenSnapped(worldX, worldY);
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 4, this.width * 0.4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        const spritePath = (0, overworldSprites_1.getNPCSprite)(this.npc.id);
        this.loadSpriteAsync(spritePath);
        const sprite = this.spriteCache.get(spritePath);
        if (!sprite) {
            ctx.save();
            ctx.fillStyle = 'rgba(220, 100, 100, 0.6)';
            ctx.fillRect(screenX - this.width / 2, screenY - this.height, this.width, this.height);
            ctx.restore();
            return;
        }
        ctx.drawImage(sprite, screenX - this.width / 2, screenY - this.height, this.width, this.height);
    }
}
exports.InteriorNpcLayer = InteriorNpcLayer;
