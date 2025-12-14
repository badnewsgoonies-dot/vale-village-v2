/**
 * BackgroundLayer
 * Renders distant scenery (mountains) with parallax scrolling
 */

import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';

interface MountainRange {
  points: Array<{ x: number; y: number }>;
  color: string;
  parallaxFactor: number;
}

export class BackgroundLayer implements Layer {
  zIndex = 1;

  private mountainRanges: MountainRange[] = [];
  private baseY: number = 256; // Where mountains meet terrain (4/10 of 640px)
  private timeOfDay: number = 0.5;

  constructor() {
    this.generateMountains();
  }

  private generateMountains(): void {
    this.mountainRanges.push({
      points: this.generateMountainPoints(0.3, 80, 140),
      color: '#3a4a5a',
      parallaxFactor: 0.15,
    });

    this.mountainRanges.push({
      points: this.generateMountainPoints(0.4, 100, 180),
      color: '#4a5a6a',
      parallaxFactor: 0.25,
    });

    this.mountainRanges.push({
      points: this.generateMountainPoints(0.5, 120, 200),
      color: '#5a6a7a',
      parallaxFactor: 0.35,
    });
  }

  private generateMountainPoints(_variance: number, minHeight: number, maxHeight: number): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    const worldWidth = 6000; // Large enough to cover the horizontal sweep.
    let x = -200;

    while (x < worldWidth) {
      const peakHeight = minHeight + Math.random() * (maxHeight - minHeight);
      const peakWidth = 100 + Math.random() * 150;

      points.push({ x, y: this.baseY });

      const peakX = x + peakWidth * (0.3 + Math.random() * 0.4);
      points.push({ x: peakX, y: this.baseY - peakHeight });

      if (Math.random() > 0.5) {
        const midX = peakX + peakWidth * 0.2;
        const midHeight = peakHeight * (0.6 + Math.random() * 0.3);
        points.push({ x: midX, y: this.baseY - midHeight });
      }

      x += peakWidth;
    }

    points.push({ x: worldWidth + 200, y: this.baseY });

    return points;
  }

  setTimeOfDay(time: number): void {
    this.timeOfDay = time;
    this.updateMountainColors();
  }

  private updateMountainColors(): void {
    const isNight = this.timeOfDay < 0.25 || this.timeOfDay > 0.80;
    const isDusk = this.timeOfDay > 0.70 && this.timeOfDay <= 0.80;
    const isDawn = this.timeOfDay > 0.25 && this.timeOfDay <= 0.35;
    const [back, mid, front] = this.mountainRanges;
    if (!back || !mid || !front) return;

    if (isNight) {
      back.color = '#1a2030';
      mid.color = '#252a3a';
      front.color = '#303545';
    } else if (isDusk) {
      back.color = '#4a3a4a';
      mid.color = '#5a4a5a';
      front.color = '#6a5a6a';
    } else if (isDawn) {
      back.color = '#4a4a5a';
      mid.color = '#5a5a6a';
      front.color = '#6a6a7a';
    } else {
      back.color = '#3a4a5a';
      mid.color = '#4a5a6a';
      front.color = '#5a6a7a';
    }
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    for (const range of this.mountainRanges) {
      this.drawMountainRange(ctx, camera, range);
    }
  }

  private drawMountainRange(ctx: CanvasRenderingContext2D, camera: Camera, range: MountainRange): void {
    const offset = camera.getParallaxOffset(range.parallaxFactor);

    ctx.save();
    ctx.fillStyle = range.color;
    ctx.beginPath();

    ctx.moveTo(-200 + offset.x, this.baseY);

    for (const point of range.points) {
      ctx.lineTo(point.x + offset.x, point.y);
    }

    ctx.lineTo(ctx.canvas.width + 200, this.baseY);
    ctx.closePath();
    ctx.fill();

    const gradient = ctx.createLinearGradient(0, this.baseY - 200, 0, this.baseY);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }
}

