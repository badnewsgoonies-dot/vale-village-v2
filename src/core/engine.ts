export type UpdateFn = (dt: number) => void;

export class GameLoop {
  private running = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly update: UpdateFn, private readonly tickMs: number = 16) {}

  start() {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => this.tick(), this.tickMs);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  tick() {
    const dt = this.tickMs / 1000;
    try {
      this.update(dt);
    } catch (e) {
      // let callers handle logging; keep core loop minimal
      throw e;
    }
  }

  isRunning() {
    return this.running;
  }
}
