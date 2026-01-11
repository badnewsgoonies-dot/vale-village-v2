"use strict";
/**
 * AbilityId union type
 *
 * Type-safe ability IDs extracted from ability definitions.
 * This provides compile-time validation that ability IDs are valid.
 *
 * @see src/data/definitions/abilities.ts for ability definitions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAbilityId = isAbilityId;
/**
 * Type guard to check if a string is a valid AbilityId
 */
function isAbilityId(id) {
    return [
        'strike',
        'heavy-strike',
        'guard-break',
        'precise-jab',
        'poison-strike',
        'fireball',
        'ice-shard',
        'quake',
        'gust',
        'chain-lightning',
        'burn-touch',
        'freeze-blast',
        'paralyze-shock',
        'heal',
        'party-heal',
        'boost-atk',
        'boost-def',
        'weaken-def',
        'blind',
        // Equipment abilities
        'wooden-strike',
        'bronze-slash',
        'iron-bulwark',
        'arcane-bolt',
        'iron-thrust',
        'steel-focus',
        'steel-ward',
        'axe-cleave',
        'iron-mind',
        'silver-shield',
        'mythril-wisdom',
        'hyper-speed',
        'mythril-edge',
        'dragon-ward',
        'oracle-vision',
        'steel-slash',
        'crystal-blast',
        'silver-strike',
        'great-cleave',
        'zodiac-bolt',
    ].includes(id);
}
