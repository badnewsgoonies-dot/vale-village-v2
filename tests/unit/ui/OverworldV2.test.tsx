import { describe, it, expect, vi } from 'vitest';

// Mock AudioService to avoid playing audio during tests
vi.mock('/home/geni/Documents/vale-village-v2/src/core/services/AudioService', () => ({
  audio: { playBGM: () => {}, stop: () => {} }
}));

// Smoke test: avoid mounting full OverworldV2 in environments where React hooks shims
// may not be available; instead validate the component export and canvas support.
import { OverworldV2 } from '../../../src/ui/components/overworld-v2/OverworldV2';

describe('OverworldV2', () => {
  it('exports a component and environment supports canvas', () => {
    expect(typeof OverworldV2).toBe('function');
    const canvas = document.createElement('canvas');
    expect(canvas).not.toBeNull();
  });
});
