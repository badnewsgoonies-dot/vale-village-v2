import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GameLoop from '../../../src/core/GameLoop';

describe('GameLoop', () => {
  let loop: GameLoop;
  let consoleInfoSpy: any;

  beforeEach(() => {
    loop = new GameLoop();
    // Provide a simple input buffer on the global window for the tick to consume
    // @ts-ignore
    global.window = { __INPUT_BUFFER__: { drain: () => ['foo','bar'] } } as any;
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
    // @ts-ignore
    delete global.window;
  });

  it('processes incoming commands on tick', () => {
    loop.tick();
    expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
    expect(consoleInfoSpy).toHaveBeenCalledWith('[GameLoop] processed command:', 'foo');
  });
});
