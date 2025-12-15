import { describe, expect, it } from 'vitest';

import { Camera } from '../../../src/ui/components/overworld-v2/engine/Camera';
import {
  clampPlayerXToWorldBounds,
  DEFAULT_PLAYER_HALF_WIDTH,
} from '../../../src/ui/components/overworld-v2/engine/playerBounds';

describe('OverworldV2 player bounds', () => {
  it('clamps bottom-center anchored X within world bounds', () => {
    const worldWidth = 2000;

    expect(clampPlayerXToWorldBounds(-100, worldWidth)).toBe(DEFAULT_PLAYER_HALF_WIDTH);
    expect(clampPlayerXToWorldBounds(0, worldWidth)).toBe(DEFAULT_PLAYER_HALF_WIDTH);
    expect(clampPlayerXToWorldBounds(worldWidth, worldWidth)).toBe(worldWidth - DEFAULT_PLAYER_HALF_WIDTH);
  });

  it('keeps the sprite fully visible when the camera is clamped', () => {
    const viewportWidth = 960;
    const viewportHeight = 640;
    const worldWidth = 2000;

    const camera = new Camera(viewportWidth, viewportHeight);
    camera.setWorldBounds(worldWidth, viewportHeight);

    const minX = clampPlayerXToWorldBounds(0, worldWidth);
    camera.setTarget(minX, 0);
    camera.snapToTarget();
    expect(camera.worldToScreenSnapped(minX, 0).x - DEFAULT_PLAYER_HALF_WIDTH).toBe(0);

    const maxX = clampPlayerXToWorldBounds(worldWidth, worldWidth);
    camera.setTarget(maxX, 0);
    camera.snapToTarget();
    expect(camera.worldToScreenSnapped(maxX, 0).x + DEFAULT_PLAYER_HALF_WIDTH).toBe(viewportWidth);
  });
});

