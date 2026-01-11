import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { VILLAGE_BUILDINGS, type VillageBuilding } from '../data/villageLayout';

type EncDef = { id: string; x: number; y: number; label?: string; radius?: number; __triggered?: boolean };

type EncConfig = {
  buildings?: VillageBuilding[];
  getPlayerPosition?: () => { x: number; y: number } | null;
  onTrigger?: (buildingId: string) => void;
  showPredicate?: (b: VillageBuilding) => boolean;
  radius?: number;
};

/**
 * EncountersLayer
 * - Supports two constructor styles for backwards compatibility:
 *   - new EncountersLayer(arrayOfSymbols)
 *   - new EncountersLayer({ buildings, getPlayerPosition, onTrigger, showPredicate })
 */
export class EncountersLayer implements Layer {
  zIndex = 4;
  private encounters: EncDef[] = [];
  private playerX = 0;
  private playerY = 0;
  private time = 0;
  private getPlayerPosition?: () => { x: number; y: number } | null;
  private onTrigger?: (buildingId: string) => void;

  constructor(arg: EncDef[] | EncConfig = []) {
    if (Array.isArray(arg)) {
      this.encounters = arg.map((e) => ({ ...e, __triggered: false }));
    } else {
      const cfg = arg as EncConfig;
      const buildings = cfg.buildings ?? VILLAGE_BUILDINGS;
      this.getPlayerPosition = cfg.getPlayerPosition;
      this.onTrigger = cfg.onTrigger;

      const showPred = cfg.showPredicate ?? (() => true);
      for (const b of buildings) {
        if (!showPred(b)) continue;
        const px = b.x;
        const py = b.y - Math.max(16, b.height * 0.6);
        this.encounters.push({ id: b.id, x: px, y: py, __triggered: false, radius: cfg.radius });
      }
    }
  }

  setPlayerPosition(x: number, y: number): void {
    this.playerX = x;
    this.playerY = y;
  }

  setTriggerHandler(fn: (t: any) => void): void {
    this.onTrigger = (id: string) => fn({ id: id, type: 'battle', position: { x: 0, y: 0 }, data: { encounterId: id } });
  }

  processTriggers(): void {
    const nearest = this.getNearestEncounter();
    if (!nearest) return;
    if (nearest.__triggered) return;
    nearest.__triggered = true;
    try {
      if (this.onTrigger) this.onTrigger(nearest.id);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Encounter trigger failed', e);
    }
  }

  getNearestEncounter(): EncDef | null {
    let nearest: EncDef | null = null;
    let nd = Infinity;
    for (const e of this.encounters) {
      const dx = this.playerX - e.x;
      const dy = this.playerY - e.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const thresh = e.radius ?? 28;
      if (dist < thresh && dist < nd) {
        nd = dist;
        nearest = e;
      }
    }
    return nearest;
  }

  update(dtMs: number): void {
    this.time += dtMs;
    // If a runtime player position getter exists, sync it
    if (this.getPlayerPosition) {
      const p = this.getPlayerPosition();
      if (p) {
        this.playerX = p.x;
        this.playerY = p.y;
      }
    }
    // Auto-process triggers if handler exists
    if (this.onTrigger) this.processTriggers();
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    for (const e of this.encounters) {
      const { x: sx, y: sy } = camera.worldToScreenSnapped(e.x, e.y);

      // Cull
      if (!camera.isVisible(e.x - 16, e.y - 16, 32, 32, 100)) continue;

      // Draw simple symbol (circle + label)
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = e.__triggered ? 'rgba(200,50,50,0.9)' : 'rgba(255,220,80,0.95)';
      ctx.arc(sx, sy - 12, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (e.label) {
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(e.label, sx, sy - 10);
      }

      ctx.restore();
    }
  }
}
