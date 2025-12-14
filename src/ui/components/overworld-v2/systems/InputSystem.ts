/**
 * InputSystem
 * Tracks keyboard state for movement and interaction.
 */

export type InputKey = 'left' | 'right' | 'up' | 'down' | 'action';

const KEY_MAP: Record<string, InputKey> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  KeyA: 'left',
  KeyD: 'right',
  KeyW: 'up',
  KeyS: 'down',
  Space: 'action',
  Enter: 'action',
};

export class InputSystem {
  private heldKeys: Set<InputKey> = new Set();
  private justPressed: Set<InputKey> = new Set();
  private justReleased: Set<InputKey> = new Set();

  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
  }

  /** Attach to window keyboard events */
  attach(): void {
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
  }

  /** Detach from window keyboard events */
  detach(): void {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    this.heldKeys.clear();
    this.justPressed.clear();
    this.justReleased.clear();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const key = KEY_MAP[e.code];
    if (!key) return;

    // Prevent default for game keys (stops page scrolling)
    e.preventDefault();

    if (!this.heldKeys.has(key)) {
      this.justPressed.add(key);
    }
    this.heldKeys.add(key);
  }

  private handleKeyUp(e: KeyboardEvent): void {
    const key = KEY_MAP[e.code];
    if (!key) return;

    e.preventDefault();

    if (this.heldKeys.has(key)) {
      this.justReleased.add(key);
    }
    this.heldKeys.delete(key);
  }

  /** Call at end of each frame to clear one-shot states */
  endFrame(): void {
    this.justPressed.clear();
    this.justReleased.clear();
  }

  /** Check if a key is currently held down */
  isHeld(key: InputKey): boolean {
    return this.heldKeys.has(key);
  }

  /** Check if a key was just pressed this frame */
  wasJustPressed(key: InputKey): boolean {
    return this.justPressed.has(key);
  }

  /** Check if a key was just released this frame */
  wasJustReleased(key: InputKey): boolean {
    return this.justReleased.has(key);
  }

  /** Get horizontal input (-1 = left, 0 = none, 1 = right) */
  getHorizontal(): number {
    let h = 0;
    if (this.heldKeys.has('left')) h -= 1;
    if (this.heldKeys.has('right')) h += 1;
    return h;
  }

  /** Get vertical input (-1 = up, 0 = none, 1 = down) */
  getVertical(): number {
    let v = 0;
    if (this.heldKeys.has('up')) v -= 1;
    if (this.heldKeys.has('down')) v += 1;
    return v;
  }

  /** Check if any movement key is held */
  isMoving(): boolean {
    return (
      this.heldKeys.has('left') ||
      this.heldKeys.has('right') ||
      this.heldKeys.has('up') ||
      this.heldKeys.has('down')
    );
  }
}
