import { describe, it, expect } from 'vitest';

import { Camera } from '../../../src/ui/components/overworld/engine/Camera';

describe('Overworld Camera (legacy)', () => {
  it('snaps render coordinates to integer pixels', () => {
    const camera = new Camera(100, 100);
    camera.x = 10.4;
    camera.y = 5.6;

    expect(camera.getRenderX()).toBe(10);
    expect(camera.getRenderY()).toBe(6);
  });

  it('uses render-snapped camera offsets for world/screen conversions', () => {
    const camera = new Camera(100, 100);
    camera.x = 10.4;
    camera.y = 5.6;

    expect(camera.worldToScreen(20, 10)).toEqual({ x: 10, y: 4 });
    expect(camera.screenToWorld(0, 0)).toEqual({ x: 10, y: 6 });
  });

  it('uses render-snapped camera offsets for visible bounds and parallax', () => {
    const camera = new Camera(100, 100);
    camera.x = 10.4;
    camera.y = 5.6;

    expect(camera.getVisibleBounds()).toEqual({ left: 10, top: 6, right: 110, bottom: 106 });
    expect(camera.getParallaxOffset(0.5)).toEqual({ x: -5, y: -3 });
  });
});

