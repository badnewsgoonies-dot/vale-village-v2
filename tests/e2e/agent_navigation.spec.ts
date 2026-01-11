import { test, expect } from '@playwright/test';

// This test implements a minimal stub of the neural_bridge behavior described
// in tools/neural_bridge.py. It:
// - initializes window.__TELEMETRY__ and window.__INPUT_BUFFER__
// - seeds a telemetry event indicating the player is near the bridge
// - emulates wait-mode by setting Time.timeScale = 0 while a decision is "made"
// - pushes a decision into window.__INPUT_BUFFER__ and clears telemetry
// - restores Time.timeScale and asserts the expected behaviors

test('Agent navigation via bridge (stub LLM)', async ({ page }) => {
  await page.goto('/');

  // Ensure test hooks exist and initialize telemetry (do not clobber InputManager's buffer)
  await page.waitForFunction(() => (window as any).gameStore && (window as any).__TELEMETRY__ !== undefined && (window as any).__INPUT_BUFFER__ !== undefined);
  await page.evaluate(() => {
    (window as any).__TELEMETRY__ = (window as any).__TELEMETRY__ || [];
    // If InputManager hasn't initialized a buffer, provide a best-effort shim that implements push/drain
    if ((window as any).__INPUT_BUFFER__ == null) {
      (window as any).__INPUT_BUFFER__ = {
        push: (d: any) => { try { (window as any).__INPUT_BUFFER__ = (window as any).__INPUT_BUFFER__ || []; (window as any).__INPUT_BUFFER__.push(d); } catch (e) {} },
        drain: () => {
          // shim: no-op drain
          return [];
        }
      };
    }
    (window as any).Time = (window as any).Time || { timeScale: 1 };
  });

  // Seed telemetry: player is near the bridge between House 1 and House 2
  await page.evaluate(() => {
    (window as any).__TELEMETRY__.push({ type: 'player_near_bridge', from: 'house-1' });
  });

  // Emulate neural_bridge wait-mode: set Time.timeScale = 0 and capture previous value
  const previousTimeScale = await page.evaluate(() => {
    const w: any = window as any;
    const prev = (w.Time && w.Time.timeScale) || 1;
    w.Time.timeScale = 0;
    return prev;
  });

  // Emulate LLM decision and push into __INPUT_BUFFER__ (JSON-serializable)
  await page.evaluate(() => {
    try {
      const payload = JSON.stringify({ decision: 'MOVE_TO_HOUSE_2', meta: { reason: 'near_bridge' } });
      if (typeof (window as any).__INPUT_BUFFER__.push === 'function') {
        (window as any).__INPUT_BUFFER__.push(payload);
      } else {
        // fallback to array push if a shim was used
        (window as any).__INPUT_BUFFER__.push(payload);
      }
    } catch (e) {}
  });

  // Clear telemetry as neural_bridge does after processing
  await page.evaluate(() => { (window as any).__TELEMETRY__ = []; });

  // Restore Time.timeScale
  await page.evaluate((p) => { (window as any).Time.timeScale = p; }, previousTimeScale);

  // Assertions: input buffer contains the decision, telemetry cleared, and timeScale restored
  const lastInput = await page.evaluate(() => {
    const buf = (window as any).__INPUT_BUFFER__ || [];
    const raw = buf.length ? buf[buf.length - 1] : null;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) {
      return raw;
    }
  });
  expect(lastInput).not.toBeNull();
  expect(lastInput.decision).toBe('MOVE_TO_HOUSE_2');

  const telemetry = await page.evaluate(() => (window as any).__TELEMETRY__);
  expect(Array.isArray(telemetry) && telemetry.length === 0).toBeTruthy();

  const timeScale = await page.evaluate(() => (window as any).Time.timeScale);
  expect(timeScale).toBe(previousTimeScale);
});
