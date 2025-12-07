/**
 * TeamBenchSection Component
 * Displays active party (2x2 grid) and bench units (vertical list)
 */

import { JSX } from 'preact';
import type { Unit } from '@/core/models/Unit';
import { MAX_PARTY_SIZE } from '@/core/constants';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings';

interface TeamBenchSectionProps {
  activeParty: readonly (Unit | null)[];
  benchUnits: readonly Unit[];
  selectedSlotIndex: number | null;
  onSelectSlot: (index: number | null) => void;
  onAddToSlot: (slotIndex: number, unitId: string) => void;
}

export function TeamBenchSection({
  activeParty,
  benchUnits,
  selectedSlotIndex,
  onSelectSlot,
  onAddToSlot,
}: TeamBenchSectionProps): JSX.Element {
  const handleSlotClick = (index: number) => {
    onSelectSlot(index);
  };

  const handleBenchUnitClick = (unitId: string) => {
    if (selectedSlotIndex !== null) {
      onAddToSlot(selectedSlotIndex, unitId);
    }
  };

  // Create array of 4 slots (filled or empty)
  const filledUnitCount = activeParty.filter((unit): unit is Unit => Boolean(unit)).length;
  const slots = Array.from({ length: MAX_PARTY_SIZE }, (_, i) => ({
    index: i,
    unit: activeParty[i],
  }));

  return (
    <div class="section-card team-bench-section">
      <div class="current-party-panel">
        <div class="section-title">YOUR TEAM ({filledUnitCount}/{MAX_PARTY_SIZE})</div>
        <div class="current-party-grid">
          {slots.map(({ index, unit }) => (
            <div
              key={index}
              class={`party-slot ${unit ? 'filled' : 'empty'} ${
                selectedSlotIndex === index ? 'selected' : ''
              }`}
              onClick={() => handleSlotClick(index)}
            >
              {unit ? (
                <>
                  <div class="unit-portrait">
                    <SimpleSprite
                      id={getPortraitSprite(unit.id)}
                      width={56}
                      height={56}
                      alt={`${unit.name} portrait`}
                    />
                  </div>
                  <div class="unit-name">{unit.name}</div>
                  <div class="unit-level">Lv. {unit.level}</div>
                  <div class="unit-element">{unit.element}</div>
                </>
              ) : (
                <div class="empty-slot-text">[+]</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div class="bench-panel">
        <div class="section-title">BENCH UNITS</div>
        <div class="bench-grid">
          {benchUnits.length === 0 ? (
            <div class="empty-slot-text" style={{ textAlign: 'center', padding: '1rem' }}>
              No bench units available
            </div>
          ) : (
            benchUnits.slice(0, 4).map((unit) => (
              <div
                key={unit.id}
                class="bench-unit-compact"
                onClick={() => handleBenchUnitClick(unit.id)}
              >
                <div class="bench-portrait">
                  <SimpleSprite
                    id={getPortraitSprite(unit.id)}
                    width={44}
                    height={44}
                    alt={`${unit.name} portrait`}
                  />
                </div>
                <div class="bench-unit-info">
                  <div class="unit-name">{unit.name}</div>
                  <div class="unit-level">Lv. {unit.level}</div>
                  <div class="unit-element">{unit.element}</div>
                </div>
              </div>
            ))
          )}
        </div>
        {benchUnits.length > 4 && (
          <div
            style={{
              fontSize: '0.7rem',
              color: '#666',
              textAlign: 'center',
              padding: '0.5rem',
              fontStyle: 'italic',
              marginTop: '0.25rem',
            }}
          >
            +{benchUnits.length - 4} more units in roster
          </div>
        )}
      </div>
    </div>
  );
}
