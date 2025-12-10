/**
 * SceneTransition
 * Manages fade-to-black transitions between overworld and interior scenes
 */

export type TransitionState = 'idle' | 'fading-out' | 'fading-in';
export type SceneType = 'overworld' | 'interior';

interface TransitionConfig {
  fadeDuration: number;  // ms for each fade direction
  holdDuration: number;  // ms to hold black screen
}

type TransitionCallback = () => void;

export class SceneTransition {
  private state: TransitionState = 'idle';
  private progress: number = 0; // 0-1
  private currentScene: SceneType = 'overworld';
  private targetScene: SceneType = 'overworld';

  private config: TransitionConfig = {
    fadeDuration: 400,
    holdDuration: 100,
  };

  private onSceneChange: TransitionCallback | null = null;
  private onTransitionComplete: TransitionCallback | null = null;
  private elapsedTime: number = 0;

  /**
   * Start a transition to a new scene
   */
  startTransition(toScene: SceneType, onSceneChange?: TransitionCallback, onComplete?: TransitionCallback): void {
    if (this.state !== 'idle') return; // Already transitioning

    this.targetScene = toScene;
    this.state = 'fading-out';
    this.progress = 0;
    this.elapsedTime = 0;
    this.onSceneChange = onSceneChange || null;
    this.onTransitionComplete = onComplete || null;
  }

  /**
   * Update transition state
   */
  update(dt: number): void {
    if (this.state === 'idle') return;

    this.elapsedTime += dt;

    if (this.state === 'fading-out') {
      this.progress = Math.min(1, this.elapsedTime / this.config.fadeDuration);

      if (this.progress >= 1) {
        // Fade out complete - switch scene
        this.currentScene = this.targetScene;
        this.onSceneChange?.();

        // Start hold then fade in
        this.state = 'fading-in';
        this.elapsedTime = -this.config.holdDuration; // Negative to add hold time
        this.progress = 1;
      }
    } else if (this.state === 'fading-in') {
      if (this.elapsedTime < 0) {
        // Still holding at black
        this.progress = 1;
      } else {
        this.progress = Math.max(0, 1 - this.elapsedTime / this.config.fadeDuration);

        if (this.progress <= 0) {
          // Transition complete
          this.state = 'idle';
          this.progress = 0;
          this.onTransitionComplete?.();
          this.onSceneChange = null;
          this.onTransitionComplete = null;
        }
      }
    }
  }

  /**
   * Render transition overlay
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (this.state === 'idle' || this.progress <= 0) return;

    ctx.save();

    // Full screen black overlay with alpha based on progress
    ctx.fillStyle = `rgba(0, 0, 0, ${this.progress})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Optional: Loading text when fully black
    if (this.progress > 0.9) {
      ctx.fillStyle = `rgba(255, 255, 255, ${(this.progress - 0.9) * 10})`;
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const text = this.targetScene === 'interior' ? 'Entering...' : 'Exiting...';
      ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2);
    }

    ctx.restore();
  }

  /**
   * Check if currently transitioning
   */
  isTransitioning(): boolean {
    return this.state !== 'idle';
  }

  /**
   * Get current scene type
   */
  getCurrentScene(): SceneType {
    return this.currentScene;
  }

  /**
   * Get transition progress (0-1)
   */
  getProgress(): number {
    return this.progress;
  }

  /**
   * Get current state
   */
  getState(): TransitionState {
    return this.state;
  }

  /**
   * Force set scene without transition (for initialization)
   */
  setScene(scene: SceneType): void {
    this.currentScene = scene;
    this.targetScene = scene;
    this.state = 'idle';
    this.progress = 0;
  }

  /**
   * Configure transition timing
   */
  setConfig(config: Partial<TransitionConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
