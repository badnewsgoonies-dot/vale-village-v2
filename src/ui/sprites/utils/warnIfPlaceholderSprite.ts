const PLACEHOLDER_PREFIXES = ['missing-battle-sprite-', 'missing-compendium-enemy-'];
const IS_DEV = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

export function warnIfPlaceholderSprite(screenName: string, spriteId: string) {
  // use screenName variable in dev builds to avoid unused-var errors
  void screenName;
  if (!IS_DEV) {
    return;
  }
  if (PLACEHOLDER_PREFIXES.some(prefix => spriteId.startsWith(prefix))) {
    // Development helper: placeholder sprite rendered; mapping missing for this sprite (dev-only)
  }
}

