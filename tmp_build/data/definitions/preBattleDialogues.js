"use strict";
/**
 * Pre-Battle Dialogue System
 * Maps encounter IDs to pre-battle dialogue trees
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCOUNTER_TO_PRE_BATTLE_DIALOGUE = void 0;
exports.getPreBattleDialogue = getPreBattleDialogue;
exports.hasPreBattleDialogue = hasPreBattleDialogue;
exports.isPreBattleDialogueTree = isPreBattleDialogueTree;
const liberationDialogues_1 = require("./liberationDialogues");
/**
 * Map encounter IDs to pre-battle dialogue IDs
 */
exports.ENCOUNTER_TO_PRE_BATTLE_DIALOGUE = {
    'house-01': 'house-01-liberation',
    'house-02': 'house-02-flint',
    'house-03': 'house-03-ice',
    'house-04': 'house-04-breeze',
    'house-05': 'house-05-escalation',
    'house-06': 'house-06-forge',
};
/**
 * Map dialogue IDs to actual dialogue trees
 */
const PRE_BATTLE_DIALOGUE_MAP = {
    'house-01-liberation': liberationDialogues_1.HOUSE_01_DIALOGUE,
    'house-02-flint': liberationDialogues_1.HOUSE_02_DIALOGUE,
    'house-03-ice': liberationDialogues_1.HOUSE_03_DIALOGUE,
    'house-04-breeze': liberationDialogues_1.HOUSE_04_DIALOGUE,
    'house-05-escalation': liberationDialogues_1.HOUSE_05_DIALOGUE,
    'house-06-forge': liberationDialogues_1.HOUSE_06_DIALOGUE,
};
const PRE_BATTLE_DIALOGUE_IDS = new Set(Object.values(exports.ENCOUNTER_TO_PRE_BATTLE_DIALOGUE));
/**
 * Get pre-battle dialogue for an encounter ID
 * Returns null if encounter doesn't have a pre-battle dialogue
 */
function getPreBattleDialogue(encounterId) {
    const dialogueId = exports.ENCOUNTER_TO_PRE_BATTLE_DIALOGUE[encounterId];
    if (!dialogueId)
        return null;
    return PRE_BATTLE_DIALOGUE_MAP[dialogueId] || null;
}
/**
 * Check if an encounter has a pre-battle dialogue
 */
function hasPreBattleDialogue(encounterId) {
    return encounterId in exports.ENCOUNTER_TO_PRE_BATTLE_DIALOGUE;
}
function isPreBattleDialogueTree(dialogueId) {
    return Boolean(dialogueId && PRE_BATTLE_DIALOGUE_IDS.has(dialogueId));
}
