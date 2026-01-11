"use strict";
/**
 * EntityLayer
 * Renders all Y-sorted entities: buildings, trees, NPCs, player
 * Handles shadow rendering and depth-based occlusion
 *
 * Supports two building modes:
 * 1. Tile-based: Auto-generated from wall tiles in map data
 * 2. Scene-based: Explicit world positions for curated layouts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityLayer = void 0;
const loader_1 = require("../../../sprites/loader");
class EntityLayer {
    constructor() {
        Object.defineProperty(this, "zIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
        Object.defineProperty(this, "entities", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "playerEntity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "tileSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 32
        });
        Object.defineProperty(this, "timeOfDay", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.5
        });
        Object.defineProperty(this, "elapsedTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // For animations
        // Scene-based buildings (pseudo-3D layout)
        Object.defineProperty(this, "sceneBuildings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "useSceneMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // Player proximity state for door glow and ENTER prompt
        Object.defineProperty(this, "nearbyBuildingId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "PROXIMITY_THRESHOLD", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 70
        });
        // Sprite cache
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
    }
    setTileSize(size) {
        this.tileSize = size;
    }
    setTimeOfDay(time) {
        this.timeOfDay = time;
    }
    /**
     * Set scene buildings for pseudo-3D layout (replaces tile-based buildings)
     * Buildings at varied Y positions create depth illusion (higher Y = closer to viewer)
     */
    setSceneBuildings(buildings) {
        this.sceneBuildings = buildings;
        this.useSceneMode = buildings.length > 0;
        // Load all building sprites
        for (const building of buildings) {
            this.loadSpriteAsync(building.spritePath);
        }
        // Convert scene buildings to entities if in scene mode
        if (this.useSceneMode) {
            // Remove tile-based buildings
            this.entities = this.entities.filter(e => e.type !== 'building');
            // Add scene buildings as entities
            for (const building of buildings) {
                this.entities.push(this.createSceneBuildingEntity(building));
            }
            this.sortEntities();
        }
    }
    /**
     * Get scene buildings (for proximity system)
     */
    getSceneBuildings() {
        return this.sceneBuildings;
    }
    /**
     * Check if in scene mode
     */
    isSceneMode() {
        return this.useSceneMode;
    }
    /**
     * Update nearby building for door glow and ENTER prompt
     * Uses world-space distance to the building's door position.
     */
    updatePlayerProximity(playerPos) {
        this.nearbyBuildingId = null;
        let closestDistanceSq = this.PROXIMITY_THRESHOLD * this.PROXIMITY_THRESHOLD;
        for (const building of this.sceneBuildings) {
            const doorX = building.x + (building.doorOffsetX ?? 0);
            const doorY = building.y + (building.doorOffsetY ?? 0);
            const dx = playerPos.x - doorX;
            const dy = playerPos.y - doorY;
            const distanceSq = dx * dx + dy * dy;
            if (distanceSq <= closestDistanceSq) {
                closestDistanceSq = distanceSq;
                this.nearbyBuildingId = building.id;
            }
        }
    }
    /**
     * Get the building the player is near (for interaction)
     */
    getNearbyBuilding() {
        if (!this.nearbyBuildingId)
            return null;
        return this.sceneBuildings.find(b => b.id === this.nearbyBuildingId) || null;
    }
    createSceneBuildingEntity(building) {
        return {
            type: 'building',
            id: building.id,
            x: building.x,
            y: building.y,
            width: building.width,
            height: building.height,
            spriteId: building.spritePath,
            sprite: null,
            shadowWidth: building.width * 0.6,
            shadowHeight: 10,
        };
    }
    /**
     * Populate entities from map data
     */
    setMapData(map) {
        this.entities = [];
        // Add buildings from wall/door tiles (skip if in scene mode)
        if (!this.useSceneMode) {
            this.addBuildingsFromMap(map);
        }
        else {
            // Re-add scene buildings
            for (const building of this.sceneBuildings) {
                this.entities.push(this.createSceneBuildingEntity(building));
            }
        }
        // Add trees and scenery
        this.addSceneryFromMap(map);
        // Add NPCs
        for (const npc of map.npcs) {
            this.entities.push(this.createNPCEntity(npc));
        }
        // Sort entities by Y for initial order
        this.sortEntities();
    }
    addBuildingsFromMap(map) {
        // Find clusters of wall tiles that form buildings
        const visited = new Set();
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.tiles[y]?.[x];
                const key = `${x},${y}`;
                if (tile?.type === 'wall' && !visited.has(key)) {
                    // Find building bounds
                    const bounds = this.findBuildingBounds(map, x, y, visited);
                    if (bounds.width > 1 || bounds.height > 1) {
                        this.entities.push(this.createBuildingEntity(bounds, map, x, y));
                    }
                }
            }
        }
    }
    findBuildingBounds(map, startX, startY, visited) {
        let maxX = startX;
        let maxY = startY;
        // Flood fill to find connected wall tiles
        const queue = [{ x: startX, y: startY }];
        while (queue.length > 0) {
            const { x, y } = queue.shift();
            const key = `${x},${y}`;
            if (visited.has(key))
                continue;
            if (x < 0 || x >= map.width || y < 0 || y >= map.height)
                continue;
            const tile = map.tiles[y]?.[x];
            if (tile?.type !== 'wall' && tile?.type !== 'door')
                continue;
            visited.add(key);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            // Check neighbors
            queue.push({ x: x + 1, y });
            queue.push({ x: x - 1, y });
            queue.push({ x, y: y + 1 });
            queue.push({ x, y: y - 1 });
        }
        return {
            x: startX,
            y: startY,
            width: maxX - startX + 1,
            height: maxY - startY + 1,
        };
    }
    createBuildingEntity(bounds, map, _tileX, _tileY) {
        let spriteId = this.findBuildingSpriteId(map, bounds);
        const pixelWidth = bounds.width * this.tileSize;
        const worldX = bounds.x * this.tileSize + pixelWidth / 2;
        const worldY = bounds.y * this.tileSize;
        const pixelHeight = bounds.height * this.tileSize;
        // If no sprite specified, pick a Vale building based on position
        if (!spriteId) {
            const buildingIndex = ((bounds.x + bounds.y) % 8) + 1;
            spriteId = `/sprites/buildings/Vale/Vale_Building${buildingIndex}.gif`;
        }
        this.loadSpriteAsync(spriteId);
        // Find door tile for trigger lookup
        let triggerId;
        for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
            for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
                const tile = map.tiles[y]?.[x];
                if (tile?.type === 'door' && tile.triggerId) {
                    triggerId = tile.triggerId;
                    break;
                }
            }
            if (triggerId)
                break;
        }
        return {
            type: 'building',
            id: `building-${bounds.x}-${bounds.y}`,
            x: worldX,
            y: worldY + pixelHeight, // Y position at bottom for sorting
            width: pixelWidth,
            height: pixelHeight * 1.5, // Buildings are taller than their footprint
            spriteId,
            sprite: null,
            shadowWidth: pixelWidth * 0.8,
            shadowHeight: 8,
        };
    }
    findBuildingSpriteId(map, bounds) {
        for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
            for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
                const tile = map.tiles[y]?.[x];
                if (tile?.spriteId) {
                    return tile.spriteId;
                }
            }
        }
        return null;
    }
    addSceneryFromMap(map) {
        // Add procedural trees/scenery based on grass tiles
        // (In a real implementation, this would come from map data)
        const treeChance = 0.04;
        const shrubChance = 0.06;
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.tiles[y]?.[x];
                if (tile?.type === 'grass' && tile.walkable) {
                    const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
                    const random = seed - Math.floor(seed);
                    if (random < treeChance) {
                        this.entities.push(this.createTreeEntity(x, y, random));
                    }
                    else if (random < treeChance + shrubChance) {
                        this.entities.push(this.createShrubEntity(x, y, random));
                    }
                }
            }
        }
    }
    createTreeEntity(tileX, tileY, seed) {
        const worldX = tileX * this.tileSize + this.tileSize / 2;
        const worldY = tileY * this.tileSize + this.tileSize;
        // Pick a tree sprite based on position seed (Tree1-Tree12 available)
        const treeIndex = Math.floor(seed * 12) + 1;
        const spriteId = `/sprites/scenery/plants/Tree${treeIndex}.gif`;
        // Load the sprite async
        this.loadSpriteAsync(spriteId);
        return {
            type: 'tree',
            id: `tree-${tileX}-${tileY}`,
            x: worldX,
            y: worldY,
            width: 32 + seed * 16,
            height: 64 + seed * 24,
            spriteId,
            sprite: null,
            shadowWidth: 24,
            shadowHeight: 8,
            swayAmount: 1 + seed,
            animOffset: seed * 1000,
        };
    }
    createShrubEntity(tileX, tileY, seed) {
        const worldX = tileX * this.tileSize + this.tileSize / 2;
        const worldY = tileY * this.tileSize + this.tileSize;
        // Pick a shrub/bush sprite (Bush, Bush2, Bush3, Shrub1, etc.)
        const shrubTypes = ['Bush', 'Bush2', 'Bush3', 'Shrub1', 'Flowers'];
        const shrubIndex = Math.floor(seed * 100) % shrubTypes.length;
        const spriteId = `/sprites/scenery/plants/${shrubTypes[shrubIndex]}.gif`;
        // Load the sprite async
        this.loadSpriteAsync(spriteId);
        return {
            type: 'decoration',
            id: `shrub-${tileX}-${tileY}`,
            x: worldX,
            y: worldY,
            width: 20 + seed * 8,
            height: 16 + seed * 8,
            spriteId,
            sprite: null,
            shadowWidth: 16,
            shadowHeight: 4,
        };
    }
    createNPCEntity(npc) {
        const worldX = npc.position.x * this.tileSize + this.tileSize / 2;
        const worldY = npc.position.y * this.tileSize + this.tileSize;
        // Load NPC sprite async
        this.loadSpriteAsync(npc.spriteId);
        return {
            type: 'npc',
            id: npc.id,
            x: worldX,
            y: worldY,
            width: 28,
            height: 40,
            spriteId: npc.spriteId,
            sprite: null,
            shadowWidth: 20,
            shadowHeight: 5,
        };
    }
    /**
     * Update or create player entity
     */
    setPlayerPosition(pos, facing, unitId) {
        const spriteId = `player-${unitId}-${facing}`;
        // Load sprite async
        this.loadSpriteAsync(spriteId);
        if (this.playerEntity) {
            this.playerEntity.x = pos.x;
            this.playerEntity.y = pos.y;
            this.playerEntity.spriteId = spriteId;
        }
        else {
            this.playerEntity = {
                type: 'player',
                id: 'player',
                x: pos.x,
                y: pos.y,
                width: 28,
                height: 40,
                spriteId,
                sprite: null,
                shadowWidth: 18,
                shadowHeight: 5,
            };
        }
    }
    async loadSpriteAsync(spriteId) {
        if (this.spriteCache.has(spriteId) || this.loadingSprites.has(spriteId)) {
            return;
        }
        this.loadingSprites.add(spriteId);
        try {
            const sprite = await (0, loader_1.loadSprite)(spriteId);
            this.spriteCache.set(spriteId, sprite);
        }
        catch (e) {
            // Use placeholder on error
        }
        finally {
            this.loadingSprites.delete(spriteId);
        }
    }
    getSprite(spriteId) {
        return this.spriteCache.get(spriteId) || null;
    }
    sortEntities() {
        this.entities.sort((a, b) => a.y - b.y);
    }
    /**
     * Golden Sun–style depth scaling.
     * Lower on-screen entities (higher worldY) appear slightly larger.
     */
    /**
     * Update method (called each frame)
     */
    update(dt) {
        this.elapsedTime += dt;
        // Update proximity if in scene mode and player exists
        if (this.useSceneMode && this.playerEntity) {
            this.updatePlayerProximity({ x: this.playerEntity.x, y: this.playerEntity.y });
        }
    }
    render(ctx, camera) {
        // Combine all entities for Y-sorting
        const allEntities = [...this.entities];
        if (this.playerEntity) {
            allEntities.push(this.playerEntity);
        }
        // Sort by Y position (entities with lower Y render first / behind)
        allEntities.sort((a, b) => a.y - b.y);
        // Render each entity
        for (const entity of allEntities) {
            // Regular camera-transformed entities
            // Skip if not visible
            if (!camera.isVisible(entity.x - entity.width / 2, entity.y - entity.height, entity.width, entity.height)) {
                continue;
            }
            const screenPos = camera.worldToScreen(entity.x, entity.y);
            // Draw shadow first
            const scale = 1;
            this.drawShadow(ctx, screenPos, entity, scale);
            // Draw entity
            this.drawEntity(ctx, screenPos, entity, scale);
            if (entity.type === 'building' && entity.id === this.nearbyBuildingId) {
                this.drawDoorGlow(ctx, screenPos.x, screenPos.y, entity);
                this.drawEnterPrompt(ctx, screenPos.x, screenPos.y, entity);
            }
        }
        // Draw night window glow
        if (this.isNight()) {
            this.drawWindowGlow(ctx, camera, allEntities);
        }
    }
    drawDoorGlow(ctx, centerX, bottomY, _entity) {
        ctx.save();
        // Animated glow intensity: 0.3 + sin(time*2) * 0.2
        const time = this.elapsedTime * 0.001; // Convert to seconds
        const glowIntensity = 0.3 + Math.sin(time * 2) * 0.2;
        // Door position (center bottom of building)
        const doorX = centerX - 15;
        const doorY = bottomY - 40;
        const doorW = 30;
        const doorH = 40;
        ctx.fillStyle = `rgba(255, 220, 100, ${glowIntensity})`;
        ctx.fillRect(doorX, doorY, doorW, doorH);
        ctx.restore();
    }
    drawEnterPrompt(ctx, centerX, bottomY, entity) {
        ctx.save();
        const y = bottomY - entity.height - 10;
        // Background pill
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        const textWidth = 50;
        ctx.beginPath();
        ctx.roundRect(centerX - textWidth / 2 - 8, y - 8, textWidth + 16, 20, 4);
        ctx.fill();
        // Text
        ctx.fillStyle = '#fff';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ENTER', centerX, y);
        ctx.restore();
    }
    drawShadow(ctx, pos, entity, scale) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y + 2, (entity.shadowWidth * scale) / 2, (entity.shadowHeight * scale) / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    drawEntity(ctx, pos, entity, scale) {
        const sprite = this.getSprite(entity.spriteId);
        // Calculate sway offset for trees
        let swayX = 0;
        if (entity.swayAmount && entity.animOffset !== undefined) {
            swayX = Math.sin(Date.now() * 0.001 + entity.animOffset) * entity.swayAmount;
        }
        const scaledWidth = entity.width * scale;
        const scaledHeight = entity.height * scale;
        const scaledSwayX = swayX * scale;
        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            // Draw actual sprite
            ctx.drawImage(sprite, pos.x - scaledWidth / 2 + scaledSwayX, pos.y - scaledHeight, scaledWidth, scaledHeight);
        }
        else {
            // Draw placeholder based on entity type
            this.drawPlaceholder(ctx, pos, entity, scaledSwayX, scale);
        }
    }
    drawPlaceholder(ctx, pos, entity, swayX, scale) {
        ctx.save();
        const isNight = this.isNight();
        const width = entity.width * scale;
        const height = entity.height * scale;
        const x = pos.x - width / 2 + swayX;
        const y = pos.y - height;
        switch (entity.type) {
            case 'player':
                // Blue character placeholder
                ctx.fillStyle = isNight ? '#2a5a8a' : '#3498db';
                ctx.fillRect(x, y, width, height);
                // Head
                ctx.fillStyle = isNight ? '#b8a090' : '#f5d5c8';
                ctx.fillRect(x + 4 * scale, y + 2 * scale, width - 8 * scale, 12 * scale);
                break;
            case 'npc':
                // Green/brown character placeholder
                ctx.fillStyle = isNight ? '#4a6a4a' : '#7a9a7a';
                ctx.fillRect(x, y, width, height);
                // Head
                ctx.fillStyle = isNight ? '#a89080' : '#e5c5b8';
                ctx.fillRect(x + 4 * scale, y + 2 * scale, width - 8 * scale, 12 * scale);
                break;
            case 'building':
                // Building placeholder (tan/brown)
                const buildingGradient = ctx.createLinearGradient(x, y, x, y + height);
                if (isNight) {
                    buildingGradient.addColorStop(0, '#3a3530');
                    buildingGradient.addColorStop(1, '#2a2520');
                }
                else {
                    buildingGradient.addColorStop(0, '#d4a872');
                    buildingGradient.addColorStop(1, '#b48a62');
                }
                ctx.fillStyle = buildingGradient;
                ctx.fillRect(x, y, width, height);
                // Roof
                ctx.fillStyle = isNight ? '#4a3a3a' : '#8a5a4a';
                ctx.beginPath();
                ctx.moveTo(x - 5 * scale, y + 10 * scale);
                ctx.lineTo(x + width / 2, y - 15 * scale);
                ctx.lineTo(x + width + 5 * scale, y + 10 * scale);
                ctx.closePath();
                ctx.fill();
                // Door
                ctx.fillStyle = isNight ? '#2a2520' : '#5a4a3a';
                ctx.fillRect(x + width / 2 - 8 * scale, y + height - 25 * scale, 16 * scale, 25 * scale);
                // Window
                ctx.fillStyle = isNight ? '#4a5a6a' : '#8ac0e0';
                ctx.fillRect(x + 8 * scale, y + 20 * scale, 12 * scale, 12 * scale);
                if (width > 50 * scale) {
                    ctx.fillRect(x + width - 20 * scale, y + 20 * scale, 12 * scale, 12 * scale);
                }
                break;
            case 'tree':
                // Tree trunk
                ctx.fillStyle = isNight ? '#3a2a20' : '#6a4a3a';
                ctx.fillRect(x + width / 2 - 4 * scale, y + height * 0.4, 8 * scale, height * 0.6);
                // Tree foliage (multiple circles)
                ctx.fillStyle = isNight ? '#1a3a2a' : '#2a6a3a';
                const foliageY = y + height * 0.4;
                ctx.beginPath();
                ctx.arc(x + width / 2 - 8 * scale, foliageY, width * 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + width / 2 + 8 * scale, foliageY, width * 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + width / 2, foliageY - 10 * scale, width * 0.35, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'decoration':
                // Generic decoration (rock/bush)
                ctx.fillStyle = isNight ? '#3a4a3a' : '#5a7a5a';
                ctx.beginPath();
                ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 3, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        ctx.restore();
    }
    isNight() {
        return this.timeOfDay < 0.25 || this.timeOfDay > 0.80;
    }
    drawWindowGlow(ctx, camera, entities) {
        ctx.save();
        for (const entity of entities) {
            if (entity.type !== 'building')
                continue;
            const screenPos = camera.worldToScreen(entity.x, entity.y);
            const scale = 1;
            const width = entity.width * scale;
            const height = entity.height * scale;
            const x = screenPos.x - width / 2;
            const y = screenPos.y - height;
            // Window glow effect
            const glowGradient = ctx.createRadialGradient(x + 14 * scale, y + 26 * scale, 0, x + 14 * scale, y + 26 * scale, 15 * scale);
            glowGradient.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
            glowGradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
            ctx.fillStyle = glowGradient;
            ctx.fillRect(x, y + 14 * scale, 30 * scale, 24 * scale);
            if (width > 50 * scale) {
                const glowGradient2 = ctx.createRadialGradient(x + width - 14 * scale, y + 26 * scale, 0, x + width - 14 * scale, y + 26 * scale, 15 * scale);
                glowGradient2.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
                glowGradient2.addColorStop(1, 'rgba(255, 200, 100, 0)');
                ctx.fillStyle = glowGradient2;
                ctx.fillRect(x + width - 30 * scale, y + 14 * scale, 30 * scale, 24 * scale);
            }
        }
        ctx.restore();
    }
}
exports.EntityLayer = EntityLayer;
