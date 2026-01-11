"use strict";
/**
 * RoadLayer
 * Renders the black road band between Y=420-480 (world pixels)
 * This provides a visual foundation for buildings and player movement
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadLayer = void 0;
class RoadLayer {
    constructor() {
        Object.defineProperty(this, "zIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2
        }); // Between BackgroundLayer (1) and VillageLayer/TerrainLayer (3+)
        Object.defineProperty(this, "ROAD_Y_TOP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 420
        });
        Object.defineProperty(this, "ROAD_Y_BOTTOM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 480
        });
        Object.defineProperty(this, "ROAD_HEIGHT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.ROAD_Y_BOTTOM - this.ROAD_Y_TOP
        }); // 60px
    }
    render(ctx, camera) {
        const width = ctx.canvas.width;
        // Calculate world bounds visible in viewport
        const visibleBounds = camera.getVisibleBounds();
        const worldLeft = visibleBounds.left;
        const worldRight = visibleBounds.right;
        // Road spans the full world width, but we only render the visible portion
        const roadLeft = Math.max(0, worldLeft);
        const roadRight = worldRight;
        const roadWidth = roadRight - roadLeft;
        // Convert world Y to screen Y
        const screenPos = camera.worldToScreen(roadLeft, this.ROAD_Y_TOP);
        ctx.save();
        // Draw base road (dark gray/black band)
        const roadGradient = ctx.createLinearGradient(0, screenPos.y, 0, screenPos.y + this.ROAD_HEIGHT);
        roadGradient.addColorStop(0, '#2a2a2a'); // Slightly lighter at top (edge)
        roadGradient.addColorStop(0.15, '#1a1a1a'); // Dark in middle
        roadGradient.addColorStop(0.85, '#1a1a1a'); // Dark in middle
        roadGradient.addColorStop(1, '#2a2a2a'); // Slightly lighter at bottom (edge)
        ctx.fillStyle = roadGradient;
        ctx.fillRect(0, screenPos.y, width, this.ROAD_HEIGHT);
        // Add subtle texture (cobblestone-like pattern)
        this.drawTexture(ctx, screenPos.y, roadLeft, roadWidth);
        ctx.restore();
    }
    drawTexture(ctx, screenY, worldLeft, roadWidth) {
        // Add subtle noise/texture for cobblestone feel
        ctx.save();
        ctx.globalAlpha = 0.1;
        // Seed-based pseudo-random positions for consistent pattern
        const seed = 12345;
        const random = (x) => {
            const val = Math.sin(x * seed) * 10000;
            return val - Math.floor(val);
        };
        // Draw small rectangular "stones" across the road
        const stoneSize = 8;
        const spacing = 12;
        for (let x = Math.floor(worldLeft / spacing) * spacing; x < worldLeft + roadWidth; x += spacing) {
            for (let y = 0; y < this.ROAD_HEIGHT; y += spacing) {
                const offsetX = random(x * 7 + y * 13) * 4 - 2;
                const offsetY = random(x * 13 + y * 7) * 4 - 2;
                const brightness = Math.floor(random(x * 17 + y * 19) * 40 + 10);
                const screenX = x - worldLeft + offsetX;
                const stoneY = screenY + y + offsetY;
                ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
                ctx.fillRect(screenX, stoneY, stoneSize + random(x * 23 + y * 29) * 4, stoneSize + random(x * 29 + y * 23) * 4);
            }
        }
        ctx.restore();
    }
}
exports.RoadLayer = RoadLayer;
