/**
 * EncountersLayer
 * Renders visible "symbol encounters" above houses on the overworld.
 *
 * Constructor accepts config object so it can integrate with OverworldV2.
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { ENCOUNTERS } from '../../../../data/definitions/encounters';
import type { VillageBuilding } from '../data/villageLayout';

export interface OverworldEncounterState {
  id: string;
  x: number;
  y: number;
}

type EncountersConfig = {
  buildings: VillageBuilding[];
  getPlayerPosition: () => { x: number; y: number } | null;
  onTrigger: (buildingId: string) => void;
  showPredicate?: (b: VillageBuilding) => boolean;
};

export class EncountersLayer implements Layer {
  zIndex = 3.5;

  private buildings: VillageBuilding[];
  private getPlayerPosition: () => { x: number; y: number } | null;
  private onTrigger: (buildingId: string) => void;
  private showPredicate: (b: VillageBuilding) => boolean;
  private triggered: Set<string> = new Set();

  constructor(config: EncountersConfig) {
    this.buildings = config.buildings;
    this.getPlayerPosition = config.getPlayerPosition;
    this.onTrigger = config.onTrigger;
    this.showPredicate = config.showPredicate ?? (() => true);
  }

  /** Compatibility hook: allow external update of player position (no-op by default) */
  setPlayerPosition(_x: number, _y: number): void {
    // No-op; layer supports getPlayerPosition-based auto-triggering.
  }

  /**
   * Return the first encounter within `radius` world pixels of (x,y), or null.
   */
  getNearbyEncounter(x: number, y: number, radius: number): OverworldEncounterState | null {
    for (const b of this.buildings) {
      if (!this.showPredicate(b)) continue;
      if (b.kind !== 'house') continue;
      const id = b.id;
      if (!ENCOUNTERS[id]) continue;

      const dx = x - b.x;
      const dy = y - (b.y - 10);
      if (dx * dx + dy * dy <= radius * radius) {
        return { id, x: b.x, y: b.y - b.height };
      }
    }
    return null;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    // Try to auto-trigger based on player position if available
    const playerPos = this.getPlayerPosition();
    if (playerPos) {
      const nearby = this.getNearbyEncounter(playerPos.x, playerPos.y, 32);
      if (nearby && !this.triggered.has(nearby.id)) {
        this.triggered.add(nearby.id);
        try { this.onTrigger(nearby.id); } catch (e) { /* swallow trigger errors */ }
      }
    }

    for (const b of this.buildings) {
      if (!this.showPredicate(b)) continue;
      if (b.kind !== 'house') continue;
      const id = b.id;
      if (!ENCOUNTERS[id]) continue;

      const worldX = b.x;
      const worldY = b.y - b.height - 6; // place symbol above roof
      const { x: screenX, y: screenY } = camera.worldToScreenSnapped(worldX, worldY);

      // Simple glowing diamond symbol
      ctx.save();
      // Glow
      const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 18);
      gradient.addColorStop(0, 'rgba(255,220,80,0.95)');
      gradient.addColorStop(0.6, 'rgba(255,200,50,0.6)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(screenX, screenY, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Diamond
      ctx.fillStyle = '#FFD966';
      ctx.beginPath();
      ctx.moveTo(screenX, screenY - 10);
      ctx.lineTo(screenX + 8, screenY);
      ctx.lineTo(screenX, screenY + 10);
      ctx.lineTo(screenX - 8, screenY);
      ctx.closePath();
      ctx.fill();

      // Accent
      ctx.strokeStyle = 'rgba(120,90,0,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }
}
