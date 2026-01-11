"use strict";
/**
 * Sprite Utility Functions
 * Helpers for mapping domain entities to sprite IDs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnitSpriteId = getUnitSpriteId;
exports.getEnemySpriteId = getEnemySpriteId;
exports.getSpriteStateFromEvent = getSpriteStateFromEvent;
/**
 * Get sprite ID for a unit
 */
function getUnitSpriteId(unitId) {
    return `unit:${unitId}`;
}
/**
 * Get sprite ID for an enemy
 */
function getEnemySpriteId(enemyId) {
    return `enemy:${enemyId}`;
}
/**
 * Get sprite state from battle event
 */
function getSpriteStateFromEvent(eventType) {
    switch (eventType) {
        case 'ability':
            return 'cast';
        case 'hit':
            return 'hurt';
        case 'ko':
            return 'downed';
        default:
            return 'idle';
    }
}
