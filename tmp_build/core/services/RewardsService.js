"use strict";
/**
 * Rewards Service
 * Handles post-battle reward processing (no RNG)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVictory = processVictory;
exports.resolveEquipmentReward = resolveEquipmentReward;
const Unit_1 = require("../models/Unit");
const rewards_1 = require("../algorithms/rewards");
const BattleState_1 = require("../models/BattleState");
const equipment_1 = require("../../data/definitions/equipment");
function processVictory(battle, options = {}) {
    const encounterId = (0, BattleState_1.getEncounterId)(battle);
    if (!encounterId) {
        throw new Error('Cannot process victory without encounter ID');
    }
    const includeEquipment = options.includeEquipment ?? true;
    const resetDjinn = options.resetDjinn ?? true;
    const survivors = battle.playerTeam.units.filter(u => !(0, Unit_1.isUnitKO)(u));
    const partySize = battle.playerTeam.units.length;
    const rewards = (0, rewards_1.calculateBattleRewards)(encounterId, partySize, survivors.length);
    const distribution = (0, rewards_1.distributeRewards)(battle.playerTeam, rewards);
    // NOTE: Djinn rewards and unit recruitment are now handled via post-battle recruitment dialogues
    // The encounter.reward.djinn and encounter.reward.unlockUnit fields are kept for validation
    // but not processed here. All rewards are narrative-driven via dialogue effects.
    let updatedTeam = distribution.updatedTeam;
    if (resetDjinn) {
        // Reset all Djinn to Set state after battle (like units heal to full)
        const resetDjinnTrackers = { ...updatedTeam.djinnTrackers };
        for (const djinnId in resetDjinnTrackers) {
            const tracker = resetDjinnTrackers[djinnId];
            if (tracker) {
                resetDjinnTrackers[djinnId] = {
                    djinnId: tracker.djinnId,
                    state: 'Set',
                    lastActivatedTurn: tracker.lastActivatedTurn,
                };
            }
        }
        updatedTeam = {
            ...updatedTeam,
            djinnTrackers: resetDjinnTrackers,
        };
    }
    // NOTE: Unit recruitment is now handled via post-battle recruitment dialogues
    // The encounter.reward.unlockUnit field is kept for validation but not processed here
    // All recruitment is narrative-driven via dialogue effects (recruitUnit)
    const resolvedDistribution = includeEquipment
        ? (() => {
            const equipmentResolution = resolveEquipmentReward(rewards.equipmentReward);
            return {
                ...distribution,
                fixedEquipment: equipmentResolution.type === 'fixed' ? equipmentResolution.equipment : undefined,
                equipmentChoice: equipmentResolution.type === 'choice' ? equipmentResolution.options : undefined,
            };
        })()
        : distribution;
    return {
        distribution: resolvedDistribution,
        updatedTeam,
        // No recruitedUnit - all recruitment is narrative-driven
    };
}
function resolveEquipmentReward(reward) {
    switch (reward.type) {
        case 'none':
            return { type: 'none' };
        case 'fixed': {
            const equipment = equipment_1.EQUIPMENT[reward.itemId];
            if (!equipment) {
                throw new Error(`Equipment ${reward.itemId} not found`);
            }
            return { type: 'fixed', equipment };
        }
        case 'choice': {
            const options = reward.options.map(id => {
                const equipment = equipment_1.EQUIPMENT[id];
                if (!equipment) {
                    throw new Error(`Equipment ${id} not found`);
                }
                return equipment;
            });
            return { type: 'choice', options };
        }
    }
}
