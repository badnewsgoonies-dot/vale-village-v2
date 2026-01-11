"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_DJINN_SLOT_COUNT = exports.DEFAULT_BATTLE_SLOT_COUNT = void 0;
exports.cloneEquipmentLoadout = cloneEquipmentLoadout;
exports.createDefaultDjinnSlots = createDefaultDjinnSlots;
exports.buildBattleConfigForNextBattle = buildBattleConfigForNextBattle;
exports.getActiveSlotUnitIds = getActiveSlotUnitIds;
exports.getEquipmentLoadoutForSlot = getEquipmentLoadoutForSlot;
exports.updateDjinnSlots = updateDjinnSlots;
exports.validateBattleConfig = validateBattleConfig;
const constants_1 = require("@/core/constants");
const Equipment_1 = require("@/core/models/Equipment");
exports.DEFAULT_BATTLE_SLOT_COUNT = constants_1.MAX_PARTY_SIZE;
exports.DEFAULT_DJINN_SLOT_COUNT = 3;
function cloneEquipmentLoadout(loadout) {
    return {
        weapon: loadout.weapon ?? null,
        armor: loadout.armor ?? null,
        helm: loadout.helm ?? null,
        boots: loadout.boots ?? null,
        accessory: loadout.accessory ?? null,
    };
}
function getDefaultEquipmentLoadoutForUnit(unit) {
    if (!unit) {
        return (0, Equipment_1.createEmptyLoadout)();
    }
    return cloneEquipmentLoadout(unit.equipment);
}
function createDefaultDjinnSlots(selectedDjinn) {
    const slots = [];
    for (let index = 0; index < exports.DEFAULT_DJINN_SLOT_COUNT; index += 1) {
        slots.push(selectedDjinn?.[index] ?? null);
    }
    return slots;
}
function createBattleConfigFromUnits(units, slotCount = exports.DEFAULT_BATTLE_SLOT_COUNT, initialDjinn) {
    const slots = [];
    for (let index = 0; index < slotCount; index += 1) {
        const unit = units[index];
        slots.push({
            slotIndex: index,
            unitId: unit?.id ?? null,
            equipmentLoadout: getDefaultEquipmentLoadoutForUnit(unit),
        });
    }
    return { slots, djinnSlots: createDefaultDjinnSlots(initialDjinn) };
}
function buildBattleConfigForNextBattle(team, roster, slotCount = exports.DEFAULT_BATTLE_SLOT_COUNT) {
    const initialDjinn = team?.equippedDjinn;
    if (team && team.units.length > 0) {
        return createBattleConfigFromUnits(team.units, slotCount, initialDjinn);
    }
    return createBattleConfigFromUnits(roster, slotCount, initialDjinn);
}
function getActiveSlotUnitIds(config) {
    return config.slots
        .map((slot) => slot.unitId)
        .filter((unitId) => Boolean(unitId));
}
function getEquipmentLoadoutForSlot(config, slotIndex) {
    const slot = config.slots.find((entry) => entry.slotIndex === slotIndex);
    return slot ? cloneEquipmentLoadout(slot.equipmentLoadout) : (0, Equipment_1.createEmptyLoadout)();
}
function updateDjinnSlots(slots, slotIndex, djinnId) {
    const next = [...slots];
    next[slotIndex] = djinnId;
    return next;
}
function validateBattleConfig(config, inventory, roster, team) {
    if (!team) {
        return { valid: false, message: 'Team data is missing' };
    }
    const filledUnitIds = getActiveSlotUnitIds(config);
    if (filledUnitIds.length < constants_1.MIN_PARTY_SIZE) {
        return { valid: false, message: `Select at least ${constants_1.MIN_PARTY_SIZE} units before starting the battle` };
    }
    const inventoryCounts = new Map();
    for (const item of inventory) {
        inventoryCounts.set(item.id, (inventoryCounts.get(item.id) ?? 0) + 1);
    }
    const equipmentUsage = new Map();
    for (const slot of config.slots) {
        if (!slot.unitId)
            continue;
        const unit = roster.find((candidate) => candidate.id === slot.unitId) ??
            team.units.find((candidate) => candidate.id === slot.unitId);
        if (!unit) {
            return { valid: false, message: `Unit ${slot.unitId} is unavailable for this slot` };
        }
        const loadoutEntries = Object.values(slot.equipmentLoadout);
        for (const equipment of loadoutEntries) {
            if (!equipment)
                continue;
            if (equipment.allowedElements.length > 0 && !equipment.allowedElements.includes(unit.element)) {
                return { valid: false, message: `${unit.name} cannot equip ${equipment.name}` };
            }
            const used = equipmentUsage.get(equipment.id) ?? 0;
            equipmentUsage.set(equipment.id, used + 1);
        }
    }
    for (const [equipmentId, used] of equipmentUsage.entries()) {
        const available = inventoryCounts.get(equipmentId) ?? 0;
        if (used > available) {
            return { valid: false, message: `Not enough copies of ${equipmentId} in your inventory` };
        }
    }
    const selectedDjinn = config.djinnSlots.filter((djinnId) => Boolean(djinnId));
    for (const djinnId of selectedDjinn) {
        if (!team.collectedDjinn.includes(djinnId)) {
            return { valid: false, message: `You do not own the ${djinnId} Djinn` };
        }
    }
    return { valid: true };
}
