import { describe, it, expect } from 'vitest';
import { PlayerLayer } from '../../../src/ui/components/overworld-v2/layers/PlayerLayer';
import { VillageLayer } from '../../../src/ui/components/overworld-v2/layers/VillageLayer';
import { EncountersLayer } from '../../../src/ui/components/overworld-v2/layers/encountersLayer';

// Lightweight mock of CanvasRenderingContext2D methods used by layers
function createMockCtx() {
  const ctx: any = {
    // style properties
    fillStyle: '',
    strokeStyle: '',
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    lineWidth: 1,

    // path methods
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    fill: () => {},
    stroke: () => {},
    fillRect: () => {},
    drawImage: () => {},
    translate: () => {},
    scale: () => {},
    ellipse: () => {},
    arc: () => {},
    fillText: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
  };
  return ctx as CanvasRenderingContext2D;
}

const mockCamera = {
  zoom: 1,
  worldToScreenSnapped: (x: number, y: number) => ({ x, y }),
  isVisible: () => true,
  setTarget: () => {},
  snapToTarget: () => {},
};

describe('Overworld layers rendering', () => {
  it('PlayerLayer renders without throwing', () => {
    const layer = new PlayerLayer();
    const ctx = createMockCtx();
    expect(typeof layer.render).toBe('function');
    expect(() => layer.render(ctx, mockCamera as any)).not.toThrow();
  });

  it('VillageLayer renders without throwing', () => {
    const layer = new VillageLayer();
    const ctx = createMockCtx();
    // Provide a player position to exercise door logic
    if ((layer as any).setPlayerPosition) (layer as any).setPlayerPosition(200, 480);
    expect(() => layer.render(ctx, mockCamera as any)).not.toThrow();
  });

  it('EncountersLayer processes triggers and renders without throwing', () => {
    const layer = new EncountersLayer({ buildings: [] });
    const ctx = createMockCtx();
    // Simulate player near no encounters
    layer.setPlayerPosition(0, 0);
    expect(() => layer.update(16)).not.toThrow();
    expect(() => layer.render(ctx, mockCamera as any)).not.toThrow();
  });
});
