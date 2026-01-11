"use strict";
/**
 * Recruitment Data Definitions
 *
 * This file defines which encounters trigger recruitment dialogues and what they grant.
 * This is data-driven so encounters can be easily reassigned without code changes.
 *
 * IMPORTANT: Tests should verify the mechanism works, not specific house→unit mappings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCOUNTER_TO_RECRUITMENT_DIALOGUE = void 0;
exports.getRecruitmentDialogue = getRecruitmentDialogue;
exports.hasRecruitmentDialogue = hasRecruitmentDialogue;
exports.extractRecruitmentInfo = extractRecruitmentInfo;
exports.getAllRecruitmentEncounters = getAllRecruitmentEncounters;
exports.getRecruitmentInfo = getRecruitmentInfo;
const recruitmentDialogues_1 = require("./recruitmentDialogues");
/**
 * Map encounter IDs to recruitment dialogue IDs
 * This is the single source of truth for which encounters trigger recruitment.
 */
exports.ENCOUNTER_TO_RECRUITMENT_DIALOGUE = {
    'house-01': 'house-01-recruit',
    'house-02': 'house-02-recruit',
    'house-03': 'house-03-recruit',
    'house-04': 'house-04-post',
    'house-05': 'house-05-recruit',
    'house-07': 'house-07-djinn',
    'house-08': 'house-08-recruit',
    'house-11': 'house-11-recruit',
    'house-12': 'house-12-djinn',
    'house-14': 'house-14-recruit',
    'house-15': 'house-15-recruit',
    'house-17': 'house-17-recruit',
    'house-18': 'house-18-djinn',
    'house-20': 'house-20-djinn',
};
/**
 * Get recruitment dialogue for an encounter ID
 * Returns null if encounter doesn't have a recruitment dialogue
 */
function getRecruitmentDialogue(encounterId) {
    const dialogueId = exports.ENCOUNTER_TO_RECRUITMENT_DIALOGUE[encounterId];
    if (!dialogueId)
        return null;
    return recruitmentDialogues_1.RECRUITMENT_DIALOGUES[dialogueId] || null;
}
/**
 * Check if an encounter has a recruitment dialogue
 */
function hasRecruitmentDialogue(encounterId) {
    return encounterId in exports.ENCOUNTER_TO_RECRUITMENT_DIALOGUE;
}
/**
 * Extract recruitment info from a dialogue tree
 * Returns what unit/Djinn will be granted by this dialogue
 */
function extractRecruitmentInfo(dialogue) {
    let recruitsUnit = null;
    let grantsDjinn = null;
    // Traverse dialogue nodes to find effects
    const visited = new Set();
    const queue = [dialogue.startNodeId];
    while (queue.length > 0) {
        const nodeId = queue.shift();
        if (visited.has(nodeId))
            continue;
        visited.add(nodeId);
        const node = dialogue.nodes.find(n => n.id === nodeId);
        if (!node)
            continue;
        // Check for recruitment effects
        if (node.effects) {
            if (typeof node.effects.recruitUnit === 'string') {
                recruitsUnit = node.effects.recruitUnit;
            }
            if (typeof node.effects.grantDjinn === 'string') {
                grantsDjinn = node.effects.grantDjinn;
            }
        }
        // Continue traversal
        if (node.nextNodeId && !visited.has(node.nextNodeId)) {
            queue.push(node.nextNodeId);
        }
        if (node.choices) {
            for (const choice of node.choices) {
                if (choice.nextNodeId && !visited.has(choice.nextNodeId)) {
                    queue.push(choice.nextNodeId);
                }
            }
        }
    }
    return { recruitsUnit, grantsDjinn };
}
/**
 * Get all encounters that trigger recruitment dialogues
 */
function getAllRecruitmentEncounters() {
    return Object.keys(exports.ENCOUNTER_TO_RECRUITMENT_DIALOGUE);
}
/**
 * Get recruitment info for an encounter
 * Returns null if encounter doesn't have recruitment dialogue
 */
function getRecruitmentInfo(encounterId) {
    const dialogue = getRecruitmentDialogue(encounterId);
    if (!dialogue)
        return null;
    return extractRecruitmentInfo(dialogue);
}
