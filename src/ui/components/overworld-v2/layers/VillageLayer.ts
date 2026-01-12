/**
 * VillageLayer
 * Renders the Battle Tower + building row using bottom-center anchors.
 * Includes door highlighting when player is nearby.
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { loadSprite } from '../../../sprites/loader';
import { VILLAGE_BUILDINGS, type VillageBuilding } from '../data/villageLayout';

/** Distance threshold for door interaction (world pixels) */
const DOOR_INTERACTION_THRESHOLD = 80;

export class VillageLayer implements Layer {
  zIndex = 3;

  private buildings: VillageBuilding[];
  private spriteCache: Map<string, HTMLImageElement> = new Map();
  private loadingSprites: Set<string> = new Set();

  /** Player world position for door proximity checks */
  private playerX: number = 0;
  private playerY: number = 0;

  /** Currently highlighted door (nearest within threshold) */
  private nearestDoor: VillageBuilding | null = null;

  /** Animation time accumulator for glow pulse */
  private glowTime: number = 0;

  /** Set of unlocked house IDs (house-01 always unlocked, others based on story) */
  private unlockedHouses: Set<string> = new Set(['house-01', 'battle-tower', 'shop-vale-armory']);

  constructor(buildings: VillageBuilding[] = VILLAGE_BUILDINGS) {
    this.buildings = [...buildings].sort((a, b) => a.x - b.x);

    for (const building of this.buildings) {
      this.loadSpriteAsync(building.spritePath);
    }
  }

  /** Update player position for door proximity checks */
  setPlayerPosition(x: number, y: number): void {
    this.playerX = x;
    this.playerY = y;
    this.updateNearestDoor();
  }

  /** Update which houses are unlocked (called when story state changes) */
  setUnlockedHouses(unlockedIds: Set<string> | string[]): void {
    this.unlockedHouses = new Set(unlockedIds);
    // Always ensure house-01 and battle-tower are unlocked
    this.unlockedHouses.add('house-01');
    this.unlockedHouses.add('battle-tower');
    this.unlockedHouses.add('shop-vale-armory');
  }

  /** Check if a building is unlocked */
  isUnlocked(buildingId: string): boolean {
    return this.unlockedHouses.has(buildingId);
  }

  /** Get the currently highlighted door (if any) - returns null for locked doors */
  getNearestDoor(): VillageBuilding | null {
    // Don't return locked doors as interactable
    if (this.nearestDoor && !this.isUnlocked(this.nearestDoor.id)) {
      return null;
    }
    return this.nearestDoor;
  }

  /** Get the nearest building (locked or unlocked) for visual highlighting */
  getNearestBuilding(): VillageBuilding | null {
    return this.nearestDoor;
  }

  private updateNearestDoor(): void {
    let nearest: VillageBuilding | null = null;
    let nearestDist = Infinity;

    for (const building of this.buildings) {
      // Door position is at building anchor (bottom-center)
      const doorX = building.x + (building.doorOffsetX ?? 0);
      const doorY = building.y + (building.doorOffsetY ?? 0);

      const dx = this.playerX - doorX;
      const dy = this.playerY - doorY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < DOOR_INTERACTION_THRESHOLD && dist < nearestDist) {
        nearest = building;
        nearestDist = dist;
      }
    }

