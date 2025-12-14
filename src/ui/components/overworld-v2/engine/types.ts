import type { Camera } from './Camera';

export interface Layer {
  zIndex: number;
  update?(dtMs: number): void;
  render(ctx: CanvasRenderingContext2D, camera: Camera): void;
  setTimeOfDay?(t: number): void;
}

