/**
 * Unit Card Component
 *
 * Displays a single unit's status including HP, element, and status effects.
 * Used in both player and enemy side panels.
 */

import { JSX } from 'preact';
import { SimpleSprite } from '../../sprites/SimpleSprite';
import { getPortraitSprite } from '../../sprites/mappings';
import { StatusIcon } from './StatusIcon';
import type { UnitCardProps} from './types';

export function UnitCard({ unit, onClick }: UnitCardProps): JSX.Element {
  const classes = [
    'unit-card',
    unit.isSelected ? 'unit-card--selected' : '',
    unit.isKo ? 'unit-card--ko' : '',
  ].filter(Boolean).join(' ');

  const hpPercentage = unit.hp && unit.maxHp ? (unit.hp / unit.maxHp) * 100 : 0;

  return (
    <div class={classes} onClick={onClick}>
      {/* Sprite */}
      <div class="unit-sprite">
        <SimpleSprite
          id={getPortraitSprite(unit.id)}
          width={32}
          height={32}
          style={{ borderRadius: '4px' }}
          debug={false}
        />
      </div>

      {/* Header: Name + Element */}
      <div class="unit-header">
        <div class="unit-name">{unit.name}</div>
        <div class="unit-element">{unit.element}</div>
      </div>

      {/* HP Row (hidden for enemies via CSS) */}
      {unit.hp !== undefined && unit.maxHp !== undefined && (
        <div class="unit-hp-row">
          <div class="hp-bar">
            <div
              class={`hp-fill ${unit.isKo ? 'hp-fill--empty' : ''}`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
          <div class="hp-text">{unit.hp} / {unit.maxHp}</div>
        </div>
      )}

      {/* Status Row */}
      <div class="unit-status-row">
        {unit.isKo && <div class="unit-status-label">KO</div>}
        <div class="status-icons">
          {unit.statuses.map((status) => (
            <StatusIcon
              key={status.id}
              statusType={status.id}
              title={status.title}
              size={20}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
