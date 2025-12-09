/**
 * Animation timing constants for battle system
 * Based on Golden Sun's deliberate pacing
 */

/** Base delays in milliseconds */
export const ANIMATION_TIMING = {
  /** Brief pause before action starts - builds anticipation */
  WINDUP: 200,

  /** GIF animation display time */
  EXECUTE: {
    ABILITY: 1800,      // Psynergy/special moves
    BASIC_ATTACK: 1200, // Strike, etc.
    HEAL: 1400,         // Healing spells
    STATUS: 1000,       // Buff/debuff application
  },

  /** Pause after action to show impact */
  IMPACT: {
    DAMAGE: 400,   // After hit lands
    HEAL: 350,     // After heal applies
    KO: 800,       // Dramatic pause for knockout
    STATUS: 300,   // After status applies
  },

  /** Inter-event pause prevents rushed feeling */
  INTER_EVENT: 350,

  /** Minimum delay even if GIF is cached */
  MIN_DISPLAY: 800,
} as const;

/**
 * Calculate total delay for an event based on type
 */
export function getEventTiming(eventType: string, _isGifCached: boolean): number {
  const base = ANIMATION_TIMING;

  switch (eventType) {
    case 'ability':
      return base.WINDUP + base.EXECUTE.ABILITY + base.IMPACT.DAMAGE + base.INTER_EVENT;

    case 'hit':
      // Hit events follow ability - shorter since GIF already shown
      return base.IMPACT.DAMAGE + base.INTER_EVENT;

    case 'heal':
      return base.WINDUP + base.EXECUTE.HEAL + base.IMPACT.HEAL + base.INTER_EVENT;

    case 'status-applied':
    case 'status-expired':
      return base.EXECUTE.STATUS + base.IMPACT.STATUS + base.INTER_EVENT;

    case 'ko':
      return base.IMPACT.KO + base.INTER_EVENT;

    case 'auto-heal':
      return base.EXECUTE.HEAL + base.INTER_EVENT;

    default:
      return base.MIN_DISPLAY + base.INTER_EVENT;
  }
}

/**
 * Speed multipliers for user preference
 */
export const SPEED_PRESETS = {
  slow: 1.5,
  normal: 1.0,
  fast: 0.6,
  instant: 0.1,
} as const;

export type SpeedPreset = keyof typeof SPEED_PRESETS;
