"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreBattleTeamSelectScreenV2 = PreBattleTeamSelectScreenV2;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
const encounters_1 = require("@/data/definitions/encounters");
const battleConfig_1 = require("../state/battleConfig");
const Equipment_1 = require("@/core/models/Equipment");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const mappings_1 = require("../sprites/mappings");
const EnemyPortalTile_1 = require("./EnemyPortalTile");
const djinn_1 = require("@/data/definitions/djinn");
const ToolboxHelpers_1 = require("./debug/ToolboxHelpers");
require("./PreBattleTeamSelectScreenV2.css");
// Ordinal suffixes for turn order
const ORDINALS = ['1st', '2nd', '3rd', '4th'];
const EQUIPMENT_SLOT_ORDER = ['weapon', 'armor', 'helm', 'boots', 'accessory'];
const EQUIPMENT_SLOT_LABELS = {
    weapon: 'Weapon',
    armor: 'Armor',
    helm: 'Helm',
    boots: 'Boots',
    accessory: 'Accessory',
};
function PreBattleTeamSelectScreenV2({ encounterId, onConfirm, onCancel, }) {
    const { roster, team, currentBattleConfig, updateBattleConfigSlot, updateBattleSlotEquipment, addEquipment, removeEquipment, equipment: inventory, } = (0, store_1.useStore)((s) => ({
        roster: s.roster,
        team: s.team,
        currentBattleConfig: s.currentBattleConfig,
        updateBattleConfigSlot: s.updateBattleConfigSlot,
        updateBattleSlotEquipment: s.updateBattleSlotEquipment,
        addEquipment: s.addEquipment,
        removeEquipment: s.removeEquipment,
        equipment: s.equipment,
    }));
    const encounter = encounters_1.ENCOUNTERS[encounterId];
    const battleConfig = currentBattleConfig;
    const slots = battleConfig?.slots ?? [];
    const djinnSlots = battleConfig?.djinnSlots ?? [];
    // Track which unit is selected for the details panel
    const [selectedUnitForDetails, setSelectedUnitForDetails] = (0, hooks_1.useState)(null);
    // Get all available units (roster + team units)
    const allUnits = (0, hooks_1.useMemo)(() => {
        const unitMap = new Map();
        roster.forEach((u) => unitMap.set(u.id, u));
        team?.units.forEach((u) => unitMap.set(u.id, u));
        return Array.from(unitMap.values());
    }, [roster, team]);
    // Get currently selected unit IDs from battle config
    const selectedUnitIds = (0, hooks_1.useMemo)(() => slots
        .map((slot) => slot.unitId)
        .filter((id) => Boolean(id)), [slots]);
    // Get selected units sorted by speed (descending)
    const selectedUnits = (0, hooks_1.useMemo)(() => {
        return selectedUnitIds
            .map((id) => allUnits.find((u) => u.id === id))
            .filter((u) => Boolean(u))
            .sort((a, b) => {
            // Primary: base speed (descending) - good approximation for turn order preview
            const speedDiff = b.baseStats.spd - a.baseStats.spd;
            if (speedDiff !== 0)
                return speedDiff;
            // Tiebreaker: level
            return b.level - a.level;
        });
    }, [selectedUnitIds, allUnits]);
    const detailUnit = selectedUnitForDetails ?? selectedUnits[0] ?? null;
    const [equipmentModalOpen, setEquipmentModalOpen] = (0, hooks_1.useState)(false);
    const [equipmentModalUnitId, setEquipmentModalUnitId] = (0, hooks_1.useState)(detailUnit?.id ?? null);
    const [equipmentModalSlot, setEquipmentModalSlot] = (0, hooks_1.useState)(null);
    // Available units (not selected)
    const availableUnits = (0, hooks_1.useMemo)(() => allUnits.filter((u) => !selectedUnitIds.includes(u.id)), [allUnits, selectedUnitIds]);
    const loadoutByUnitId = (0, hooks_1.useMemo)(() => {
        const map = new Map();
        slots.forEach((slot) => {
            if (slot.unitId) {
                map.set(slot.unitId, slot.equipmentLoadout ?? (0, Equipment_1.createEmptyLoadout)());
            }
        });
        return map;
    }, [slots]);
    // Team stats summary
    const teamSummary = (0, hooks_1.useMemo)(() => {
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
        ? loadoutByUnitId.get(equipmentModalUnit.id) ?? (0, Equipment_1.createEmptyLoadout)()
        : (0, Equipment_1.createEmptyLoadout)();
    // Validation
    const configValidation = (0, hooks_1.useMemo)(() => {
        if (!battleConfig) {
            return { valid: false, message: 'Battle configuration missing' };
        }
        return (0, battleConfig_1.validateBattleConfig)(battleConfig, inventory, roster, team);
    }, [battleConfig, inventory, roster, team]);
    // Toggle unit selection
    const handleUnitToggle = (0, hooks_1.useCallback)((unit) => {
        const isSelected = selectedUnitIds.includes(unit.id);
        if (isSelected) {
            // Find which slot has this unit and clear it
            const slotIndex = slots.findIndex((s) => s.unitId === unit.id);
            if (slotIndex !== -1) {
                updateBattleConfigSlot(slotIndex, null);
            }
        }
        else if (selectedUnitIds.length < 4) {
            // Find first empty slot and fill it
            const emptySlotIndex = slots.findIndex((s) => !s.unitId);
            if (emptySlotIndex !== -1) {
                updateBattleConfigSlot(emptySlotIndex, unit.id);
            }
        }
    }, [selectedUnitIds, slots, updateBattleConfigSlot]);
    // Remove unit from team
    const handleRemoveUnit = (0, hooks_1.useCallback)((unitId) => {
        const slotIndex = slots.findIndex((s) => s.unitId === unitId);
        if (slotIndex !== -1) {
            updateBattleConfigSlot(slotIndex, null);
        }
    }, [slots, updateBattleConfigSlot]);
    // Start battle
    const handleStartBattle = (0, hooks_1.useCallback)(() => {
        if (!battleConfig || !configValidation.valid)
            return;
        onConfirm();
    }, [battleConfig, configValidation.valid, onConfirm]);
    // Equipment modal handlers
    const handleEquipItem = (slot, item) => {
        if (!equipmentModalUnit || equipmentModalSlotIndex === null)
            return;
        // Return currently equipped item to inventory
        const currentItem = equipmentModalLoadout[slot];
        if (currentItem) {
            addEquipment([currentItem]);
        }
        // Remove selected item from inventory and update loadout
        removeEquipment(item.id);
        updateBattleSlotEquipment(equipmentModalSlotIndex, slot, item);
    };
    const handleUnequipItem = (slot) => {
        if (!equipmentModalUnit || equipmentModalSlotIndex === null)
            return;
        const currentItem = equipmentModalLoadout[slot];
        if (!currentItem)
            return;
        addEquipment([currentItem]);
        updateBattleSlotEquipment(equipmentModalSlotIndex, slot, null);
    };
    const availableEquipmentForModal = (0, hooks_1.useMemo)(() => {
        if (!equipmentModalUnit || !equipmentModalSlot)
            return [];
        return inventory.filter((item) => item.slot === equipmentModalSlot &&
            (item.allowedElements.length === 0 || item.allowedElements.includes(equipmentModalUnit.element)));
    }, [equipmentModalUnit, equipmentModalSlot, inventory]);
    // Keyboard shortcuts
    (0, hooks_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
            }
            else if (e.key === 'Enter' && configValidation.valid) {
                e.preventDefault();
                handleStartBattle();
            }
        };
        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [configValidation.valid, handleStartBattle, onCancel]);
    // Error states
    if (!encounter) {
        return ((0, jsx_runtime_1.jsx)("div", { class: "prebattle-v2-overlay", children: (0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-error", children: [(0, jsx_runtime_1.jsx)("div", { children: "Error: Encounter not found" }), (0, jsx_runtime_1.jsx)("button", { onClick: onCancel, children: "Close" })] }) }));
    }
    if (!team || !battleConfig) {
        return ((0, jsx_runtime_1.jsx)("div", { class: "prebattle-v2-overlay", children: (0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-error", children: [(0, jsx_runtime_1.jsx)("div", { children: "Error: Team or battle config missing" }), (0, jsx_runtime_1.jsx)("button", { onClick: onCancel, children: "Close" })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-overlay", children: [(0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-container", children: [(0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-header", children: [(0, jsx_runtime_1.jsx)("div", { class: "prebattle-v2-title", children: "Select Your Team" }), (0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-subtitle", children: [encounter.name, " \u2022 ", encounter.difficulty, " \u2022 ", encounter.reward.xp, " XP"] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-layout", children: [(0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-available", children: [(0, jsx_runtime_1.jsx)("div", { class: "panel-title", children: "Available Units" }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-roster", children: [availableUnits.map((unit) => ((0, jsx_runtime_1.jsxs)("div", { class: `roster-unit ${selectedUnitIds.length >= 4 ? 'disabled' : ''} ${selectedUnitForDetails?.id === unit.id ? 'viewing' : ''}`, title: `${unit.name} • ${unit.role} • SPD ${unit.baseStats.spd} • ${unit.element}`, onClick: () => handleUnitToggle(unit), onContextMenu: (e) => {
                                                    e.preventDefault();
                                                    setSelectedUnitForDetails(unit);
                                                }, children: [(0, jsx_runtime_1.jsx)("div", { class: "roster-unit-sprite", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: 40, height: 40 }) }), (0, jsx_runtime_1.jsxs)("div", { class: "roster-unit-info", children: [(0, jsx_runtime_1.jsx)("div", { class: "roster-unit-name", children: unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "roster-unit-class", children: ["Lv.", unit.level, " \u2022 ", unit.element] }), (0, jsx_runtime_1.jsxs)("div", { class: "roster-unit-stats-grid", children: [(0, jsx_runtime_1.jsxs)("span", { class: "stat-hp", children: ["HP:", unit.baseStats.hp] }), (0, jsx_runtime_1.jsxs)("span", { class: "stat-atk", children: ["ATK:", unit.baseStats.atk] }), (0, jsx_runtime_1.jsxs)("span", { class: "stat-def", children: ["DEF:", unit.baseStats.def] }), (0, jsx_runtime_1.jsxs)("span", { class: "stat-spd", children: ["SPD:", unit.baseStats.spd] })] })] }), (0, jsx_runtime_1.jsx)("div", { class: `roster-unit-element element-${unit.element.toLowerCase()}`, children: unit.element.substring(0, 3) })] }, unit.id))), availableUnits.length === 0 && ((0, jsx_runtime_1.jsx)("div", { class: "roster-empty", children: "All units selected!" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-selected", children: [(0, jsx_runtime_1.jsxs)("div", { class: "turn-order-explainer", children: [(0, jsx_runtime_1.jsx)("span", { class: "turn-order-icon", children: "\u26A1" }), (0, jsx_runtime_1.jsxs)("span", { class: "turn-order-text", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Turn Order:" }), " Units attack from fastest to slowest (by SPD stat)"] }), (0, jsx_runtime_1.jsx)("button", { class: "manage-equip-btn", type: "button", onClick: () => {
                                                    setEquipmentModalUnitId(detailUnit?.id ?? selectedUnits[0]?.id ?? null);
                                                    setEquipmentModalSlot(null);
                                                    setEquipmentModalOpen(true);
                                                }, children: "Manage Equipment" })] }), (0, jsx_runtime_1.jsx)("div", { class: "panel-title", children: "Battle Party" }), (0, jsx_runtime_1.jsx)("div", { class: "team-slots", children: [0, 1, 2, 3].map((slotIndex) => {
                                            const unit = selectedUnits[slotIndex];
                                            return ((0, jsx_runtime_1.jsxs)("div", { class: `team-slot ${unit ? 'filled' : 'empty'} ${selectedUnitForDetails?.id === unit?.id ? 'viewing' : ''}`, onClick: () => unit && setSelectedUnitForDetails(unit), children: [(0, jsx_runtime_1.jsx)("span", { class: "slot-badge", children: ORDINALS[slotIndex] }), (0, jsx_runtime_1.jsx)("span", { class: "slot-order", children: slotIndex + 1 }), unit ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "slot-sprite", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: 40, height: 40 }) }), (0, jsx_runtime_1.jsxs)("div", { class: "slot-unit-info", children: [(0, jsx_runtime_1.jsx)("div", { class: "slot-unit-name", children: unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "slot-unit-stats-row", children: [(0, jsx_runtime_1.jsxs)("span", { class: "stat-hp", children: ["HP:", unit.baseStats.hp] }), (0, jsx_runtime_1.jsxs)("span", { class: "stat-atk", children: ["ATK:", unit.baseStats.atk] }), (0, jsx_runtime_1.jsxs)("span", { class: "stat-spd", children: ["SPD:", unit.baseStats.spd] })] })] }), (0, jsx_runtime_1.jsx)("button", { class: "remove-btn", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveUnit(unit.id);
                                                                }, "aria-label": `Remove ${unit.name}`, children: "\u00D7" })] })) : ((0, jsx_runtime_1.jsx)("span", { class: "slot-empty-text", children: slotIndex === 0 ? 'Empty - Fastest' : slotIndex === 3 ? 'Empty - Slowest' : 'Empty' }))] }, slotIndex));
                                        }) }), selectedUnits.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "team-summary", children: [(0, jsx_runtime_1.jsxs)("div", { class: "team-stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "team-stat-label", children: "Total HP" }), (0, jsx_runtime_1.jsx)("span", { class: "team-stat-value", children: totalHP })] }), (0, jsx_runtime_1.jsxs)("div", { class: "team-stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "team-stat-label", children: "Avg Level" }), (0, jsx_runtime_1.jsx)("span", { class: "team-stat-value", children: avgLevel })] }), (0, jsx_runtime_1.jsxs)("div", { class: "team-stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "team-stat-label", children: "Avg SPD" }), (0, jsx_runtime_1.jsx)("span", { class: "team-stat-value", children: avgSPD })] })] })), (0, jsx_runtime_1.jsxs)("div", { class: "unit-details-panel", children: [(0, jsx_runtime_1.jsx)("div", { class: "panel-title", children: "Unit Details" }), detailUnit ? ((0, jsx_runtime_1.jsxs)("div", { class: "unit-details-body", children: [(0, jsx_runtime_1.jsxs)("div", { class: "unit-details-header", children: [(0, jsx_runtime_1.jsx)("div", { class: "unit-details-avatar", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(detailUnit.id), width: 48, height: 48 }) }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-details-meta", children: [(0, jsx_runtime_1.jsx)("div", { class: "unit-details-name", children: detailUnit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-details-sub", children: [(0, jsx_runtime_1.jsx)("span", { class: `unit-element element-${detailUnit.element.toLowerCase()}`, children: detailUnit.element }), (0, jsx_runtime_1.jsx)("span", { class: "unit-role", children: detailUnit.role }), (0, jsx_runtime_1.jsxs)("span", { class: "unit-level", children: ["Lv ", detailUnit.level] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-details-stats", children: [(0, jsx_runtime_1.jsxs)("div", { class: "stat-chip hp", children: ["HP ", detailUnit.baseStats.hp] }), (0, jsx_runtime_1.jsxs)("div", { class: "stat-chip atk", children: ["ATK ", detailUnit.baseStats.atk] }), (0, jsx_runtime_1.jsxs)("div", { class: "stat-chip def", children: ["DEF ", detailUnit.baseStats.def] }), (0, jsx_runtime_1.jsxs)("div", { class: "stat-chip mag", children: ["MAG ", detailUnit.baseStats.mag] }), (0, jsx_runtime_1.jsxs)("div", { class: "stat-chip spd", children: ["SPD ", detailUnit.baseStats.spd] })] }), (0, jsx_runtime_1.jsx)("div", { class: "unit-details-note", children: "Right-click or tap-and-hold a unit in the roster to pin their details here." })] })) : ((0, jsx_runtime_1.jsx)("div", { class: "unit-details-empty", children: "Select a unit to see detailed stats." }))] }), (0, jsx_runtime_1.jsxs)("div", { class: "enemy-preview", children: [(0, jsx_runtime_1.jsx)("div", { class: "panel-title", children: "Enemies" }), (0, jsx_runtime_1.jsx)("div", { class: "enemy-portal-wrap", children: (0, jsx_runtime_1.jsx)(EnemyPortalTile_1.EnemyPortalTile, { encounterId: encounterId }) })] }), (0, jsx_runtime_1.jsx)(ToolboxHelpers_1.ToolboxHelpers, { title: "Team Toolbox", actions: [
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
                                        ], position: "bottom-right" }), (0, jsx_runtime_1.jsxs)("div", { class: "loadout-preview", children: [(0, jsx_runtime_1.jsx)("div", { class: "panel-title", children: "Equipment & Djinn" }), (0, jsx_runtime_1.jsxs)("div", { class: "loadout-columns", children: [(0, jsx_runtime_1.jsxs)("div", { class: "gear-summary", children: [(0, jsx_runtime_1.jsx)("div", { class: "loadout-subtitle", children: "Selected Gear" }), selectedUnits.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { class: "loadout-empty", children: "Add units to see their equipped items." })) : (selectedUnits.map((unit) => {
                                                                const loadout = loadoutByUnitId.get(unit.id) ?? unit.equipment ?? (0, Equipment_1.createEmptyLoadout)();
                                                                return ((0, jsx_runtime_1.jsxs)("div", { class: "gear-row", children: [(0, jsx_runtime_1.jsxs)("div", { class: "gear-row-header", children: [(0, jsx_runtime_1.jsx)("div", { class: "gear-row-avatar", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: 28, height: 28 }) }), (0, jsx_runtime_1.jsx)("div", { class: "gear-row-name", children: unit.name }), (0, jsx_runtime_1.jsx)("span", { class: `gear-row-element element-${unit.element.toLowerCase()}`, children: unit.element })] }), (0, jsx_runtime_1.jsx)("div", { class: "gear-tags", children: EQUIPMENT_SLOT_ORDER.map((slot) => {
                                                                                const item = loadout[slot];
                                                                                return ((0, jsx_runtime_1.jsxs)("span", { class: `gear-tag ${item ? 'filled' : 'empty'}`, title: `${EQUIPMENT_SLOT_LABELS[slot]} • ${item ? item.name : 'None'}`, children: [(0, jsx_runtime_1.jsx)("span", { class: "gear-slot-label", children: EQUIPMENT_SLOT_LABELS[slot] }), (0, jsx_runtime_1.jsx)("span", { class: "gear-item-name", children: item ? item.name : 'None' })] }, `${unit.id}-${slot}`));
                                                                            }) })] }, unit.id));
                                                            }))] }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-summary", children: [(0, jsx_runtime_1.jsx)("div", { class: "loadout-subtitle", children: "Team Djinn" }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-chips", children: djinnSlots.map((djinnId, index) => {
                                                                    const djinnData = djinnId ? djinn_1.DJINN[djinnId] : undefined;
                                                                    const elementLabel = djinnData?.element ?? 'Neutral';
                                                                    const elementClass = elementLabel.toLowerCase();
                                                                    return ((0, jsx_runtime_1.jsxs)("div", { class: `djinn-chip ${djinnId ? 'filled' : 'empty'}`, children: [(0, jsx_runtime_1.jsxs)("div", { class: "djinn-chip-row", children: [(0, jsx_runtime_1.jsxs)("span", { class: "djinn-slot-label", children: ["Slot ", index + 1] }), djinnId && ((0, jsx_runtime_1.jsx)("span", { class: `djinn-element-badge element-${elementClass}`, children: elementLabel }))] }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-name", children: djinnId ? djinnData?.name ?? djinnId : 'Empty' })] }, `${djinnId ?? 'empty'}-${index}`));
                                                                }) }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-note", children: "Djinn bonuses apply to every unit in this party." })] })] })] }), (0, jsx_runtime_1.jsx)("button", { class: "start-battle-btn", onClick: handleStartBattle, disabled: !configValidation.valid, children: configValidation.valid
                                            ? `Start Battle (${selectedUnits.length} unit${selectedUnits.length !== 1 ? 's' : ''})`
                                            : configValidation.message ?? 'Select at least 1 unit' })] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-footer", children: [(0, jsx_runtime_1.jsxs)("div", { class: "prebattle-v2-footer-actions", children: [(0, jsx_runtime_1.jsx)("button", { class: "cancel-btn", onClick: onCancel, children: "\u2190 Cancel" }), (0, jsx_runtime_1.jsx)("button", { class: "proceed-btn", onClick: handleStartBattle, disabled: !configValidation.valid, children: "Proceed \u2192" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "keyboard-hints", children: [(0, jsx_runtime_1.jsx)("span", { class: "key", children: "Enter" }), " Start \u00A0|\u00A0 ", (0, jsx_runtime_1.jsx)("span", { class: "key", children: "Esc" }), " Cancel"] })] })] }), equipmentModalOpen && ((0, jsx_runtime_1.jsx)("div", { class: "equip-modal-backdrop", onClick: () => setEquipmentModalOpen(false), children: (0, jsx_runtime_1.jsxs)("div", { class: "equip-modal", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { class: "equip-modal-header", children: [(0, jsx_runtime_1.jsx)("div", { class: "equip-modal-title", children: "Equipment Management" }), (0, jsx_runtime_1.jsx)("button", { class: "close-btn", onClick: () => setEquipmentModalOpen(false), "aria-label": "Close", children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "equip-modal-body", children: [(0, jsx_runtime_1.jsxs)("div", { class: "equip-modal-column", children: [(0, jsx_runtime_1.jsx)("div", { class: "panel-title", children: "Party" }), (0, jsx_runtime_1.jsx)("div", { class: "equip-unit-list", children: selectedUnits.map((u) => ((0, jsx_runtime_1.jsxs)("button", { class: `equip-unit-item ${equipmentModalUnitId === u.id ? 'active' : ''}`, onClick: () => {
                                                    setEquipmentModalUnitId(u.id);
                                                    setEquipmentModalSlot(null);
                                                }, children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(u.id), width: 28, height: 28 }), (0, jsx_runtime_1.jsxs)("div", { class: "equip-unit-meta", children: [(0, jsx_runtime_1.jsx)("span", { class: "equip-unit-name", children: u.name }), (0, jsx_runtime_1.jsxs)("span", { class: "equip-unit-sub", children: ["Lv ", u.level, " \u2022 ", u.role] })] })] }, u.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { class: "equip-modal-column", children: [(0, jsx_runtime_1.jsx)("div", { class: "panel-title", children: "Slots" }), (0, jsx_runtime_1.jsx)("div", { class: "equip-slot-grid", children: EQUIPMENT_SLOT_ORDER.map((slot) => {
                                                const item = equipmentModalLoadout[slot];
                                                const isSelected = equipmentModalSlot === slot;
                                                return ((0, jsx_runtime_1.jsxs)("button", { class: `equip-slot-card ${isSelected ? 'active' : ''}`, onClick: () => setEquipmentModalSlot(isSelected ? null : slot), children: [(0, jsx_runtime_1.jsx)("div", { class: "equip-slot-label", children: EQUIPMENT_SLOT_LABELS[slot] }), (0, jsx_runtime_1.jsx)("div", { class: "equip-slot-value", children: item ? item.name : '[None]' }), (0, jsx_runtime_1.jsxs)("div", { class: "equip-slot-bonus", children: [item?.statBonus.atk ? `+${item.statBonus.atk} ATK ` : '', item?.statBonus.def ? `+${item.statBonus.def} DEF ` : '', item?.statBonus.spd ? `+${item.statBonus.spd} SPD` : ''] }), item && ((0, jsx_runtime_1.jsx)("button", { type: "button", class: "unequip-button small", onClick: (e) => {
                                                                e.stopPropagation();
                                                                handleUnequipItem(slot);
                                                            }, children: "Unequip" }))] }, slot));
                                            }) })] }), (0, jsx_runtime_1.jsxs)("div", { class: "equip-modal-column", children: [(0, jsx_runtime_1.jsx)("div", { class: "panel-title", children: "Inventory" }), equipmentModalSlot && equipmentModalUnit ? ((0, jsx_runtime_1.jsx)("div", { class: "equip-inventory-list", children: availableEquipmentForModal.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { class: "equip-empty", children: "No items for this slot." })) : (availableEquipmentForModal.map((item) => ((0, jsx_runtime_1.jsxs)("button", { class: "equip-item", onClick: () => handleEquipItem(equipmentModalSlot, item), title: item.name, children: [(0, jsx_runtime_1.jsx)("div", { class: "equip-item-name", children: item.name }), (0, jsx_runtime_1.jsxs)("div", { class: "equip-item-bonus", children: [item.statBonus.atk ? `+${item.statBonus.atk} ATK ` : '', item.statBonus.def ? `+${item.statBonus.def} DEF ` : '', item.statBonus.spd ? `+${item.statBonus.spd} SPD` : ''] })] }, item.id)))) })) : ((0, jsx_runtime_1.jsx)("div", { class: "equip-empty", children: "Select a slot to see available gear." }))] })] })] }) }))] }));
}
