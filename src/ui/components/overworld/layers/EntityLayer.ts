/**
 * EntityLayer
 * Renders all Y-sorted entities: buildings, trees, NPCs, player
 * Handles shadow rendering and depth-based occlusion
 *
 * Supports two building modes:
 * 1. Tile-based: Auto-generated from wall tiles in map data
 * 2. Scene-based: Explicit screen positions for pseudo-3D depth illusion
 */

import type { Layer, Camera, Entity, Direction, WorldPosition } from '../engine/types';
import type { GameMap, NPC } from '../../../../data/schemas/mapSchema';
import { loadSprite } from '../../../sprites/loader';

/** Scene building definition for pseudo-3D layout */
export interface SceneBuilding {
  id: string;
  spritePath: string;
  x: number;
  y: number;
  width: number;
  height: number;
  triggerId?: string;
  doorOffsetX?: number; // Door X offset from building center (default: 0)
  doorOffsetY?: number; // Door Y offset from building bottom (default: 0)
}

interface RenderableEntity extends Entity {
  sprite: HTMLImageElement | null;
  shadowWidth: number;
  shadowHeight: number;
  isSceneBuilding?: boolean; // True for scene-based buildings (absolute positioning)
}

export class EntityLayer implements Layer {
  zIndex = 3;

  private entities: RenderableEntity[] = [];
  private playerEntity: RenderableEntity | null = null;
  private tileSize: number = 32;
  private timeOfDay: number = 0.5;
  private elapsedTime: number = 0; // For animations

  // Scene-based buildings (pseudo-3D layout)
  private sceneBuildings: SceneBuilding[] = [];
  private useSceneMode: boolean = false;

  // Player proximity state for door glow and ENTER prompt
  private nearbyBuildingId: string | null = null;
  private readonly PROXIMITY_THRESHOLD = 80;

  // Sprite cache
  private spriteCache: Map<string, HTMLImageElement> = new Map();
  private loadingSprites: Set<string> = new Set();

  setTileSize(size: number): void {
    this.tileSize = size;
  }

  setTimeOfDay(time: number): void {
    this.timeOfDay = time;
  }

  /**
   * Set scene buildings for pseudo-3D layout (replaces tile-based buildings)
   * Buildings at varied Y positions create depth illusion (higher Y = closer to viewer)
   */
  setSceneBuildings(buildings: SceneBuilding[]): void {
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
  getSceneBuildings(): SceneBuilding[] {
    return this.sceneBuildings;
  }

  /**
   * Check if in scene mode
   */
  isSceneMode(): boolean {
    return this.useSceneMode;
  }

  /**
   * Update nearby building for door glow and ENTER prompt
   */
  updatePlayerProximity(playerPos: WorldPosition): void {
    this.nearbyBuildingId = null;

    for (const building of this.sceneBuildings) {
      // Calculate distance to building center
      const buildingCenterX = building.x + building.width / 2;
      const buildingCenterY = building.y + building.height / 2;
      const dx = playerPos.x - buildingCenterX;
      const dy = playerPos.y - buildingCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.PROXIMITY_THRESHOLD) {
        this.nearbyBuildingId = building.id;
        break;
      }
    }
  }

  /**
   * Get the building the player is near (for interaction)
   */
  getNearbyBuilding(): SceneBuilding | null {
    if (!this.nearbyBuildingId) return null;
    return this.sceneBuildings.find(b => b.id === this.nearbyBuildingId) || null;
  }

  private createSceneBuildingEntity(building: SceneBuilding): RenderableEntity {
    return {
      type: 'building',
      id: building.id,
      x: building.x + building.width / 2, // Center X for rendering
      y: building.y + building.height, // Bottom Y for Y-sorting
      width: building.width,
      height: building.height,
      spriteId: building.spritePath,
      sprite: null,
      shadowWidth: building.width * 0.6,
      shadowHeight: 10,
      isSceneBuilding: true,
    };
  }

