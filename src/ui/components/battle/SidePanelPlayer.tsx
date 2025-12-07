/**
 * Player Side Panel Component
 *
 * Displays all player units with full HP and status information.
 */

import { JSX } from 'preact';
import { UnitCard } from './UnitCard';
import type { SidePanelPlayerProps } from './types';

export function SidePanelPlayer({ units, onSelectUnit }: SidePanelPlayerProps): JSX.Element {
  return (
    <div class="player-side">
      <div class="side-title">Player Party</div>
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
