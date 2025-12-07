/**
 * PreBattleTeamSelectScreenV2 Component
 *
 * Clean, mockup-inspired team selection screen.
 * Features:
 * - Two-panel layout: Available Units (left) | Selected Team (right)
 * - Auto-sorts selected units by SPD (fastest first)
 * - Shows turn order badges (1st, 2nd, 3rd, 4th)
 * - Golden Sun-inspired earthy color palette
 */

import { JSX } from 'preact';
import { useEffect, useCallback, useMemo } from 'preact/hooks';
import { useStore } from '../state/store';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { validateBattleConfig } from '../state/battleConfig';
import { createEmptyLoadout } from '@/core/models/Equipment';
import type { EquipmentLoadout, EquipmentSlot } from '@/core/models/Equipment';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings';
import { EnemyPortalTile } from './EnemyPortalTile';
import type { Unit } from '@/core/models/Unit';
import { DJINN } from '@/data/definitions/djinn';
import './PreBattleTeamSelectScreenV2.css';

interface PreBattleTeamSelectScreenV2Props {
  encounterId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Ordinal suffixes for turn order
const ORDINALS = ['1st', '2nd', '3rd', '4th'] as const;
const EQUIPMENT_SLOT_ORDER: EquipmentSlot[] = ['weapon', 'armor', 'helm', 'boots', 'accessory'];
const EQUIPMENT_SLOT_LABELS: Record<EquipmentSlot, string> = {
  weapon: 'Weapon',
  armor: 'Armor',
  helm: 'Helm',
  boots: 'Boots',
  accessory: 'Accessory',
};

export function PreBattleTeamSelectScreenV2({
  encounterId,
  onConfirm,
  onCancel,
}: PreBattleTeamSelectScreenV2Props): JSX.Element {
  const {
    roster,
    team,
    currentBattleConfig,
    updateBattleConfigSlot,
    equipment: inventory,
  } = useStore((s) => ({
    roster: s.roster,
    team: s.team,
    currentBattleConfig: s.currentBattleConfig,
    updateBattleConfigSlot: s.updateBattleConfigSlot,
    equipment: s.equipment,
  }));

  const encounter = ENCOUNTERS[encounterId];
  const battleConfig = currentBattleConfig;
  const slots = battleConfig?.slots ?? [];
  const djinnSlots = battleConfig?.djinnSlots ?? [];

  // Get all available units (roster + team units)
  const allUnits = useMemo(() => {
    const unitMap = new Map<string, Unit>();
    roster.forEach((u) => unitMap.set(u.id, u));
    team?.units.forEach((u) => unitMap.set(u.id, u));
    return Array.from(unitMap.values());
  }, [roster, team]);

  // Get currently selected unit IDs from battle config
  const selectedUnitIds = useMemo(() =>
    slots
      .map((slot) => slot.unitId)
      .filter((id): id is string => Boolean(id)),
    [slots]
  );

  // Get selected units sorted by speed (descending)
  const selectedUnits = useMemo(() => {
    return selectedUnitIds
      .map((id) => allUnits.find((u) => u.id === id))
      .filter((u): u is Unit => Boolean(u))
      .sort((a, b) => {
        // Primary: base speed (descending) - good approximation for turn order preview
        const speedDiff = b.baseStats.spd - a.baseStats.spd;
        if (speedDiff !== 0) return speedDiff;
        // Tiebreaker: level
        return b.level - a.level;
      });
  }, [selectedUnitIds, allUnits]);

  // Available units (not selected)
  const availableUnits = useMemo(() =>
    allUnits.filter((u) => !selectedUnitIds.includes(u.id)),
    [allUnits, selectedUnitIds]
  );

  const loadoutByUnitId = useMemo(() => {
    const map = new Map<string, EquipmentLoadout>();
    slots.forEach((slot) => {
      if (slot.unitId) {
        map.set(slot.unitId, slot.equipmentLoadout ?? createEmptyLoadout());
      }
    });
    return map;
  }, [slots]);

  // Validation
  const configValidation = useMemo(() => {
    if (!battleConfig) {
      return { valid: false, message: 'Battle configuration missing' };
    }
    return validateBattleConfig(battleConfig, inventory, roster, team);
  }, [battleConfig, inventory, roster, team]);

  // Toggle unit selection
  const handleUnitToggle = useCallback((unit: Unit) => {
    const isSelected = selectedUnitIds.includes(unit.id);

    if (isSelected) {
      // Find which slot has this unit and clear it
      const slotIndex = slots.findIndex((s) => s.unitId === unit.id);
      if (slotIndex !== -1) {
        updateBattleConfigSlot(slotIndex, null);
      }
    } else if (selectedUnitIds.length < 4) {
      // Find first empty slot and fill it
      const emptySlotIndex = slots.findIndex((s) => !s.unitId);
      if (emptySlotIndex !== -1) {
        updateBattleConfigSlot(emptySlotIndex, unit.id);
      }
    }
  }, [selectedUnitIds, slots, updateBattleConfigSlot]);

  // Remove unit from team
  const handleRemoveUnit = useCallback((unitId: string) => {
    const slotIndex = slots.findIndex((s) => s.unitId === unitId);
    if (slotIndex !== -1) {
      updateBattleConfigSlot(slotIndex, null);
    }
  }, [slots, updateBattleConfigSlot]);

  // Start battle
  const handleStartBattle = useCallback(() => {
    if (!battleConfig || !configValidation.valid) return;
    onConfirm();
  }, [battleConfig, configValidation.valid, onConfirm]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Enter' && configValidation.valid) {
        e.preventDefault();
        handleStartBattle();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [configValidation.valid, handleStartBattle, onCancel]);

  // Error states
  if (!encounter) {
    return (
      <div class="prebattle-v2-overlay">
        <div class="prebattle-v2-error">
          <div>Error: Encounter not found</div>
          <button onClick={onCancel}>Close</button>
        </div>
      </div>
    );
  }

  if (!team || !battleConfig) {
    return (
      <div class="prebattle-v2-overlay">
        <div class="prebattle-v2-error">
          <div>Error: Team or battle config missing</div>
          <button onClick={onCancel}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div class="prebattle-v2-overlay">
      <div class="prebattle-v2-container">
        {/* Header */}
        <div class="prebattle-v2-header">
          <div class="prebattle-v2-title">Select Your Team</div>
          <div class="prebattle-v2-subtitle">
            {encounter.name} • {encounter.difficulty} • {encounter.reward.xp} XP
          </div>
        </div>

        {/* Main Content */}
        <div class="prebattle-v2-layout">
          {/* Left Panel: Available Units */}
          <div class="prebattle-v2-available">
            <div class="panel-title">Available Units</div>
            <div class="unit-roster">
              {availableUnits.map((unit) => (
                <div
                  key={unit.id}
                  class={`roster-unit ${selectedUnitIds.length >= 4 ? 'disabled' : ''}`}
                  onClick={() => handleUnitToggle(unit)}
                >
                  <div class="roster-unit-sprite">
                    <SimpleSprite
                      id={getPortraitSprite(unit.id)}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div class="roster-unit-info">
                    <div class="roster-unit-name">{unit.name}</div>
                    <div class="roster-unit-stats">
                      Lv.{unit.level} | SPD: <span class="unit-speed">{unit.baseStats.spd}</span>
                    </div>
                  </div>
                  <div class={`roster-unit-element element-${unit.element.toLowerCase()}`}>
                    {unit.element}
                  </div>
                </div>
              ))}
              {availableUnits.length === 0 && (
                <div class="roster-empty">All units selected!</div>
              )}
            </div>
          </div>

          {/* Right Panel: Selected Team */}
          <div class="prebattle-v2-selected">
            <div class="panel-title">Battle Party (Sorted by Speed)</div>
            <div class="team-slots">
              {[0, 1, 2, 3].map((slotIndex) => {
                const unit = selectedUnits[slotIndex];
                return (
                  <div
                    key={slotIndex}
                    class={`team-slot ${unit ? 'filled' : 'empty'}`}
                  >
                    <span class="slot-badge">{ORDINALS[slotIndex]}</span>
                    <span class="slot-order">{slotIndex + 1}</span>

                    {unit ? (
                      <>
                        <div class="slot-sprite">
                          <SimpleSprite
                            id={getPortraitSprite(unit.id)}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div class="slot-unit-info">
                          <div class="slot-unit-name">{unit.name}</div>
                          <div class="slot-unit-speed">SPD: {unit.baseStats.spd}</div>
                        </div>
                        <button
                          class="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUnit(unit.id);
                          }}
                          aria-label={`Remove ${unit.name}`}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span class="slot-empty-text">
                        {slotIndex === 0 ? 'Empty - Fastest' : slotIndex === 3 ? 'Empty - Slowest' : 'Empty'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Enemy Preview */}
            <div class="enemy-preview">
              <div class="panel-title">Enemies</div>
              <div class="enemy-portal-wrap">
                <EnemyPortalTile encounterId={encounterId} />
              </div>
            </div>

            {/* Loadout Preview */}
            <div class="loadout-preview">
              <div class="panel-title">Equipment &amp; Djinn</div>
              <div class="loadout-columns">
                <div class="gear-summary">
                  <div class="loadout-subtitle">Selected Gear</div>
                  {selectedUnits.length === 0 ? (
                    <div class="loadout-empty">Add units to see their equipped items.</div>
                  ) : (
                    selectedUnits.map((unit) => {
                      const loadout = loadoutByUnitId.get(unit.id) ?? unit.equipment ?? createEmptyLoadout();
                      return (
                        <div class="gear-row" key={unit.id}>
                          <div class="gear-row-header">
                            <div class="gear-row-avatar">
                              <SimpleSprite id={getPortraitSprite(unit.id)} width={28} height={28} />
                            </div>
                            <div class="gear-row-name">{unit.name}</div>
                            <span class={`gear-row-element element-${unit.element.toLowerCase()}`}>
                              {unit.element}
                            </span>
                          </div>
                          <div class="gear-tags">
                            {EQUIPMENT_SLOT_ORDER.map((slot) => {
                              const item = loadout[slot];
                              return (
                                <span class={`gear-tag ${item ? 'filled' : 'empty'}`} key={`${unit.id}-${slot}`}>
                                  <span class="gear-slot-label">{EQUIPMENT_SLOT_LABELS[slot]}</span>
                                  <span class="gear-item-name">{item ? item.name : 'None'}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div class="djinn-summary">
                  <div class="loadout-subtitle">Team Djinn</div>
                  <div class="djinn-chips">
                    {djinnSlots.map((djinnId, index) => {
                      const djinnData = djinnId ? DJINN[djinnId] : undefined;
                      const elementLabel = djinnData?.element ?? 'Neutral';
                      const elementClass = elementLabel.toLowerCase();
                      return (
                        <div class={`djinn-chip ${djinnId ? 'filled' : 'empty'}`} key={`${djinnId ?? 'empty'}-${index}`}>
                          <div class="djinn-chip-row">
                            <span class="djinn-slot-label">Slot {index + 1}</span>
                            {djinnId && (
                              <span class={`djinn-element-badge element-${elementClass}`}>
                                {elementLabel}
                              </span>
                            )}
                          </div>
                          <div class="djinn-name">{djinnId ? djinnData?.name ?? djinnId : 'Empty'}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div class="djinn-note">Djinn bonuses apply to every unit in this party.</div>
                </div>
              </div>
            </div>

            {/* Start Battle Button */}
            <button
              class="start-battle-btn"
              onClick={handleStartBattle}
              disabled={!configValidation.valid}
            >
              {configValidation.valid
                ? `Start Battle (${selectedUnits.length} unit${selectedUnits.length !== 1 ? 's' : ''})`
                : configValidation.message ?? 'Select at least 1 unit'}
            </button>
          </div>
        </div>

        {/* Footer with Cancel */}
        <div class="prebattle-v2-footer">
          <button class="cancel-btn" onClick={onCancel}>
            ← Cancel
          </button>
          <div class="keyboard-hints">
            <span class="key">Enter</span> Start &nbsp;|&nbsp; <span class="key">Esc</span> Cancel
          </div>
        </div>
      </div>
    </div>
  );
}
