/**
 * InteriorFurnitureLayer
 * Renders Y-sorted furniture with drop shadows for indoor scenes
 * Creates depth through Y-position sorting and shadow rendering
 */

import type { Layer, Camera, WorldPosition } from '../engine/types';

interface FurnitureItem {
  id: string;
  type: 'table' | 'chair' | 'bed' | 'bookshelf' | 'chest' | 'fireplace' | 'rug' | 'plant' | 'lamp';
  x: number;      // Relative to room
  y: number;      // Relative to room (for Y-sorting)
  width: number;
  height: number;
  spriteId?: string;
}

interface InteriorConfig {
  roomX: number;
  roomY: number;
  roomWidth: number;
  roomHeight: number;
}

export class InteriorFurnitureLayer implements Layer {
  zIndex = 1;

  private furniture: FurnitureItem[] = [];
  private playerPos: WorldPosition = { x: 0, y: 0 };
  private playerFacing: 'up' | 'down' | 'left' | 'right' = 'down';

  private config: InteriorConfig = {
    roomX: 320,
    roomY: 250,
    roomWidth: 320,
    roomHeight: 240,
  };

  setRoomConfig(config: InteriorConfig): void {
    this.config = config;
  }

  /**
   * Set furniture layout for current room
   */
  setFurniture(items: FurnitureItem[]): void {
    this.furniture = items;
  }

  /**
   * Generate default furniture for a house interior
   */
  generateDefaultFurniture(): void {
    const { roomWidth, roomHeight } = this.config;

    this.furniture = [
      // Table in center
      { id: 'table-1', type: 'table', x: roomWidth / 2 - 30, y: roomHeight / 2 - 20, width: 60, height: 40 },
      // Chairs around table
      { id: 'chair-1', type: 'chair', x: roomWidth / 2 - 50, y: roomHeight / 2, width: 20, height: 30 },
      { id: 'chair-2', type: 'chair', x: roomWidth / 2 + 30, y: roomHeight / 2, width: 20, height: 30 },
      // Bed in corner
      { id: 'bed-1', type: 'bed', x: 20, y: 40, width: 50, height: 80 },
      // Bookshelf against wall
      { id: 'bookshelf-1', type: 'bookshelf', x: roomWidth - 50, y: 20, width: 40, height: 70 },
      // Chest
      { id: 'chest-1', type: 'chest', x: 100, y: roomHeight - 50, width: 40, height: 30 },
      // Rug (no shadow, flat)
      { id: 'rug-1', type: 'rug', x: roomWidth / 2 - 50, y: roomHeight / 2 - 30, width: 100, height: 60 },
    ];
  }

  setPlayerPosition(pos: WorldPosition, facing: 'up' | 'down' | 'left' | 'right'): void {
    // Convert world position to room-relative position
    this.playerPos = {
      x: pos.x - this.config.roomX,
      y: pos.y - this.config.roomY,
    };
    this.playerFacing = facing;
  }

  render(ctx: CanvasRenderingContext2D, _camera: Camera): void {
    const { roomX, roomY } = this.config;

    // Combine furniture and player for Y-sorting
    const renderables: Array<{ item: FurnitureItem | 'player'; y: number }> = [];

    for (const item of this.furniture) {
      renderables.push({ item, y: item.y + item.height });
    }

    // Add player
    renderables.push({ item: 'player', y: this.playerPos.y });

    // Sort by Y (bottom of item)
    renderables.sort((a, b) => a.y - b.y);

    // Render each item
    for (const { item } of renderables) {
      if (item === 'player') {
        this.drawPlayer(ctx, roomX, roomY);
      } else {
        this.drawFurniture(ctx, item, roomX, roomY);
      }
    }

    // Draw exit door marker at bottom center
    this.drawExitMarker(ctx, roomX, roomY);
  }

  private drawFurniture(ctx: CanvasRenderingContext2D, item: FurnitureItem, roomX: number, roomY: number): void {
    const x = roomX + item.x;
    const y = roomY + item.y;

    // Skip shadow for flat items like rugs
    if (item.type !== 'rug') {
      // Draw drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(
        x + item.width / 2,
        y + item.height + 4,
        item.width * 0.4,
        6,
        0, 0, Math.PI * 2
      );
      ctx.fill();
    }

