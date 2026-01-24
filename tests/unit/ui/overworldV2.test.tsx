import { render } from '@testing-library/preact';
import { vi, describe, it, expect } from 'vitest';

// Lightweight mocks for modules that perform side-effects or heavy work
vi.mock('../../../src/ui/components/overworld-v2/engine/OverworldEngineV2', () => {
  class StubCamera {
    setTarget() {}
    snapToTarget() {}
    worldToScreenSnapped(x: number, y: number) {
      return { x: Math.round(x), y: Math.round(y) };
    }
  }

  return {
    OverworldEngineV2: class {
      canvas: HTMLCanvasElement;
      constructor(canvas: HTMLCanvasElement) { this.canvas = canvas; }
      setLayers() {}
      start() {}
      stop() {}
      getCamera() { return new StubCamera(); }
      onUpdate(_cb: any) { /* noop */ }
    }
  };
});

vi.mock('../../../src/core/services/AudioService', () => ({
  audio: { playBGM: vi.fn(), stopBGM: vi.fn() }
}));

vi.mock('../../../src/core/services/TelemetryService', () => ({
  TelemetryService: { updateFrame: vi.fn() }
}));

vi.mock('../../../src/ui/components/VirtualJoystick', () => ({
  VirtualJoystick: () => {
    // simple placeholder element
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <div data-testid="virtual-joystick" />;
  }
}));

vi.mock('../../../src/ui/sprites/mappings/overworldSprites', () => ({
  getPlayerSprite: () => '/mock-sprite.png'
}));

vi.mock('../../../src/ui/state/store', () => ({
  useStore: (sel: any) => {
    const fake = {
      currentMapId: 'vale-village',
      teleportPlayer: () => {},
      enterTowerFromOverworld: () => {},
      handleTrigger: () => {},
      mode: 'overworld',
      startDialogueTree: () => {},
      story: { flags: {} },
    };
    return typeof sel === 'function' ? sel(fake) : fake;
  }
}));

vi.mock('../../../src/store/gameStore', () => ({
  useGameStore: (sel: any) => {
    const fake = { startTransition: () => {}, openModal: () => {}, closeModal: () => {}, flow: { modal: null } };
    return typeof sel === 'function' ? sel(fake) : fake;
  }
}));

import { OverworldV2 } from '../../../src/ui/components/overworld-v2/OverworldV2';

describe('OverworldV2 basic render', () => {
  it('renders canvas and player image with given size', () => {
    const { container } = render(<OverworldV2 width={320} height={240} />);

    const canvas = container.querySelector('canvas.overworld-canvas') as HTMLCanvasElement | null;
    expect(canvas).not.toBeNull();
    // assert DOM attributes rather than numeric properties for DOM compatibility
    expect(canvas!.getAttribute('width')).toBe('320');
    expect(canvas!.getAttribute('height')).toBe('240');

    const img = container.querySelector('img') as HTMLImageElement | null;
    expect(img).not.toBeNull();
    // src may be resolved to an absolute URL in the test DOM; check the suffix
    expect(img!.src).toMatch(/mock-sprite.png$/);

    const joystick = container.querySelector('[data-testid="virtual-joystick"]');
    expect(joystick).not.toBeNull();
  });
});
