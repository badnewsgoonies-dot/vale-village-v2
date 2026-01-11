"use strict";
/**
 * ProximitySystem
 * Detects player proximity to interactive elements (doors, NPCs)
 * Manages door markers and interaction prompts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProximitySystem = void 0;
class ProximitySystem {
    constructor() {
        Object.defineProperty(this, "zones", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "tileSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 32
        });
        Object.defineProperty(this, "interactionRadius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 48
        }); // Pixels - about 1.5 tiles
        Object.defineProperty(this, "currentNearestZone", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "pulsePhase", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    setTileSize(size) {
        this.tileSize = size;
    }
    setInteractionRadius(radius) {
        this.interactionRadius = radius;
    }
    /**
     * Extract interactive zones from map data
     */
    setMapData(map) {
        this.zones = [];
        // Find door tiles and triggers
        for (let y = 0; y < map.height; y++) {
            const row = map.tiles[y];
            if (!row)
                continue;
            for (let x = 0; x < map.width; x++) {
                const tile = row[x];
                if (!tile)
                    continue;
                if (tile.type === 'door') {
                    this.zones.push({
                        id: `door-${x}-${y}`,
                        type: 'door',
                        worldPos: {
                            x: x * this.tileSize + this.tileSize / 2,
                            y: y * this.tileSize + this.tileSize / 2,
                        },
                        radius: this.interactionRadius,
                        triggerId: tile.triggerId,
                        label: 'Press SPACE to enter',
                    });
                }
            }
        }
        // Add trigger zones
        for (const trigger of map.triggers) {
            if (trigger.type === 'transition' || trigger.type === 'shop' || trigger.type === 'tower') {
                this.zones.push({
                    id: trigger.id,
                    type: 'trigger',
                    worldPos: {
                        x: trigger.position.x * this.tileSize + this.tileSize / 2,
                        y: trigger.position.y * this.tileSize + this.tileSize / 2,
                    },
                    radius: this.interactionRadius,
                    triggerId: trigger.id,
                    label: this.getLabelForTrigger(trigger),
                });
            }
        }
        // Add NPC zones
        for (const npc of map.npcs) {
            this.zones.push({
                id: npc.id,
                type: 'npc',
                worldPos: {
                    x: npc.position.x * this.tileSize + this.tileSize / 2,
                    y: npc.position.y * this.tileSize + this.tileSize / 2,
                },
                radius: this.interactionRadius * 0.8,
                label: `Talk to ${npc.name}`,
            });
        }
    }
    getLabelForTrigger(trigger) {
        switch (trigger.type) {
            case 'transition':
                return 'Press SPACE to enter';
            case 'shop':
                return 'Press SPACE to browse';
            case 'tower':
                return 'Press SPACE to enter tower';
            default:
                return 'Press SPACE';
        }
    }
    /**
     * Check player proximity to all zones
     */
    checkProximity(playerPos) {
        let nearest = null;
        let nearestDist = Infinity;
        for (const zone of this.zones) {
            const dx = playerPos.x - zone.worldPos.x;
            const dy = playerPos.y - zone.worldPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < zone.radius && dist < nearestDist) {
                nearest = zone;
                nearestDist = dist;
            }
        }
        this.currentNearestZone = nearest;
        return {
            zone: nearest,
            distance: nearestDist,
            canInteract: nearest !== null,
        };
    }
    /**
     * Get the current nearest interactive zone (if any)
     */
    getNearestZone() {
        return this.currentNearestZone;
    }
    /**
     * Check if player can interact with something
     */
    canInteract() {
        return this.currentNearestZone !== null;
    }
    /**
     * Update animation phase for pulse effect
     */
    update(dt) {
        this.pulsePhase += dt * 0.004; // ~4 cycles per second
        if (this.pulsePhase > Math.PI * 2) {
            this.pulsePhase -= Math.PI * 2;
        }
    }
    /**
     * Render door markers and interaction prompts
     */
    render(ctx, camera) {
        for (const zone of this.zones) {
            if (zone.type === 'door' || zone.type === 'trigger') {
                this.renderDoorMarker(ctx, camera, zone);
            }
        }
        // Render interaction prompt for current nearest zone
        if (this.currentNearestZone) {
            this.renderInteractionPrompt(ctx, camera, this.currentNearestZone);
        }
    }
    renderDoorMarker(ctx, camera, zone) {
        const screenPos = camera.worldToScreen(zone.worldPos.x, zone.worldPos.y);
        // Calculate pulse animation
        const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.15;
        const pulseAlpha = 0.4 + Math.sin(this.pulsePhase) * 0.2;
        ctx.save();
        // Outer glow
        const glowSize = 24 * pulseScale;
        const gradient = ctx.createRadialGradient(screenPos.x, screenPos.y - 16, 0, screenPos.x, screenPos.y - 16, glowSize);
        gradient.addColorStop(0, `rgba(255, 215, 127, ${pulseAlpha})`);
        gradient.addColorStop(0.5, `rgba(255, 215, 127, ${pulseAlpha * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 215, 127, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y - 16, glowSize, 0, Math.PI * 2);
        ctx.fill();
        // Inner marker ring
        ctx.strokeStyle = `rgba(255, 215, 127, ${0.6 + Math.sin(this.pulsePhase) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y - 16, 8 * pulseScale, 0, Math.PI * 2);
        ctx.stroke();
        // Center dot
        ctx.fillStyle = `rgba(255, 240, 200, ${0.8})`;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y - 16, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    renderInteractionPrompt(ctx, camera, zone) {
        const screenPos = camera.worldToScreen(zone.worldPos.x, zone.worldPos.y);
        const text = zone.label || 'Press SPACE';
        ctx.save();
        // Calculate bob animation
        const bobOffset = Math.sin(this.pulsePhase * 1.5) * 3;
        // Prompt background
        const textWidth = ctx.measureText(text).width || 100;
        const padding = 8;
        const bgX = screenPos.x - textWidth / 2 - padding;
        const bgY = screenPos.y - 60 + bobOffset;
        const bgWidth = textWidth + padding * 2;
        const bgHeight = 24;
        // Background with rounded corners
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 4);
        ctx.fill();
        // Border
        ctx.strokeStyle = 'rgba(255, 215, 127, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Text
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, screenPos.x, bgY + bgHeight / 2);
        // Arrow pointing down
        ctx.fillStyle = 'rgba(255, 215, 127, 0.9)';
        ctx.beginPath();
        ctx.moveTo(screenPos.x - 6, bgY + bgHeight);
        ctx.lineTo(screenPos.x + 6, bgY + bgHeight);
        ctx.lineTo(screenPos.x, bgY + bgHeight + 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    /**
     * Get current interaction zone (for triggering actions)
     */
    getCurrentInteractionZone() {
        return this.currentNearestZone;
    }
    /**
     * Get all zones (for debugging)
     */
    getAllZones() {
        return [...this.zones];
    }
}
exports.ProximitySystem = ProximitySystem;
