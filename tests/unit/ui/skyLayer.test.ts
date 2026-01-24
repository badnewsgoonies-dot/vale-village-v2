import { describe, it, expect } from 'vitest';
import { SkyLayer } from '../../../src/ui/components/overworld-v2/layers/SkyLayer';

// Basic rendering smoke test for SkyLayer to validate canvas-based rendering works
describe('SkyLayer rendering', () => {
  it('renders to a 2D canvas without throwing', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    // Try to get a real 2D context, but fall back to a lightweight mock if not available
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;

    if (!ctx) {
      // Minimal mock implementing the methods SkyLayer.render uses
      ctx = {
        canvas,
        fillStyle: '',
        globalAlpha: 1,
        createLinearGradient: () => ({ addColorStop: () => {} } as any),
        createRadialGradient: () => ({ addColorStop: () => {} } as any),
        fillRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        save: () => {},
        restore: () => {},
        ellipse: () => {},
      } as unknown as CanvasRenderingContext2D;
    }

    const layer = new SkyLayer();
    layer.setTimeOfDay(0.5); // midday
    layer.update(16);

    expect(() => layer.render(ctx as any, { x: 0, y: 0, width: 800, height: 600 } as any)).not.toThrow();
  });
});
