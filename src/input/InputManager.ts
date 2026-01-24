/* Minimal InputManager: provides a global window.__INPUT_BUFFER__ with push(cmd) and drain() */

declare global {
  interface Window {
    __INPUT_BUFFER__?: { push: (cmd: string) => void; drain: () => string[] };
    __GAME_LOOP__?: any;
  }
}

class InputManager {
  private queue: string[] = [];

  init() {
    if (typeof window === 'undefined') return;
    if (!window.__INPUT_BUFFER__) {
      // expose an array-like buffer so tests can inspect by index/length while
      // keeping a private queue for the InputManager implementation.
      const queue: string[] = [];
      const arr: any[] = [];
      arr.push = (cmd: string) => {
        const s = String(cmd);
        queue.push(s);
        // keep array indices in sync for tests that inspect the buffer directly
        arr[arr.length] = s;
        return queue.length;
      };
      arr.drain = () => {
        const out = queue.slice();
        queue.length = 0;
        arr.length = 0;
        return out;
      };
      window.__INPUT_BUFFER__ = arr;
    }
  }

  push(cmd: string) {
    this.queue.push(String(cmd));
  }

  drain() {
    const out = this.queue.slice();
    this.queue.length = 0;
    return out;
  }

  consumeNext(): string | null {
    return this.queue.shift() ?? null;
  }

  hasCommands(): boolean {
    return this.queue.length > 0;
  }
}

const inputManager = new InputManager();

// Auto-init the global buffer so external scripts can enqueue commands immediately
if (typeof window !== 'undefined') {
  inputManager.init();
}

export default inputManager;
