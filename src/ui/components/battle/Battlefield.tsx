/**
 * Battlefield Component
 *
 * Visual representation of the battle space with unit sprites.
 * Handles target selection during planning phase.
 */

import { JSX } from 'preact';
import { BackgroundSprite } from '../../sprites/BackgroundSprite';
import { BattleUnitSprite } from '../BattleUnitSprite';
import type { BattlefieldProps } from './types';

export function Battlefield({
  playerUnits,
  enemyUnits,
  targetingMode,
  onSelectTarget,
}: BattlefieldProps): JSX.Element {
  return (
    <div class="battlefield" style={{ position: 'relative' }}>
      <BackgroundSprite
        id="random"
        category="backgrounds-gs1"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
      <div class="battlefield-inner" style={{ position: 'relative', zIndex: 1 }}>
        {/* Player column (left side) */}
        <div class="battlefield-column">
          {playerUnits.map((unit) => {
            const classes = [
              'battlefield-unit',
              unit.isSelected ? 'battlefield-unit--current' : '',
              targetingMode && !unit.isKo ? 'targetable' : '',
            ].filter(Boolean).join(' ');

            return (
              <div
                key={unit.id}
                class={classes}
                onClick={() => targetingMode && onSelectTarget?.(unit.id)}
                style={{ opacity: unit.isKo ? 0.4 : 1 }}
              >
                <BattleUnitSprite
                  unitId={unit.id}
                  state="idle"
                  size="medium"
                />
              </div>
            );
          })}
        </div>

        {/* Enemy column (right side) */}
        <div class="battlefield-column">
          {enemyUnits.map((enemy) => {
            const classes = [
              'battlefield-unit',
              targetingMode && !enemy.isKo ? 'targetable' : '',
            ].filter(Boolean).join(' ');

            return (
              <div
                key={enemy.id}
                class={classes}
                onClick={() => targetingMode && onSelectTarget?.(enemy.id)}
                style={{ opacity: enemy.isKo ? 0.4 : 1 }}
              >
                <BattleUnitSprite
                  unitId={enemy.id}
                  state="idle"
                  size="medium"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
