"use strict";
/**
 * UI Icon Sprite Mappings
 * Maps UI button/icon types to sprite paths
 * Replaces emoji icons with proper GBA-style sprites
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMOJI_TO_SPRITE = exports.UI_ICON_MAP = exports.SERVICE_ICONS = exports.SHOP_ICONS = exports.MENU_ICONS = exports.BATTLE_COMMAND_ICONS = void 0;
exports.getUIIcon = getUIIcon;
exports.getBattleCommandIcon = getBattleCommandIcon;
exports.replaceEmojiWithSprites = replaceEmojiWithSprites;
const UI_ICONS_BASE_PATH = '/sprites/icons/buttons';
/**
 * Battle command button icons
 */
exports.BATTLE_COMMAND_ICONS = {
    'attack': `${UI_ICONS_BASE_PATH}/Attack.gif`,
    'defend': `${UI_ICONS_BASE_PATH}/Defend.gif`,
    'psynergy': `${UI_ICONS_BASE_PATH}/Psynergy.gif`,
    'djinn': `${UI_ICONS_BASE_PATH}/Djinni.gif`,
    'item': `${UI_ICONS_BASE_PATH}/Item.gif`,
    'flee': `${UI_ICONS_BASE_PATH}/Flee.gif`,
    'fight': `${UI_ICONS_BASE_PATH}/Fight.gif`,
    'battle': `${UI_ICONS_BASE_PATH}/Battle.gif`,
};
/**
 * Menu/System icons
 */
exports.MENU_ICONS = {
    'new-game': `${UI_ICONS_BASE_PATH}/New_Quest.gif`,
    'continue': `${UI_ICONS_BASE_PATH}/Continue.gif`,
    'options': `${UI_ICONS_BASE_PATH}/Options.gif`,
    'options-2': `${UI_ICONS_BASE_PATH}/Options2.gif`,
    'password': `${UI_ICONS_BASE_PATH}/Password.gif`,
    'bronze-password': `${UI_ICONS_BASE_PATH}/Bronze_Password.gif`,
    'gold-password': `${UI_ICONS_BASE_PATH}/Gold_Password.gif`,
    'link-cable': `${UI_ICONS_BASE_PATH}/Link_Cable.gif`,
    'copy-file': `${UI_ICONS_BASE_PATH}/Copy_File.gif`,
    'erase-file': `${UI_ICONS_BASE_PATH}/Erase_File.gif`,
    'yes': `${UI_ICONS_BASE_PATH}/no.gif`, // Note: might need proper yes.gif
    'no': `${UI_ICONS_BASE_PATH}/no.gif`,
};
/**
 * Shop/Economy icons
 */
exports.SHOP_ICONS = {
    'buy': `${UI_ICONS_BASE_PATH}/Buy.gif`,
    'coins': `${UI_ICONS_BASE_PATH}/Coins.gif`,
    'lucky-medals': `${UI_ICONS_BASE_PATH}/Lucky_Medals.gif`,
    'artifacts': `${UI_ICONS_BASE_PATH}/Artifacts.gif`,
};
/**
 * Service icons (Inn, Sanctum, etc.)
 */
exports.SERVICE_ICONS = {
    'cure-poison': `${UI_ICONS_BASE_PATH}/Cure_Poison.gif`,
    'remove-curse': `${UI_ICONS_BASE_PATH}/Remove_Curse.gif`,
    'repair': `${UI_ICONS_BASE_PATH}/Repair.gif`,
    'repel-evil': `${UI_ICONS_BASE_PATH}/Repel_Evil.gif`,
};
/**
 * Combined UI icon map for easy lookup
 */
exports.UI_ICON_MAP = {
    ...exports.BATTLE_COMMAND_ICONS,
    ...exports.MENU_ICONS,
    ...exports.SHOP_ICONS,
    ...exports.SERVICE_ICONS,
};
/**
 * Get UI icon sprite path
 */
function getUIIcon(iconId) {
    return exports.UI_ICON_MAP[iconId] || null;
}
/**
 * Get battle command icon
 */
function getBattleCommandIcon(command) {
    return exports.BATTLE_COMMAND_ICONS[command.toLowerCase()] || null;
}
/**
 * Emoji to sprite replacement map
 * Used for converting emoji-based UI to sprite-based
 */
exports.EMOJI_TO_SPRITE = {
    '⚔️': `${UI_ICONS_BASE_PATH}/Attack.gif`,
    '🛡️': `${UI_ICONS_BASE_PATH}/Defend.gif`,
    '✨': `${UI_ICONS_BASE_PATH}/Psynergy.gif`,
    '🔮': `${UI_ICONS_BASE_PATH}/Djinni.gif`,
    '🎒': `${UI_ICONS_BASE_PATH}/Item.gif`,
    '🏃': `${UI_ICONS_BASE_PATH}/Flee.gif`,
    '💰': `${UI_ICONS_BASE_PATH}/Coins.gif`,
    '🎖️': `${UI_ICONS_BASE_PATH}/Lucky_Medals.gif`,
    '💎': `${UI_ICONS_BASE_PATH}/Artifacts.gif`,
};
/**
 * Replace emoji in text with sprite references
 * Returns array of text segments and sprite IDs for rendering
 */
function replaceEmojiWithSprites(text) {
    const result = [];
    let remaining = text;
    for (const [emoji, sprite] of Object.entries(exports.EMOJI_TO_SPRITE)) {
        const parts = remaining.split(emoji);
        if (parts.length > 1) {
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (part) {
                    result.push({ type: 'text', value: part });
                }
                if (i < parts.length - 1) {
                    result.push({ type: 'sprite', value: sprite });
                }
            }
            remaining = '';
            break;
        }
    }
    if (remaining) {
        result.push({ type: 'text', value: remaining });
    }
    return result;
}