    // Draw furniture placeholder based on type
    this.drawFurniturePlaceholder(ctx, item, x, y);
  }

  private drawFurniturePlaceholder(ctx: CanvasRenderingContext2D, item: FurnitureItem, x: number, y: number): void {
    ctx.save();

    switch (item.type) {
      case 'table':
        // Table top
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(x, y, item.width, item.height);
        // Legs
        ctx.fillStyle = '#4a3010';
        ctx.fillRect(x + 5, y + item.height - 5, 6, 8);
        ctx.fillRect(x + item.width - 11, y + item.height - 5, 6, 8);
        break;

      case 'chair':
        // Seat
        ctx.fillStyle = '#7B5B3A';
        ctx.fillRect(x, y + 10, item.width, 12);
        // Back
        ctx.fillStyle = '#6B4B2A';
        ctx.fillRect(x + 2, y, item.width - 4, 12);
        // Legs
        ctx.fillStyle = '#4a3010';
        ctx.fillRect(x + 2, y + 22, 4, 10);
        ctx.fillRect(x + item.width - 6, y + 22, 4, 10);
        break;

      case 'bed':
        // Frame
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(x, y, item.width, item.height);
        // Mattress
        ctx.fillStyle = '#e8e0d8';
        ctx.fillRect(x + 4, y + 4, item.width - 8, item.height - 20);
        // Pillow
        ctx.fillStyle = '#f0f0e8';
        ctx.fillRect(x + 6, y + 6, item.width - 12, 20);
        // Blanket
        ctx.fillStyle = '#8a6050';
        ctx.fillRect(x + 4, y + 30, item.width - 8, item.height - 46);
        break;

      case 'bookshelf':
        // Frame
        ctx.fillStyle = '#5a3a2a';
        ctx.fillRect(x, y, item.width, item.height);
        // Shelves
        ctx.fillStyle = '#7a5a4a';
        for (let sy = 15; sy < item.height - 10; sy += 20) {
          ctx.fillRect(x + 3, y + sy, item.width - 6, 4);
        }
        // Books (colored spines)
        const bookColors = ['#c04040', '#4060c0', '#40a040', '#a0a040', '#8040a0'];
        for (let sy = 4; sy < item.height - 20; sy += 20) {
          for (let bx = 0; bx < 5; bx++) {
            const color = bookColors[(sy + bx) % bookColors.length] ?? '#c04040';
            ctx.fillStyle = color;
            ctx.fillRect(x + 5 + bx * 7, y + sy, 6, 14);
          }
        }
        break;

      case 'chest':
        // Body
        ctx.fillStyle = '#6a4a30';
        ctx.fillRect(x, y + 8, item.width, item.height - 8);
        // Lid
        ctx.fillStyle = '#7a5a40';
        ctx.fillRect(x, y, item.width, 12);
        // Metal trim
        ctx.fillStyle = '#a0a0a0';
        ctx.fillRect(x + item.width / 2 - 6, y + 4, 12, 20);
        break;

      case 'rug':
        // Decorative rug pattern
        ctx.fillStyle = '#804040';
        ctx.fillRect(x, y, item.width, item.height);
        // Border
        ctx.strokeStyle = '#c08040';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 5, y + 5, item.width - 10, item.height - 10);
        // Center pattern
        ctx.fillStyle = '#c08040';
        ctx.beginPath();
        ctx.arc(x + item.width / 2, y + item.height / 2, 15, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'plant':
        // Pot
        ctx.fillStyle = '#8a5a4a';
        ctx.fillRect(x + item.width / 4, y + item.height - 15, item.width / 2, 15);
        // Plant
        ctx.fillStyle = '#3a8a3a';
        ctx.beginPath();
        ctx.arc(x + item.width / 2, y + item.height / 2, item.width / 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'lamp':
        // Base
        ctx.fillStyle = '#a0a0a0';
        ctx.fillRect(x + item.width / 2 - 8, y + item.height - 10, 16, 10);
        // Pole
        ctx.fillStyle = '#808080';
        ctx.fillRect(x + item.width / 2 - 2, y + 15, 4, item.height - 25);
        // Shade
        ctx.fillStyle = '#e8d8c0';
        ctx.beginPath();
        ctx.moveTo(x, y + 15);
        ctx.lineTo(x + item.width, y + 15);
        ctx.lineTo(x + item.width - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.closePath();
        ctx.fill();
        break;

      case 'fireplace':
        // Stone frame
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(x, y, item.width, item.height);
        // Opening
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + 8, y + 15, item.width - 16, item.height - 15);
        // Fire glow
        ctx.fillStyle = 'rgba(255, 100, 50, 0.6)';
        ctx.beginPath();
        ctx.arc(x + item.width / 2, y + item.height - 10, 15, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, roomX: number, roomY: number): void {
    const x = roomX + this.playerPos.x;
    const y = roomY + this.playerPos.y;
    const width = 28;
    const height = 40;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 3, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Player body
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x - width / 2, y - height, width, height);

    // Head
    ctx.fillStyle = '#f5d5c8';
    ctx.fillRect(x - width / 2 + 4, y - height + 2, width - 8, 12);

    // Direction indicator
    ctx.fillStyle = '#fff';
    let ix = x, iy = y - height / 2;
    switch (this.playerFacing) {
      case 'up': iy = y - height - 4; break;
      case 'down': iy = y + 4; break;
      case 'left': ix = x - width / 2 - 4; break;
      case 'right': ix = x + width / 2 + 4; break;
    }
    ctx.beginPath();
    ctx.arc(ix, iy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawExitMarker(ctx: CanvasRenderingContext2D, roomX: number, roomY: number): void {
    const { roomWidth, roomHeight } = this.config;
    const exitX = roomX + roomWidth / 2;
    const exitY = roomY + roomHeight + 10;

    // Pulsing animation
    const pulse = Math.sin(Date.now() * 0.004) * 0.2 + 0.8;

    // Exit glow
    const gradient = ctx.createRadialGradient(exitX, exitY, 0, exitX, exitY, 30);
    gradient.addColorStop(0, `rgba(100, 200, 255, ${0.4 * pulse})`);
    gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(exitX, exitY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Exit text
    ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', exitX, exitY + 4);
  }
}