  /**
   * Populate entities from map data
   */
  setMapData(map: GameMap): void {
    this.entities = [];

    // Add buildings from wall/door tiles (skip if in scene mode)
    if (!this.useSceneMode) {
      this.addBuildingsFromMap(map);
    } else {
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

  private addBuildingsFromMap(map: GameMap): void {
    // Find clusters of wall tiles that form buildings
    const visited = new Set<string>();

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

  private findBuildingBounds(
    map: GameMap,
    startX: number,
    startY: number,
    visited: Set<string>
  ): { x: number; y: number; width: number; height: number } {
    let maxX = startX;
    let maxY = startY;

    // Flood fill to find connected wall tiles
    const queue: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];

    while (queue.length > 0) {
      const { x, y } = queue.shift()!;
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      if (x < 0 || x >= map.width || y < 0 || y >= map.height) continue;

      const tile = map.tiles[y]?.[x];
      if (tile?.type !== 'wall' && tile?.type !== 'door') continue;

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

  private createBuildingEntity(
    bounds: { x: number; y: number; width: number; height: number },
    map: GameMap,
    _tileX: number,
    _tileY: number
  ): RenderableEntity {
    let spriteId = this.findBuildingSpriteId(map, bounds);
    const worldX = bounds.x * this.tileSize;
    const worldY = bounds.y * this.tileSize;
    const pixelWidth = bounds.width * this.tileSize;
    const pixelHeight = bounds.height * this.tileSize;

    // If no sprite specified, pick a Vale building based on position
    if (!spriteId) {
      const buildingIndex = ((bounds.x + bounds.y) % 8) + 1;
      spriteId = `/sprites/buildings/Vale/Vale_Building${buildingIndex}.gif`;
    }

    this.loadSpriteAsync(spriteId);

    // Find door tile for trigger lookup
    let triggerId: string | undefined;
    for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
        const tile = map.tiles[y]?.[x];
        if (tile?.type === 'door' && tile.triggerId) {
          triggerId = tile.triggerId;
          break;
        }
      }
      if (triggerId) break;
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

  private findBuildingSpriteId(
    map: GameMap,
    bounds: { x: number; y: number; width: number; height: number }
  ): string | null {
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

  private addSceneryFromMap(map: GameMap): void {
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
          } else if (random < treeChance + shrubChance) {
            this.entities.push(this.createShrubEntity(x, y, random));
          }
        }
      }
    }
  }

  private createTreeEntity(tileX: number, tileY: number, seed: number): RenderableEntity {
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

  private createShrubEntity(tileX: number, tileY: number, seed: number): RenderableEntity {
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

  private createNPCEntity(npc: NPC): RenderableEntity {
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
  setPlayerPosition(pos: WorldPosition, facing: Direction, unitId: string): void {
    const spriteId = `player-${unitId}-${facing}`;

    // Load sprite async
    this.loadSpriteAsync(spriteId);

    if (this.playerEntity) {
      this.playerEntity.x = pos.x;
      this.playerEntity.y = pos.y;
      this.playerEntity.spriteId = spriteId;
    } else {
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

  private async loadSpriteAsync(spriteId: string): Promise<void> {
    if (this.spriteCache.has(spriteId) || this.loadingSprites.has(spriteId)) {
      return;
    }

    this.loadingSprites.add(spriteId);

    try {
      const sprite = await loadSprite(spriteId);
      this.spriteCache.set(spriteId, sprite);
    } catch (e) {
      // Use placeholder on error
    } finally {
      this.loadingSprites.delete(spriteId);
    }
  }

  private getSprite(spriteId: string): HTMLImageElement | null {
    return this.spriteCache.get(spriteId) || null;
  }

  private sortEntities(): void {
    this.entities.sort((a, b) => a.y - b.y);
  }

  /**
   * Update method (called each frame)
   */
  update(dt: number): void {
    this.elapsedTime += dt;

    // Update proximity if in scene mode and player exists
    if (this.useSceneMode && this.playerEntity) {
      this.updatePlayerProximity({ x: this.playerEntity.x, y: this.playerEntity.y });
    }
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    // Combine all entities for Y-sorting
    const allEntities = [...this.entities];
    if (this.playerEntity) {
      allEntities.push(this.playerEntity);
    }

    // Sort by Y position (entities with lower Y render first / behind)
    allEntities.sort((a, b) => a.y - b.y);

    // Render each entity
    for (const entity of allEntities) {
      // For scene buildings, use absolute screen coordinates
      if (entity.isSceneBuilding) {
        // Scene buildings are in screen/scene coordinates already
        const screenX = entity.x;
        const screenY = entity.y;

        // Draw ellipse shadow
        this.drawSceneBuildingShadow(ctx, screenX, screenY, entity.width);

        // Draw building sprite
        this.drawSceneBuildingSprite(ctx, screenX, screenY, entity);

        // Draw door glow if player is near this building
        if (entity.id === this.nearbyBuildingId) {
          this.drawDoorGlow(ctx, screenX, screenY, entity);
          this.drawEnterPrompt(ctx, screenX, screenY, entity);
        }

        continue;
      }

      // Regular camera-transformed entities
      // Skip if not visible
      if (!camera.isVisible(entity.x - entity.width / 2, entity.y - entity.height, entity.width, entity.height)) {
        continue;
      }

      const screenPos = camera.worldToScreen(entity.x, entity.y);

      // Draw shadow first
      this.drawShadow(ctx, screenPos, entity);

      // Draw entity
      this.drawEntity(ctx, screenPos, entity);
    }

    // Draw night window glow
    if (this.isNight()) {
      this.drawWindowGlow(ctx, camera, allEntities);
    }
  }

  private drawSceneBuildingShadow(ctx: CanvasRenderingContext2D, centerX: number, bottomY: number, width: number): void {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX, bottomY + 5, width * 0.6 / 2, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawSceneBuildingSprite(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    bottomY: number,
    entity: RenderableEntity
  ): void {
    const sprite = this.getSprite(entity.spriteId);
    const x = centerX - entity.width / 2;
    const y = bottomY - entity.height;

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      ctx.drawImage(sprite, x, y, entity.width, entity.height);
    } else {
      // Placeholder
      this.drawBuildingPlaceholder(ctx, x, y, entity.width, entity.height);
    }
  }

  private drawBuildingPlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    ctx.save();
    const isNight = this.isNight();

    // Building body
    const gradient = ctx.createLinearGradient(x, y, x, y + h);
    if (isNight) {
      gradient.addColorStop(0, '#3a3530');
      gradient.addColorStop(1, '#2a2520');
    } else {
      gradient.addColorStop(0, '#d4a872');
      gradient.addColorStop(1, '#b48a62');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, h);

    // Roof
    ctx.fillStyle = isNight ? '#4a3a3a' : '#8a5a4a';
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 10);
    ctx.lineTo(x + w / 2, y - 15);
    ctx.lineTo(x + w + 5, y + 10);
    ctx.closePath();
    ctx.fill();

    // Door
    ctx.fillStyle = isNight ? '#2a2520' : '#5a4a3a';
    ctx.fillRect(x + w / 2 - 8, y + h - 25, 16, 25);

    // Window
    ctx.fillStyle = isNight ? '#4a5a6a' : '#8ac0e0';
    ctx.fillRect(x + 8, y + 20, 12, 12);
    if (w > 50) {
      ctx.fillRect(x + w - 20, y + 20, 12, 12);
    }

    ctx.restore();
  }

  private drawDoorGlow(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    bottomY: number,
    _entity: RenderableEntity
  ): void {
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

  private drawEnterPrompt(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    bottomY: number,
    entity: RenderableEntity
  ): void {
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

  private drawShadow(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }, entity: RenderableEntity): void {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(
      pos.x,
      pos.y + 2,
      entity.shadowWidth / 2,
      entity.shadowHeight / 2,
      0, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }

  private drawEntity(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }, entity: RenderableEntity): void {
    const sprite = this.getSprite(entity.spriteId);

    // Calculate sway offset for trees
    let swayX = 0;
    if (entity.swayAmount && entity.animOffset !== undefined) {
      swayX = Math.sin(Date.now() * 0.001 + entity.animOffset) * entity.swayAmount;
    }

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      // Draw actual sprite
      ctx.drawImage(
        sprite,
        pos.x - entity.width / 2 + swayX,
        pos.y - entity.height,
        entity.width,
        entity.height
      );
    } else {
      // Draw placeholder based on entity type
      this.drawPlaceholder(ctx, pos, entity, swayX);
    }
  }

  private drawPlaceholder(
    ctx: CanvasRenderingContext2D,
    pos: { x: number; y: number },
    entity: RenderableEntity,
    swayX: number
  ): void {
    ctx.save();

    const isNight = this.isNight();
    const x = pos.x - entity.width / 2 + swayX;
    const y = pos.y - entity.height;

    switch (entity.type) {
      case 'player':
        // Blue character placeholder
        ctx.fillStyle = isNight ? '#2a5a8a' : '#3498db';
        ctx.fillRect(x, y, entity.width, entity.height);

        // Head
        ctx.fillStyle = isNight ? '#b8a090' : '#f5d5c8';
        ctx.fillRect(x + 4, y + 2, entity.width - 8, 12);
        break;

      case 'npc':
        // Green/brown character placeholder
        ctx.fillStyle = isNight ? '#4a6a4a' : '#7a9a7a';
        ctx.fillRect(x, y, entity.width, entity.height);

        // Head
        ctx.fillStyle = isNight ? '#a89080' : '#e5c5b8';
        ctx.fillRect(x + 4, y + 2, entity.width - 8, 12);
        break;

      case 'building':
        // Building placeholder (tan/brown)
        const buildingGradient = ctx.createLinearGradient(x, y, x, y + entity.height);
        if (isNight) {
          buildingGradient.addColorStop(0, '#3a3530');
          buildingGradient.addColorStop(1, '#2a2520');
        } else {
          buildingGradient.addColorStop(0, '#d4a872');
          buildingGradient.addColorStop(1, '#b48a62');
        }
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(x, y, entity.width, entity.height);

        // Roof
        ctx.fillStyle = isNight ? '#4a3a3a' : '#8a5a4a';
        ctx.beginPath();
        ctx.moveTo(x - 5, y + 10);
        ctx.lineTo(x + entity.width / 2, y - 15);
        ctx.lineTo(x + entity.width + 5, y + 10);
        ctx.closePath();
        ctx.fill();

        // Door
        ctx.fillStyle = isNight ? '#2a2520' : '#5a4a3a';
        ctx.fillRect(x + entity.width / 2 - 8, y + entity.height - 25, 16, 25);

        // Window
        ctx.fillStyle = isNight ? '#4a5a6a' : '#8ac0e0';
        ctx.fillRect(x + 8, y + 20, 12, 12);
        if (entity.width > 50) {
          ctx.fillRect(x + entity.width - 20, y + 20, 12, 12);
        }
        break;

      case 'tree':
        // Tree trunk
        ctx.fillStyle = isNight ? '#3a2a20' : '#6a4a3a';
        ctx.fillRect(x + entity.width / 2 - 4, y + entity.height * 0.4, 8, entity.height * 0.6);

        // Tree foliage (multiple circles)
        ctx.fillStyle = isNight ? '#1a3a2a' : '#2a6a3a';
        const foliageY = y + entity.height * 0.4;
        ctx.beginPath();
        ctx.arc(x + entity.width / 2 - 8, foliageY, entity.width * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + entity.width / 2 + 8, foliageY, entity.width * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + entity.width / 2, foliageY - 10, entity.width * 0.35, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'decoration':
        // Generic decoration (rock/bush)
        ctx.fillStyle = isNight ? '#3a4a3a' : '#5a7a5a';
        ctx.beginPath();
        ctx.ellipse(x + entity.width / 2, y + entity.height / 2, entity.width / 2, entity.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  private isNight(): boolean {
    return this.timeOfDay < 0.25 || this.timeOfDay > 0.80;
  }

  private drawWindowGlow(ctx: CanvasRenderingContext2D, camera: Camera, entities: RenderableEntity[]): void {
    ctx.save();

    for (const entity of entities) {
      if (entity.type !== 'building') continue;

      const screenPos = camera.worldToScreen(entity.x, entity.y);
      const x = screenPos.x - entity.width / 2;
      const y = screenPos.y - entity.height;

      // Window glow effect
      const glowGradient = ctx.createRadialGradient(
        x + 14, y + 26, 0,
        x + 14, y + 26, 15
      );
      glowGradient.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
      glowGradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(x, y + 14, 30, 24);

      if (entity.width > 50) {
        const glowGradient2 = ctx.createRadialGradient(
          x + entity.width - 14, y + 26, 0,
          x + entity.width - 14, y + 26, 15
        );
        glowGradient2.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
        glowGradient2.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = glowGradient2;
        ctx.fillRect(x + entity.width - 30, y + 14, 30, 24);
      }
    }

    ctx.restore();
  }
}