    this.nearestDoor = nearest;
  }

  update(dtMs: number): void {
    // Accumulate time for glow animation
    this.glowTime += dtMs;
  }

  private loadSpriteAsync(spritePath: string): void {
    if (this.spriteCache.has(spritePath) || this.loadingSprites.has(spritePath)) return;
    this.loadingSprites.add(spritePath);

    loadSprite(spritePath)
      .then((img) => {
        this.spriteCache.set(spritePath, img);
      })
      .finally(() => {
        this.loadingSprites.delete(spritePath);
      });
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const z = camera.zoom;
    for (const building of this.buildings) {
      const { x: screenX, y: screenY } = camera.worldToScreenSnapped(building.x, building.y);

      // Cull off-screen buildings
      const isVisible = camera.isVisible(
        building.x - building.width / 2,
        building.y - building.height,
        building.width,
        building.height,
        200
      );
      if (!isVisible) continue;

      // Check if this building has the highlighted door
      const isHighlighted = this.nearestDoor?.id === building.id;

      // Render door glow BEFORE shadow and building (so it's behind)
      if (isHighlighted) {
        this.renderDoorGlow(ctx, screenX, screenY, building, z);
      }

      // Shadow on the road (slightly below the ground line)
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(screenX, screenY + 10 * z, building.width * 0.28 * z, 8 * z, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      this.loadSpriteAsync(building.spritePath);
      const sprite = this.spriteCache.get(building.spritePath);
      if (!sprite) {
        // Placeholder until sprite is ready
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(screenX - (building.width * z) / 2, screenY - building.height * z, building.width * z, building.height * z);
        ctx.restore();
        continue;
      }

      // Bottom-center anchored draw
      ctx.drawImage(
        sprite,
        screenX - (building.width * z) / 2,
        screenY - building.height * z,
        building.width * z,
        building.height * z
      );

      // Render prompt AFTER building (so it's on top)
      if (isHighlighted) {
        this.renderDoorPrompt(ctx, screenX, screenY, building, z);
      }
    }
  }

  /** Render pulsing glow effect behind the door */
  private renderDoorGlow(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    building: VillageBuilding,
    z: number
  ): void {
    const isLocked = !this.isUnlocked(building.id);

    // Pulse opacity using sine wave (0.3 to 0.7) - slower pulse for locked
    const pulseSpeed = isLocked ? 600 : 300;
    const pulse = 0.5 + 0.2 * Math.sin(this.glowTime / pulseSpeed);

    // Choose glow color based on building type and lock status
    let glowColor: string;
    if (isLocked) {
      glowColor = `rgba(100, 100, 100, ${pulse * 0.7})`; // Gray for locked
    } else if (building.kind === 'tower') {
      glowColor = `rgba(100, 180, 255, ${pulse})`; // Blue for tower
    } else if (building.kind === 'shop') {
      glowColor = `rgba(140, 255, 170, ${pulse})`; // Green for shop
    } else {
      glowColor = `rgba(255, 220, 100, ${pulse})`; // Yellow/gold for houses
    }

    ctx.save();

    // Draw radial gradient glow
    const glowRadius = Math.max(building.width, building.height) * 0.6 * z;
    const gradient = ctx.createRadialGradient(
      screenX, screenY - building.height * 0.3 * z, 0,
      screenX, screenY - building.height * 0.3 * z, glowRadius
    );
    gradient.addColorStop(0, glowColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      screenX,
      screenY - building.height * 0.3 * z,
      glowRadius,
      glowRadius * 0.7,
      0, 0, Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  /** Render "PRESS SPACE" prompt above the door */
  private renderDoorPrompt(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    building: VillageBuilding,
    z: number
  ): void {
    const isLocked = !this.isUnlocked(building.id);

    // Choose prompt text based on lock status and building type
    let promptText: string;
    let textColor: string;

    if (isLocked) {
      promptText = 'LOCKED';
      textColor = '#888888'; // Gray for locked
    } else if (building.kind === 'tower') {
      promptText = 'ENTER TOWER';
      textColor = '#88CCFF'; // Blue for tower
    } else if (building.kind === 'shop') {
      promptText = 'SHOP';
      textColor = '#9AFFB6'; // Green for shop
    } else {
      promptText = 'PRESS SPACE';
      textColor = '#FFDD66'; // Yellow/gold for houses
    }

    // Position prompt above the building
    const promptY = screenY - building.height * z - 20 * z;

    ctx.save();

    // Text styling
    const fontSize = Math.max(8, Math.round(14 * z));
    ctx.font = `bold ${fontSize}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    // Draw text shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(promptText, screenX + 2 * z, promptY + 2 * z);

    // Draw main text
    ctx.fillStyle = textColor;
    ctx.fillText(promptText, screenX, promptY);

    ctx.restore();
  }
}
