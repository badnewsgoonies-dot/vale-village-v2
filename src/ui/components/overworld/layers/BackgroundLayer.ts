/**
 * BackgroundLayer
 * Renders distant scenery (mountains) with parallax scrolling
 */

import type { Layer, Camera } from '../engine/types';

interface MountainRange {
  points: Array<{ x: number; y: number }>;
  color: string;
  parallaxFactor: number;
}

export class BackgroundLayer implements Layer {
  zIndex = 1;

  private mountainRanges: MountainRange[] = [];
  private baseY: number = 300; // Where mountains meet terrain
  private timeOfDay: number = 0.5;

  constructor() {
    this.generateMountains();
  }

  private generateMountains(): void {
    // Back mountain range (slowest parallax, darker)
    this.mountainRanges.push({
      points: this.generateMountainPoints(0.3, 80, 140),
      color: '#3a4a5a',
      parallaxFactor: 0.15,
    });

    // Middle mountain range
    this.mountainRanges.push({
      points: this.generateMountainPoints(0.4, 100, 180),
      color: '#4a5a6a',
      parallaxFactor: 0.25,
    });

    // Front mountain range (fastest parallax, lightest)
    this.mountainRanges.push({
      points: this.generateMountainPoints(0.5, 120, 200),
      color: '#5a6a7a',
      parallaxFactor: 0.35,
    });
  }

  private generateMountainPoints(_variance: number, minHeight: number, maxHeight: number): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    const worldWidth = 2000; // Extended width for scrolling
    let x = -200;

    while (x < worldWidth) {
      // Generate peak
      const peakHeight = minHeight + Math.random() * (maxHeight - minHeight);
      const peakWidth = 100 + Math.random() * 150;

      // Left slope
      points.push({ x, y: this.baseY });

      // Peak
      const peakX = x + peakWidth * (0.3 + Math.random() * 0.4);
      points.push({ x: peakX, y: this.baseY - peakHeight });

      // Add some variation to the peak area
      if (Math.random() > 0.5) {
        const midX = peakX + peakWidth * 0.2;
        const midHeight = peakHeight * (0.6 + Math.random() * 0.3);
        points.push({ x: midX, y: this.baseY - midHeight });
      }

      x += peakWidth;
    }

    // Close the path
    points.push({ x: worldWidth + 200, y: this.baseY });

    return points;
  }

  setTimeOfDay(time: number): void {
    this.timeOfDay = time;
    this.updateMountainColors();
  }

  private updateMountainColors(): void {
    // Adjust mountain colors based on time of day
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
      // Day colors
      back.color = '#3a4a5a';
      mid.color = '#4a5a6a';
      front.color = '#5a6a7a';
    }
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    // Draw each mountain range with parallax
    for (const range of this.mountainRanges) {
      this.drawMountainRange(ctx, camera, range);
    }

    // Draw distant trees/forest at base of mountains
    this.drawDistantForest(ctx, camera);
  }

  private drawMountainRange(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    range: MountainRange
  ): void {
    const offset = camera.getParallaxOffset(range.parallaxFactor);

    ctx.save();
    ctx.fillStyle = range.color;
    ctx.beginPath();

    // Start from bottom left
    ctx.moveTo(-200 + offset.x, this.baseY);

    // Draw mountain silhouette
    for (const point of range.points) {
      ctx.lineTo(point.x + offset.x, point.y);
    }

    // Close path at bottom
    ctx.lineTo(ctx.canvas.width + 200, this.baseY);
    ctx.closePath();
    ctx.fill();

    // Add subtle gradient overlay for depth
    const gradient = ctx.createLinearGradient(0, this.baseY - 200, 0, this.baseY);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }

  private drawDistantForest(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const offset = camera.getParallaxOffset(0.4);
    const forestY = this.baseY - 20;
    const treeSpacing = 25;

    ctx.save();

    // Forest base color
    const isNight = this.timeOfDay < 0.25 || this.timeOfDay > 0.80;
    const treeColor = isNight ? '#1a2a1a' : '#2a4a2a';

    for (let x = -50; x < ctx.canvas.width + 100; x += treeSpacing) {
      const worldX = x + offset.x * 0.4;
      const height = 15 + Math.sin(worldX * 0.1) * 8;

      // Simple triangular tree silhouette
      ctx.fillStyle = treeColor;
      ctx.beginPath();
      ctx.moveTo(worldX, forestY);
      ctx.lineTo(worldX - 8, forestY + height);
      ctx.lineTo(worldX + 8, forestY + height);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}
