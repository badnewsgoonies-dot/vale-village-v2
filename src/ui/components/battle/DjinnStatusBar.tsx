import type { Unit } from '../../../core/models/Unit';
import type { JSX } from 'preact';

interface DjinnStatusBarProps {
  unit: Unit;
  djinnData: Record<string, any>;
  djinnSpriteByElement: Record<string, string>;
}

export function DjinnStatusBar({ unit, djinnData, djinnSpriteByElement }: DjinnStatusBarProps): JSX.Element | null {
  const ids = unit.djinn || [];
  if (!ids || ids.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 6, pointerEvents: 'none' }}>
      {ids.map((djId) => {
        const dj = djinnData[djId];
        if (!dj) return null;
        const sprite = djinnSpriteByElement[dj.element] || '/sprites/battle/djinn/Venus_Djinn_Front.gif';
        const state = (unit.djinnStates && unit.djinnStates[djId]) || 'Standby';

        const baseStyle: Record<string, any> = {
          width: 18,
          height: 18,
          imageRendering: 'pixelated',
          transformOrigin: 'center',
          display: 'block',
        };

        let stateStyle: Record<string, any> = {};
        if (state === 'Set') {
          stateStyle = { filter: 'drop-shadow(0 0 8px rgba(129,199,132,0.95))', transform: 'scale(1.15)' };
        } else if (state === 'Standby') {
          stateStyle = { opacity: 0.45, transform: 'scale(1)' };
        } else if (state === 'Recovery') {
          stateStyle = { animation: 'activePulse 900ms ease-in-out infinite', filter: 'drop-shadow(0 0 8px rgba(255,183,77,0.9))' };
        }

        return (
          <img
            key={djId}
            src={sprite}
            alt={dj.name}
            width={18}
            height={18}
            style={{ ...baseStyle, ...stateStyle }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
