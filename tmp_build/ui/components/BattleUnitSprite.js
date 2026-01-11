"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleUnitSprite = BattleUnitSprite;
const jsx_runtime_1 = require("preact/jsx-runtime");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const mappings_1 = require("../sprites/mappings");
const warnIfPlaceholderSprite_1 = require("../sprites/utils/warnIfPlaceholderSprite");
const SIZE_MAP = {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 64, height: 64 },
};
const STATE_PROP_TO_BATTLE_STATE = {
    idle: 'idle',
    attack: 'attack',
    hit: 'hit',
    damage: 'hit',
};
/**
 * BattleUnitSprite component
 * Delegates sprite selection to the battle sprite mapping layer so that
 * production screens do not need to know concrete asset IDs.
 */
function BattleUnitSprite({ unitId, state = 'idle', size = 'medium', className, style, }) {
    const sizeStyles = SIZE_MAP[size];
    const mappedState = STATE_PROP_TO_BATTLE_STATE[state] ?? 'idle';
    const spriteId = (0, mappings_1.getPlayerBattleSprite)(unitId, mappedState) ??
        (0, mappings_1.getEnemyBattleSprite)(unitId, mappedState) ??
        null;
    const resolvedSpriteId = spriteId ?? `missing-battle-sprite-${unitId}-${mappedState}`;
    (0, warnIfPlaceholderSprite_1.warnIfPlaceholderSprite)('BattleUnitSprite', resolvedSpriteId);
    // Render sprite using SimpleSprite with catalog lookup
    return ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: resolvedSpriteId, width: sizeStyles.width, height: sizeStyles.height, className: className, style: style, alt: spriteId ? `${unitId} sprite` : `Missing battle sprite for ${unitId}` }));
}
