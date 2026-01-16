import type { Layer } from '../engine/types';
import type { Camera } from '../engine/Camera';
import type { EnemyState } from '../../../../core/logic';

export class HudLayer implements Layer {
  zIndex = 999; // Top priority

  constructor(
    private getEnemies: () => EnemyState[],
    private getPlayerStats: () => { hp: number; maxHp: number }
  ) {}

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const enemies = this.getEnemies();
    const player = this.getPlayerStats();

    ctx.save();
    
    // 1. Draw Enemy HP (World Space)
    for (const enemy of enemies) {
      if (enemy.hp > 0) {
        this.drawEnemyHP(ctx, camera, enemy);
      }
    }

    // 2. Draw Player HP (Screen Space - Fixed)
    this.drawPlayerHP(ctx, player);

    ctx.restore();
  }

  private drawEnemyHP(ctx: CanvasRenderingContext2D, camera: Camera, enemy: EnemyState) {
    const screen = camera.worldToScreenSnapped(enemy.position.x, enemy.position.y);
    const barX = screen.x - 16;
    const barY = screen.y - 50; // Above head
    const w = 32;
    const h = 4;
    
    // Use real maxHp from state
    const pct = Math.max(0, Math.min(1, enemy.hp / enemy.maxHp));

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(barX, barY, w, h);

    // Fill
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(barX, barY, w * pct, h);

    // Text
    ctx.fillStyle = 'white';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 2;
    ctx.fillText(Math.ceil(enemy.hp).toString(), screen.x, barY - 2);
    ctx.shadowBlur = 0;
  }

  private drawPlayerHP(ctx: CanvasRenderingContext2D, player: { hp: number; maxHp: number }) {
    const x = 20;
    const y = 20;
    const w = 200;
    const h = 20;
    const pct = Math.max(0, Math.min(1, player.hp / player.maxHp));

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x, y, w, h);

    // Fill
    ctx.fillStyle = pct > 0.5 ? '#33ff33' : pct > 0.25 ? '#ffff33' : '#ff3333';
    ctx.fillRect(x, y, w * pct, h);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 2;
    ctx.fillText(`HP: ${Math.floor(player.hp)} / ${player.maxHp}`, x + 10, y + 15);
    ctx.shadowBlur = 0;
  }
}
