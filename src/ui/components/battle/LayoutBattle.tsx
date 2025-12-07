/**
 * Layout Battle Component
 *
 * Optional layout wrapper for the battle screen.
 * Could be extended with phase transitions, animations, etc.
 */

import { JSX } from 'preact';
import type { LayoutBattleProps } from './types';

export function LayoutBattle({ children, phase }: LayoutBattleProps): JSX.Element {
  return (
    <div class="game-root" data-battle-phase={phase}>
      <div class="battle-screen">
        {children}
      </div>
    </div>
  );
}
