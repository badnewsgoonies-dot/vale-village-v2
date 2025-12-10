/**
 * UI Icon Sprite Mappings
 * Maps UI button/icon types to sprite paths
 * Replaces emoji icons with proper GBA-style sprites
 */

const UI_ICONS_BASE_PATH = '/sprites/icons/buttons';

/**
 * Battle command button icons
 */
export const BATTLE_COMMAND_ICONS: Record<string, string> = {
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
export const MENU_ICONS: Record<string, string> = {
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
export const SHOP_ICONS: Record<string, string> = {
  'buy': `${UI_ICONS_BASE_PATH}/Buy.gif`,
  'coins': `${UI_ICONS_BASE_PATH}/Coins.gif`,
  'lucky-medals': `${UI_ICONS_BASE_PATH}/Lucky_Medals.gif`,
  'artifacts': `${UI_ICONS_BASE_PATH}/Artifacts.gif`,
};

/**
 * Service icons (Inn, Sanctum, etc.)
 */
export const SERVICE_ICONS: Record<string, string> = {
  'cure-poison': `${UI_ICONS_BASE_PATH}/Cure_Poison.gif`,
  'remove-curse': `${UI_ICONS_BASE_PATH}/Remove_Curse.gif`,
  'repair': `${UI_ICONS_BASE_PATH}/Repair.gif`,
  'repel-evil': `${UI_ICONS_BASE_PATH}/Repel_Evil.gif`,
};

/**
 * Combined UI icon map for easy lookup
 */
export const UI_ICON_MAP: Record<string, string> = {
  ...BATTLE_COMMAND_ICONS,
  ...MENU_ICONS,
  ...SHOP_ICONS,
  ...SERVICE_ICONS,
};

/**
 * Get UI icon sprite path
 */
export function getUIIcon(iconId: string): string | null {
  return UI_ICON_MAP[iconId] || null;
}

/**
 * Get battle command icon
 */
export function getBattleCommandIcon(command: string): string | null {
  return BATTLE_COMMAND_ICONS[command.toLowerCase()] || null;
}

/**
 * Emoji to sprite replacement map
 * Used for converting emoji-based UI to sprite-based
 */
export const EMOJI_TO_SPRITE: Record<string, string> = {
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
export function replaceEmojiWithSprites(text: string): Array<{ type: 'text' | 'sprite'; value: string }> {
  const result: Array<{ type: 'text' | 'sprite'; value: string }> = [];
  let remaining = text;

  for (const [emoji, sprite] of Object.entries(EMOJI_TO_SPRITE)) {
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
