"use strict";
/**
 * Status Effect Icon Mapping
 * Maps status effect types to sprite icon IDs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_ICON_MAP = void 0;
exports.getStatusIconSprite = getStatusIconSprite;
exports.hasStatusIcon = hasStatusIcon;
/**
 * Maps status effect types to sprite IDs
 * Uses available icons from /sprites/icons/psynergy/ and /sprites/icons/misc/
 */
exports.STATUS_ICON_MAP = {
    // Direct matches from available sprites
    'poison': 'poison-flow', // Poison_Flow.gif
    'freeze': 'freeze-prism', // Freeze_Prism.gif
    'sleep': 'sleep', // Sleep.gif
    'weaken': 'weaken', // Weaken.gif
    // Inferred from Psynergy icons (need verification)
    'burn': 'fire', // Use fire icon as placeholder
    'paralyze': 'lightning', // Use lightning icon
    'stun': 'dizzy', // Use dizzy/sweatdrop as fallback
    'confuse': 'sweatdrop', // Sweatdrop.gif
    'strengthen': 'status', // Status.gif for buff indication
};
/**
 * Get sprite ID for a status effect
 * Returns fallback if status type not recognized
 */
function getStatusIconSprite(status) {
    const statusType = status.toLowerCase();
    return exports.STATUS_ICON_MAP[statusType] || 'status';
}
/**
 * Check if a status effect has an icon
 */
function hasStatusIcon(status) {
    const statusType = status.toLowerCase();
    return statusType in exports.STATUS_ICON_MAP;
}
