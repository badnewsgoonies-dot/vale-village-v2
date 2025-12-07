/**
 * DjinnSection Component
 * Djinn slots + granted abilities panel
 */

import { JSX } from 'preact';
import type { Unit } from '@/core/models/Unit';
import type { Team } from '@/core/models/Team';
import { getDjinnAbilityMetadataForUnit } from '@/core/algorithms/djinnAbilities';
import { DJINN } from '@/data/definitions/djinn';

interface DjinnSectionProps {
  unit: Unit;
  team: Team;
  selectedSlot: number | null;
  onSelectSlot: (slot: number | null) => void;
  djinnSlots: readonly (string | null)[];
  onEquipDjinn: (djinnId: string, slotIndex: number) => void;
  onUnequipDjinn: (slotIndex: number) => void;
}

export function DjinnSection({
  unit,
  team,
  selectedSlot,
  onSelectSlot,
  djinnSlots,
  onEquipDjinn,
  onUnequipDjinn,
}: DjinnSectionProps): JSX.Element {
  const selectedDjinnIds = djinnSlots.filter((id): id is string => Boolean(id));
  const availableDjinn = team.collectedDjinn.filter((djinnId) => !selectedDjinnIds.includes(djinnId));

  // Get granted abilities for this unit
  const abilityMetadata = getDjinnAbilityMetadataForUnit(unit, team);

  const handleEquipClick = (djinnId: string) => {
    if (selectedSlot === null) return;
    onEquipDjinn(djinnId, selectedSlot);
    onSelectSlot(null);
  };

  return (
    <div class="section-card djinn-section">
      <div class="djinn-slots-panel">
        <div class="section-title">DJINN CONFIGURATION</div>
        <div class="djinn-slots-grid">
          {[0, 1, 2].map((slotIndex) => {
            const djinnId = djinnSlots[slotIndex];
            const hasDjinn = Boolean(djinnId);
            const djinn = hasDjinn ? DJINN[djinnId as keyof typeof DJINN] : null;
            const isSelected = selectedSlot === slotIndex;

            return (
              <div
                key={slotIndex}
                class={`djinn-slot ${djinn ? '' : 'empty'} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectSlot(isSelected ? null : slotIndex)}
              >
                {djinn ? (
                  <>
                    <div class="djinn-sprite">{djinn.element[0]}</div>
                    <div class="djinn-name">{djinn.name}</div>
                    <div class="djinn-element">{djinn.element}</div>
                    <div class="djinn-state">
                      {hasDjinn && djinnId ? team.djinnTrackers[djinnId]?.state : 'Set'}
                    </div>
                    {isSelected && (
                      <button
                        class="change-btn"
                        style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.7rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUnequipDjinn(slotIndex);
                          onSelectSlot(null);
                        }}
                      >
                        Unequip
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div class="empty-slot-text">(Empty)</div>
                    {isSelected && availableDjinn.length > 0 && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#4a9eff' }}>
                        Click Djinn below to equip
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        {selectedSlot !== null && availableDjinn.length > 0 && (
          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {availableDjinn.slice(0, 4).map((djinnId) => {
              const djinn = DJINN[djinnId];
              if (!djinn) return null;
              return (
                  <button
                    key={djinnId}
                    class="compendium-tab"
                    onClick={() => handleEquipClick(djinnId)}
                  >
                  {djinn.name} ({djinn.element})
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div class="djinn-abilities-panel">
        <div class="abilities-title">GRANTED ABILITIES ({unit.name})</div>
        <div class="abilities-content">
          {abilityMetadata.length === 0 ? (
            <div class="ability-item" style={{ color: '#666', textAlign: 'center' }}>
              No abilities granted by Djinn
            </div>
          ) : (
            abilityMetadata.slice(0, 6).map((meta, index) => {
              const ability = unit.abilities.find((a) => a.id === meta.abilityId);
              const djinn = DJINN[meta.djinnId];
              const compatibilityColor =
                meta.compatibility === 'same'
                  ? '#4a9eff'
                  : meta.compatibility === 'counter'
                    ? '#ff4a4a'
                    : '#ffaa4a';

              return (
                <div key={index} class="ability-item">
                  <div class="ability-name">{ability?.name || meta.abilityId}</div>
                  <div class="ability-source" style={{ color: compatibilityColor }}>
                    From {djinn?.name} ({meta.compatibility})
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

