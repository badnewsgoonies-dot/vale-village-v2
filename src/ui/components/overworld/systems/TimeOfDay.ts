/**
 * TimeOfDay System
 * Manages the day/night cycle and provides time-based values to all layers
 */

export interface TimeColors {
  skyTop: string;
  skyBottom: string;
  ambient: string;
  ambientAlpha: number;
}

export class TimeOfDay {
  /** Current time value (0 = midnight, 0.5 = noon, 1 = midnight) */
  private value: number = 0.5;

  /** Absolute time for animations */
  private time: number = 0;

  /** Duration of a full day/night cycle in milliseconds */
  private cycleDuration: number = 300000; // 5 minutes

  /** Is the cycle paused? */
  private paused: boolean = true; // Start paused by default

  /** Cycle speed multiplier */
  private speed: number = 1;

  /**
   * Get current time value (0-1)
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Get absolute time (for animations)
   */
  getTime(): number {
    return this.time;
  }

  /**
   * Check if it's currently daytime
   */
  isDay(): boolean {
    return this.value > 0.25 && this.value < 0.75;
  }

  /**
   * Check if it's currently nighttime
   */
  isNight(): boolean {
    return this.value < 0.20 || this.value > 0.85;
  }

  /**
   * Check if it's dawn
   */
  isDawn(): boolean {
    return this.value >= 0.20 && this.value <= 0.35;
  }

  /**
   * Check if it's dusk
   */
  isDusk(): boolean {
    return this.value >= 0.70 && this.value <= 0.85;
  }

  /**
   * Set time directly (0-1)
   */
  setTime(value: number): void {
    this.value = ((value % 1) + 1) % 1; // Normalize to 0-1
  }

  /**
   * Set time by hour (0-24)
   */
  setHour(hour: number): void {
    // 0 = midnight, 6 = dawn, 12 = noon, 18 = dusk
    this.value = (hour / 24) % 1;
  }

  /**
   * Pause the cycle
   */
  pause(): void {
    this.paused = true;
  }

  /**
   * Resume the cycle
   */
  resume(): void {
    this.paused = false;
  }

  /**
   * Toggle pause state
   */
  togglePause(): void {
    this.paused = !this.paused;
  }

  /**
   * Check if paused
   */
  isPaused(): boolean {
    return this.paused;
  }

  /**
   * Set cycle duration
   */
  setCycleDuration(ms: number): void {
    this.cycleDuration = Math.max(10000, ms); // Minimum 10 seconds
  }

  /**
   * Set cycle speed multiplier
   */
  setSpeed(speed: number): void {
    this.speed = Math.max(0.1, Math.min(10, speed));
  }

  /**
   * Update time (call each frame)
   */
  update(dt: number): void {
    this.time += dt;

    if (!this.paused) {
      const delta = (dt * this.speed) / this.cycleDuration;
      this.value = (this.value + delta) % 1;
    }
  }

  /**
   * Get ambient lighting overlay color and alpha
   */
  getAmbientLighting(): { color: string; alpha: number } {
    if (this.isNight()) {
      return { color: '#000030', alpha: 0.45 };
    } else if (this.isDawn() || this.isDusk()) {
      const progress = this.isDawn()
        ? (this.value - 0.20) / 0.15
        : 1 - (this.value - 0.70) / 0.15;
      return { color: '#000020', alpha: 0.25 * (1 - progress) };
    }
    return { color: '#000000', alpha: 0 };
  }

  /**
   * Get current time as a readable string
   */
  getTimeString(): string {
    const hour = Math.floor(this.value * 24);
    const minute = Math.floor((this.value * 24 * 60) % 60);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  /**
   * Get period name
   */
  getPeriodName(): string {
    if (this.isNight()) return 'Night';
    if (this.isDawn()) return 'Dawn';
    if (this.isDusk()) return 'Dusk';
    if (this.value < 0.5) return 'Morning';
    return 'Afternoon';
  }
}
