/**
 * Djinn Panel Component
 *
 * Displays Djinn available for activation/summon.
 * Shows current state (SET/STANDBY/RECOVERY) and recovery timers.
 */

import { JSX } from 'preact';
import type { DjinnPanelProps } from './types';

export function DjinnPanel({ djinns, onSelectDjinn }: DjinnPanelProps): JSX.Element {
  return (
    <div class="djinn-popup">
      <div class="djinn-popup-title">Djinn – Activation</div>
      <div class="djinn-list">
        {djinns.map((djinn) => {
          const classes = [
            'djinn-entry',
            !djinn.isSelectable ? 'djinn-entry--disabled' : '',
          ].filter(Boolean).join(' ');

          const stateLabel =
            djinn.state === 'set' ? '[SET]' :
            djinn.state === 'standby' ? `[STANDBY – ${djinn.turnsRemaining} turns]` :
            `[RECOVERY – ${djinn.turnsRemaining} turns]`;

          const stateClass =
            djinn.state === 'set' ? 'djinn-state--set' :
            djinn.state === 'standby' ? 'djinn-state--standby' :
            'djinn-state--recovery';

          return (
            <div
              key={djinn.id}
              class={classes}
              onClick={() => djinn.isSelectable && onSelectDjinn(djinn.id)}
            >
              <div class="djinn-entry-header">
                <span class="djinn-name">{djinn.name}</span>
                <span class={stateClass}>{stateLabel}</span>
              </div>
              <div class="djinn-effect">{djinn.summonDescription}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
