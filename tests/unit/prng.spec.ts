import { describe, it, expect } from 'vitest';
import { makePRNG, prngFromSnapshot } from '../../src/core/random/prng';
import { createRNGStream } from '../../src/core/constants';

describe('PRNG determinism', () => {
  it('restores snapshot and reproduces subsequent draws', () => {
    const prng = makePRNG(12345);

    // Advance generator and capture a snapshot
    for (let i = 0; i < 5; i++) {
      prng.next();
    }
    const snapshot = prng.snapshot();

    // Draw a few values from the original generator
    const expected = [prng.next(), prng.next(), prng.next()];

    // Restore from snapshot and ensure subsequent draws match
    const restored = prngFromSnapshot(snapshot);
    const actual = [restored.next(), restored.next(), restored.next()];

    expect(actual).toEqual(expected);
  });

  it('createRNGStream produces consistent seeds and sequences', () => {
    const baseSeed = 1000;
    const turn = 3;

    const seedA = createRNGStream(baseSeed, turn, 'ACTIONS');
    const seedB = createRNGStream(baseSeed, turn, 'ACTIONS');
    expect(seedA).toBe(seedB);

    const a = makePRNG(seedA);
    const b = makePRNG(seedB);
    const drawsA = [a.next(), a.next(), a.next()];
    const drawsB = [b.next(), b.next(), b.next()];

    expect(drawsA).toEqual(drawsB);
  });
});
