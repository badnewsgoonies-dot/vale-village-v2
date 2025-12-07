/**
 * EnemyPortalTile Component
 * Minimal enemy display (illustrative portal tile design)
 */

import { JSX } from 'preact';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { ENEMIES } from '@/data/definitions/enemies';
import { getEnemyBattleSprite } from '../sprites/mappings';
import { SimpleSprite } from '../sprites/SimpleSprite';

interface EnemyPortalTileProps {
  encounterId: string;
}

export function EnemyPortalTile({ encounterId }: EnemyPortalTileProps): JSX.Element {
  const encounter = ENCOUNTERS[encounterId];
  if (!encounter) {
    return (
      <div class="enemies-section">
        <div class="enemy-portal">
          <div class="portal-title">ENEMIES</div>
          <div class="portal-enemies">Unknown</div>
        </div>
      </div>
    );
  }

  // Get enemy names from encounter
  const enemyNames = encounter.enemies
    .map((enemyId) => {
      const enemy = ENEMIES[enemyId];
      return enemy?.name || enemyId;
    })
    .join(' • ');

  const enemyEntries = encounter.enemies.map((enemyId) => {
    const enemy = ENEMIES[enemyId];
    return {
      id: enemyId,
      name: enemy?.name ?? enemyId,
      spriteId: getEnemyBattleSprite(enemyId, 'idle'),
    };
  });

  return (
    <div class="enemies-section">
      <div class="enemy-portal">
        <div class="portal-icon">⚔️</div>
        <div class="portal-title">ENEMIES</div>
        <div class="portal-enemies">{enemyNames || 'None'}</div>
        <div class="enemy-portraits">
          {enemyEntries.map((entry) => (
            <div key={entry.id} class="enemy-portrait-chip">
              {entry.spriteId ? (
                <SimpleSprite id={entry.spriteId} width={36} height={36} alt={entry.name} />
              ) : (
                <div class="enemy-portrait-fallback">?</div>
              )}
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
