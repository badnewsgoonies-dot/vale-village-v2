
// Milliseconds fallback for environments without RAF (approx 60 FPS)
const FRAME_TIMEOUT_MS = 16;

export class GameLoop {
  private running = false;
  private rafId: number | null = null;

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      this.tick();
      this.rafId = (typeof requestAnimationFrame !== "undefined") ? requestAnimationFrame(loop) : (setTimeout(loop, FRAME_TIMEOUT_MS) as unknown as number);
    };
    this.rafId = (typeof requestAnimationFrame !== "undefined") ? requestAnimationFrame(loop) : (setTimeout(loop, FRAME_TIMEOUT_MS) as unknown as number);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.rafId != null) {
      if (typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(this.rafId);
      else clearTimeout(this.rafId as unknown as number);
    }
    this.rafId = null;
  }

  tick() {
    // deterministically consume commands queued on the global input buffer each tick
    if (typeof window === "undefined") return;
    const incoming: string[] = window.__INPUT_BUFFER__ ? window.__INPUT_BUFFER__.drain() : [];
    for (const cmd of incoming) {
      this.processCommand(cmd);
    }
    // Game update logic would go here
  }

  processCommand(cmd: string) {
    // Minimal deterministic handler: log for smoke tests and future wiring
    // eslint-disable-next-line no-console
    console.info("[GameLoop] processed command:", String(cmd));
  }
}

export default GameLoop;
