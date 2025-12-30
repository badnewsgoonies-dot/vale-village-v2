/**
 * TreeLayer
 * Renders overworld plant/tree sprites across the village world and follows the camera.
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import { loadSprite } from '../../../sprites/loader';
import { VILLAGE_WORLD_WIDTH } from '../data/villageLayout';
import { BUILDING_GROUND_Y } from '../data/constants';

type TreeInstance = {
  x: number;
  y: number;
  spritePath: string;
};

export class TreeLayer implements Layer {
  zIndex = 1.7; // Above terrain (1.5), below road/buildings (2+)

  private trees: TreeInstance[] = [];
  private spriteCache: Map<string, HTMLImageElement> = new Map();
  private loadingSprites: Set<string> = new Set();
  private time: number = 0;

  constructor() {
    if (typeof document === 'undefined') return;

    // Candidate plant sprites (use real assets from /public/sprites/scenery/plants)
    const candidates = [
      '/sprites/scenery/plants/Tree.gif',
      '/sprites/scenery/plants/Tree1.gif',
      '/sprites/scenery/plants/Tree2.gif',
      '/sprites/scenery/plants/Tree3.gif',
      '/sprites/scenery/plants/Tree4.gif',
      '/sprites/scenery/plants/Tree5.gif',
      '/sprites/scenery/plants/Tree6.gif',
      '/sprites/scenery/plants/Tree7.gif',
      '/sprites/scenery/plants/Tree8.gif',
      '/sprites/scenery/plants/Tree9.gif',
      '/sprites/scenery/plants/Tree10.gif',
      '/sprites/scenery/plants/Tree11.gif',
      '/sprites/scenery/plants/Tree12.gif',
      '/sprites/scenery/plants/Small_Tree1.gif',
      '/sprites/scenery/plants/Small_Tree2.gif',
      '/sprites/scenery/plants/Small_Tree3.gif',
      '/sprites/scenery/plants/Small_Tree4.gif',
      '/sprites/scenery/plants/Small_Tree5.gif',
      '/sprites/scenery/plants/Palm.gif',
      '/sprites/scenery/plants/Palm2.gif',
      '/sprites/scenery/plants/palmtree.gif',
      '/sprites/scenery/plants/Sickly_Tree.gif',
      '/sprites/scenery/plants/Sickly_Tree2.gif',
    ];

    // Distribute trees deterministically across the village world width
    // Place them above the road band so they read as background scenery.
    const spacing = 220; // world pixels between trees
    const baseY = BUILDING_GROUND_Y - 120;
    for (let x = 120; x < VILLAGE_WORLD_WIDTH - 120; x += spacing) {
      const seed = this.seedFromX(x);
      const idx = Math.floor(seed * candidates.length) % candidates.length;
      const spritePath = candidates[idx] as string;
      const yJitter = Math.round((seed - 0.5) * 30); // small vertical jitter
      const y = baseY + yJitter; // anchor above the road band

      this.trees.push({ x, y, spritePath });
      this.loadSpriteAsync(spritePath);
    }
  }

  update(dtMs: number): void {
    this.time += dtMs;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    for (let i = 0; i < this.trees.length; i++) {
      const t = this.trees[i];
      if (!t) continue;

      // Use cached image if available
      const img = this.spriteCache.get(t.spritePath);

      // Cull if off-screen
      const width = img ? img.naturalWidth : 64;
      const height = img ? img.naturalHeight : 64;
      if (!camera.isVisible(t.x - width / 2, t.y - height, width, height, 64)) continue;

      // Slight subtle sway based on time and index for liveliness (pixel offset)
      const sway = Math.round(Math.sin((this.time / 900) + i) * 1.2);

      const { x: screenX, y: screenY } = camera.worldToScreenSnapped(t.x + sway, t.y);

      // Draw soft shadow under tree
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.24)';
      ctx.beginPath();
      const shadowW = Math.max(12, width * 0.28);
      const shadowH = Math.max(6, width * 0.12);
      ctx.ellipse(screenX, screenY + 6, shadowW, shadowH, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (img && img.complete && img.naturalWidth > 0) {
        // Bottom-center anchor
        ctx.drawImage(img, screenX - width / 2, screenY - height, width, height);
      } else {
        // Placeholder box until sprite loads
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(screenX - width / 2, screenY - height, width, height);
        ctx.restore();
      }
    }
  }

  private seedFromX(x: number): number {
    // Deterministic pseudo-random in [0,1) based on x
    const s = Math.sin(x * 12.9898) * 43758.5453;
    return s - Math.floor(s);
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
}

export default TreeLayer;
