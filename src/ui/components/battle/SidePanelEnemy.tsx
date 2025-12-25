/**
 * Enemy Side Panel Component
 *
 * Displays all enemy units (HP hidden via CSS).
 */

import { JSX } from 'preact';
import { UnitCard } from './UnitCard';
import type { SidePanelEnemyProps } from './types';

export function SidePanelEnemy({ units, onSelectUnit }: SidePanelEnemyProps): JSX.Element {
  return (
    <div class="enemy-side">
      <div class="side-title">Enemies</div>
      <div class="unit-list">
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onClick={() => onSelectUnit(unit.id)}
          />
        ))}
      </div>
    </div>
  );
}
