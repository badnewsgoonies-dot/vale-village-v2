/**
 * EntityLayer
 * Renders all Y-sorted entities: buildings, trees, NPCs, player
 * Handles shadow rendering and depth-based occlusion
 */

import type { Layer, Camera, Entity, Direction, WorldPosition } from '../engine/types';
import type { GameMap, NPC } from '../../../../data/schemas/mapSchema';
import { loadSprite } from '../../../sprites/loader';

interface RenderableEntity extends Entity {
  sprite: HTMLImageElement | null;
  shadowWidth: number;
  shadowHeight: number;
}

export class EntityLayer implements Layer {
  zIndex = 3;

  private entities: RenderableEntity[] = [];
  private playerEntity: RenderableEntity | null = null;
  private tileSize: number = 32;
  private timeOfDay: number = 0.5;

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
   * Populate entities from map data
   */
  setMapData(map: GameMap): void {
    this.entities = [];

    // Add buildings from wall/door tiles
    this.addBuildingsFromMap(map);

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
    const worldX = bounds.x * this.tileSize;
    const worldY = bounds.y * this.tileSize;
    const pixelWidth = bounds.width * this.tileSize;
    const pixelHeight = bounds.height * this.tileSize;

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
      spriteId: 'building-placeholder',
      sprite: null,
      shadowWidth: pixelWidth * 0.8,
      shadowHeight: 8,
    };
  }

  private addSceneryFromMap(map: GameMap): void {
    // Add procedural trees/scenery based on grass tiles
    // (In a real implementation, this would come from map data)
    const treeChance = 0.05;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y]?.[x];
        if (tile?.type === 'grass' && tile.walkable) {
          const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const random = seed - Math.floor(seed);

          if (random < treeChance) {
            this.entities.push(this.createTreeEntity(x, y, random));
          }
        }
      }
    }
  }

  private createTreeEntity(tileX: number, tileY: number, seed: number): RenderableEntity {
    const worldX = tileX * this.tileSize + this.tileSize / 2;
    const worldY = tileY * this.tileSize + this.tileSize;

    return {
      type: 'tree',
      id: `tree-${tileX}-${tileY}`,
      x: worldX,
      y: worldY,
      width: 24 + seed * 16,
      height: 48 + seed * 32,
      spriteId: 'tree-placeholder',
      sprite: null,
      shadowWidth: 20,
      shadowHeight: 6,
      swayAmount: 2 + seed * 2,
      animOffset: seed * 1000,
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
