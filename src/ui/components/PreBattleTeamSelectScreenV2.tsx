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
import { useEffect, useCallback, useMemo, useState } from 'preact/hooks';
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
import type { Equipment } from '@/core/models/Equipment';
import { ToolboxHelpers } from './debug/ToolboxHelpers';
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
    updateBattleSlotEquipment,
    addEquipment,
    removeEquipment,
    equipment: inventory,
  } = useStore((s) => ({
    roster: s.roster,
    team: s.team,
    currentBattleConfig: s.currentBattleConfig,
    updateBattleConfigSlot: s.updateBattleConfigSlot,
    updateBattleSlotEquipment: s.updateBattleSlotEquipment,
    addEquipment: s.addEquipment,
    removeEquipment: s.removeEquipment,
    equipment: s.equipment,
  }));

  const encounter = ENCOUNTERS[encounterId];
  const battleConfig = currentBattleConfig;
  const slots = battleConfig?.slots ?? [];
  const djinnSlots = battleConfig?.djinnSlots ?? [];

  // Track which unit is selected for the details panel
  const [selectedUnitForDetails, setSelectedUnitForDetails] = useState<Unit | null>(null);

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

  const detailUnit = selectedUnitForDetails ?? selectedUnits[0] ?? null;
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [equipmentModalUnitId, setEquipmentModalUnitId] = useState<string | null>(detailUnit?.id ?? null);
  const [equipmentModalSlot, setEquipmentModalSlot] = useState<EquipmentSlot | null>(null);

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

  // Team stats summary
  const teamSummary = useMemo(() => {
    if (selectedUnits.length === 0) {
      return { totalHP: 0, totalATK: 0, avgLevel: 0, avgSPD: 0 };
    }
    const totalHP = selectedUnits.reduce((sum, u) => sum + u.baseStats.hp, 0);
    const totalATK = selectedUnits.reduce((sum, u) => sum + u.baseStats.atk, 0);
    const avgLevel = Math.round(selectedUnits.reduce((sum, u) => sum + u.level, 0) / selectedUnits.length);
    const avgSPD = Math.round(selectedUnits.reduce((sum, u) => sum + u.baseStats.spd, 0) / selectedUnits.length);
    return { totalHP, totalATK, avgLevel, avgSPD };
  }, [selectedUnits]);
  const { totalHP, avgLevel, avgSPD } = teamSummary;

  // Helpers for equipment modal
  const equipmentModalUnit = equipmentModalUnitId
    ? selectedUnits.find((u) => u.id === equipmentModalUnitId) ?? detailUnit
    : detailUnit;
  const equipmentModalSlotIndex = equipmentModalUnit
    ? slots.find((s) => s.unitId === equipmentModalUnit.id)?.slotIndex ?? null
    : null;
  const equipmentModalLoadout = equipmentModalUnit
    ? loadoutByUnitId.get(equipmentModalUnit.id) ?? createEmptyLoadout()
    : createEmptyLoadout();

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

  // Equipment modal handlers
  const handleEquipItem = (slot: EquipmentSlot, item: Equipment) => {
    if (!equipmentModalUnit || equipmentModalSlotIndex === null) return;

    // Return currently equipped item to inventory
    const currentItem = equipmentModalLoadout[slot];
    if (currentItem) {
      addEquipment([currentItem]);
    }

    // Remove selected item from inventory and update loadout
    removeEquipment(item.id);
    updateBattleSlotEquipment(equipmentModalSlotIndex, slot, item);
  };

  const handleUnequipItem = (slot: EquipmentSlot) => {
    if (!equipmentModalUnit || equipmentModalSlotIndex === null) return;
    const currentItem = equipmentModalLoadout[slot];
    if (!currentItem) return;

    addEquipment([currentItem]);
    updateBattleSlotEquipment(equipmentModalSlotIndex, slot, null);
  };

  const availableEquipmentForModal = useMemo(() => {
    if (!equipmentModalUnit || !equipmentModalSlot) return [];
    return inventory.filter(
      (item) =>
        item.slot === equipmentModalSlot &&
        (item.allowedElements.length === 0 || item.allowedElements.includes(equipmentModalUnit.element))
    );
  }, [equipmentModalUnit, equipmentModalSlot, inventory]);

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
                  class={`roster-unit ${selectedUnitIds.length >= 4 ? 'disabled' : ''} ${selectedUnitForDetails?.id === unit.id ? 'viewing' : ''}`}
                  title={`${unit.name} • ${unit.role} • SPD ${unit.baseStats.spd} • ${unit.element}`}
                  onClick={() => handleUnitToggle(unit)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedUnitForDetails(unit);
                  }}
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
                    <div class="roster-unit-class">
                      Lv.{unit.level} • {unit.element}
                    </div>
                    <div class="roster-unit-stats-grid">
                      <span class="stat-hp">HP:{unit.baseStats.hp}</span>
                      <span class="stat-atk">ATK:{unit.baseStats.atk}</span>
                      <span class="stat-def">DEF:{unit.baseStats.def}</span>
                      <span class="stat-spd">SPD:{unit.baseStats.spd}</span>
                    </div>
                  </div>
                  <div class={`roster-unit-element element-${unit.element.toLowerCase()}`}>
                    {unit.element.substring(0, 3)}
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
            {/* Turn Order Explainer */}
            <div class="turn-order-explainer">
              <span class="turn-order-icon">⚡</span>
              <span class="turn-order-text">
                <strong>Turn Order:</strong> Units attack from fastest to slowest (by SPD stat)
              </span>
              <button
                class="manage-equip-btn"
                type="button"
                onClick={() => {
                  setEquipmentModalUnitId(detailUnit?.id ?? selectedUnits[0]?.id ?? null);
                  setEquipmentModalSlot(null);
                  setEquipmentModalOpen(true);
                }}
              >
                Manage Equipment
              </button>
            </div>

            <div class="panel-title">Battle Party</div>
            <div class="team-slots">
              {[0, 1, 2, 3].map((slotIndex) => {
                const unit = selectedUnits[slotIndex];
                return (
                  <div
                    key={slotIndex}
                    class={`team-slot ${unit ? 'filled' : 'empty'} ${selectedUnitForDetails?.id === unit?.id ? 'viewing' : ''}`}
                    onClick={() => unit && setSelectedUnitForDetails(unit)}
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
                          <div class="slot-unit-stats-row">
                            <span class="stat-hp">HP:{unit.baseStats.hp}</span>
                            <span class="stat-atk">ATK:{unit.baseStats.atk}</span>
                            <span class="stat-spd">SPD:{unit.baseStats.spd}</span>
                          </div>
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

            {/* Team Summary Stats */}
            {selectedUnits.length > 0 && (
              <div class="team-summary">
                <div class="team-stat-item">
                  <span class="team-stat-label">Total HP</span>
                  <span class="team-stat-value">{totalHP}</span>
                </div>
                <div class="team-stat-item">
                  <span class="team-stat-label">Avg Level</span>
                  <span class="team-stat-value">{avgLevel}</span>
                </div>
                <div class="team-stat-item">
                  <span class="team-stat-label">Avg SPD</span>
                  <span class="team-stat-value">{avgSPD}</span>
                </div>
              </div>
            )}

            {/* Unit Details Panel */}
            <div class="unit-details-panel">
              <div class="panel-title">Unit Details</div>
              {detailUnit ? (
                <div class="unit-details-body">
                  <div class="unit-details-header">
                    <div class="unit-details-avatar">
                      <SimpleSprite id={getPortraitSprite(detailUnit.id)} width={48} height={48} />
                    </div>
                    <div class="unit-details-meta">
                      <div class="unit-details-name">{detailUnit.name}</div>
                      <div class="unit-details-sub">
                        <span class={`unit-element element-${detailUnit.element.toLowerCase()}`}>{detailUnit.element}</span>
                        <span class="unit-role">{detailUnit.role}</span>
                        <span class="unit-level">Lv {detailUnit.level}</span>
                      </div>
                    </div>
                  </div>
                  <div class="unit-details-stats">
                    <div class="stat-chip hp">HP {detailUnit.baseStats.hp}</div>
                    <div class="stat-chip atk">ATK {detailUnit.baseStats.atk}</div>
                    <div class="stat-chip def">DEF {detailUnit.baseStats.def}</div>
                    <div class="stat-chip mag">MAG {detailUnit.baseStats.mag}</div>
                    <div class="stat-chip spd">SPD {detailUnit.baseStats.spd}</div>
                  </div>
                  <div class="unit-details-note">
                    Right-click or tap-and-hold a unit in the roster to pin their details here.
                  </div>
                </div>
              ) : (
                <div class="unit-details-empty">Select a unit to see detailed stats.</div>
              )}
      </div>

      {/* Enemy Preview */}
      <div class="enemy-preview">
        <div class="panel-title">Enemies</div>
        <div class="enemy-portal-wrap">
          <EnemyPortalTile encounterId={encounterId} />
        </div>
      </div>

      <ToolboxHelpers
        title="Team Toolbox"
        actions={[
          {
            id: 'open-equip',
            label: 'Manage Equipment',
            tooltip: 'Open equipment manager (Alt+T toggles panel)',
            onClick: () => {
              setEquipmentModalUnitId(detailUnit?.id ?? selectedUnits[0]?.id ?? null);
              setEquipmentModalSlot(null);
              setEquipmentModalOpen(true);
            },
          },
          {
            id: 'clear-party',
            label: 'Clear party slots',
            tooltip: 'Remove all selected units',
            onClick: () => {
              slots.forEach((slot) => updateBattleConfigSlot(slot.slotIndex, null));
            },
          },
        ]}
        position="bottom-right"
      />

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
                                <span
                                  class={`gear-tag ${item ? 'filled' : 'empty'}`}
                                  key={`${unit.id}-${slot}`}
                                  title={`${EQUIPMENT_SLOT_LABELS[slot]} • ${item ? item.name : 'None'}`}
                                >
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

      {/* Equipment Modal */}
      {equipmentModalOpen && (
        <div class="equip-modal-backdrop" onClick={() => setEquipmentModalOpen(false)}>
          <div class="equip-modal" onClick={(e) => e.stopPropagation()}>
            <div class="equip-modal-header">
              <div class="equip-modal-title">Equipment Management</div>
              <button class="close-btn" onClick={() => setEquipmentModalOpen(false)} aria-label="Close">×</button>
            </div>

            <div class="equip-modal-body">
              <div class="equip-modal-column">
                <div class="panel-title">Party</div>
                <div class="equip-unit-list">
                  {selectedUnits.map((u) => (
                    <button
                      key={u.id}
                      class={`equip-unit-item ${equipmentModalUnitId === u.id ? 'active' : ''}`}
                      onClick={() => {
                        setEquipmentModalUnitId(u.id);
                        setEquipmentModalSlot(null);
                      }}
                    >
                      <SimpleSprite id={getPortraitSprite(u.id)} width={28} height={28} />
                      <div class="equip-unit-meta">
                        <span class="equip-unit-name">{u.name}</span>
                        <span class="equip-unit-sub">Lv {u.level} • {u.role}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div class="equip-modal-column">
                <div class="panel-title">Slots</div>
                <div class="equip-slot-grid">
                  {EQUIPMENT_SLOT_ORDER.map((slot) => {
                    const item = equipmentModalLoadout[slot];
                    const isSelected = equipmentModalSlot === slot;
                    return (
                      <button
                        key={slot}
                        class={`equip-slot-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setEquipmentModalSlot(isSelected ? null : slot)}
                      >
                        <div class="equip-slot-label">{EQUIPMENT_SLOT_LABELS[slot]}</div>
                        <div class="equip-slot-value">{item ? item.name : '[None]'}</div>
                        <div class="equip-slot-bonus">
                          {item?.statBonus.atk ? `+${item.statBonus.atk} ATK ` : ''}
                          {item?.statBonus.def ? `+${item.statBonus.def} DEF ` : ''}
                          {item?.statBonus.spd ? `+${item.statBonus.spd} SPD` : ''}
                        </div>
                        {item && (
                          <button
                            type="button"
                            class="unequip-button small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnequipItem(slot);
                            }}
                          >
                            Unequip
                          </button>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div class="equip-modal-column">
                <div class="panel-title">Inventory</div>
                {equipmentModalSlot && equipmentModalUnit ? (
                  <div class="equip-inventory-list">
                    {availableEquipmentForModal.length === 0 ? (
                      <div class="equip-empty">No items for this slot.</div>
                    ) : (
                      availableEquipmentForModal.map((item) => (
                        <button
                          key={item.id}
                          class="equip-item"
                          onClick={() => handleEquipItem(equipmentModalSlot, item)}
                          title={item.name}
                        >
                          <div class="equip-item-name">{item.name}</div>
                          <div class="equip-item-bonus">
                            {item.statBonus.atk ? `+${item.statBonus.atk} ATK ` : ''}
                            {item.statBonus.def ? `+${item.statBonus.def} DEF ` : ''}
                            {item.statBonus.spd ? `+${item.statBonus.spd} SPD` : ''}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  <div class="equip-empty">Select a slot to see available gear.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
