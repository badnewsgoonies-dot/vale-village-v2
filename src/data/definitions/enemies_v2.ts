/**
 * ENEMIES V2 - COUNTER-STRATEGY REDESIGN
 *
 * This file contains the enemy redesign implementation based on:
 * - enemy_redesign_implementation.md
 * - enemy_redesign_code.ts
 * - HOUSE_BALANCE_ANALYSIS.md
 *
 * CHANGES FROM ORIGINAL:
 * - 9 NEW enemies added (healers, buffers, support roles)
 * - 3 MODIFIED enemies (Ice Elemental, Flame Elemental, Phoenix)
 * - Forces djinn system engagement through healing/buffing/phase mechanics
 *
 * DESIGN PHILOSOPHY:
 * - NO type immunities/resistances (per constraint)
 * - Create tactical pressure through healing, buffing, and phase-change mechanics
 * - Force players to use djinn system's counter-element bonuses and summon stacking
 * - Enemies don't have djinn - only abilities and stats
 */

import type { Enemy } from '../schemas/EnemySchema';
import {
  STRIKE,
  HEAVY_STRIKE,
  GUARD_BREAK,
  GUST,
  BLIND,
  FIREBALL,
  ICE_SHARD,
  QUAKE,
  BOOST_ATK,
  BOOST_DEF,
  BURN_TOUCH,
  FREEZE_BLAST,
  WEAKEN_DEF,
  HEAL,
  PARTY_HEAL,
} from './abilities';

// ============================================================================
// COUNTER-STRATEGY ENEMIES - Support Roles (NEW)
// ============================================================================

/**
 * FROST MYSTIC - First Healer (House 4)
 * Replaces: mercury-wolf
 * Role: Low-HP healer that forces focus-fire priority
 * Tactical Impact: Player learns to target healers first
 */
export const FROST_MYSTIC: Enemy = {
  id: 'frost-mystic',
  name: 'Frost Mystic',
  level: 2,
  element: 'Mercury',
  stats: {
    hp: 200,
    pp: 20,
    atk: 10,
    def: 8,
    mag: 12,
    spd: 11,
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 22,
  baseGold: 12,
};

/**
 * GALE PRIEST - Second Healer (House 5)
 * Replaces: jupiter-wolf
 * Role: Healer with debuff (BLIND)
 * Tactical Impact: Forces debuff management + healer priority
 */
export const GALE_PRIEST: Enemy = {
  id: 'gale-priest',
  name: 'Gale Priest',
  level: 2,
  element: 'Jupiter',
  stats: {
    hp: 180,
    pp: 22,
    atk: 8,
    def: 7,
    mag: 14,
    spd: 13,
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 24,
  baseGold: 14,
};

/**
 * STONE GUARDIAN - Tank (House 6)
 * Replaces: earth-scout
 * Role: High DEF tank that buffs itself
 * Tactical Impact: Creates synergy with Ember Cleric healer
 */
export const STONE_GUARDIAN: Enemy = {
  id: 'stone-guardian',
  name: 'Stone Guardian',
  level: 3,
  element: 'Venus',
  stats: {
    hp: 350,
    pp: 10,
    atk: 12,
    def: 20,
    mag: 5,
    spd: 6,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 30,
  baseGold: 16,
};

/**
 * EMBER CLERIC - Healer for Tank (House 6)
 * New enemy for House 6
 * Role: Heals Stone Guardian, creating tank+healer duo
 * Tactical Impact: MUST use Mars djinn for counter-bonus vs Guardian
 */
export const EMBER_CLERIC: Enemy = {
  id: 'ember-cleric',
  name: 'Ember Cleric',
  level: 3,
  element: 'Mars',
  stats: {
    hp: 190,
    pp: 18,
    atk: 9,
    def: 8,
    mag: 11,
    spd: 10,
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 26,
  baseGold: 14,
};

/**
 * EARTH SHAMAN - Buffer + Healer (House 7)
 * New enemy for House 7 (SUMMONS UNLOCK!)
 * Role: Buffs + heals allies, AoE damage
 * Tactical Impact: Forces player to use new 3-djinn summon
 */
export const EARTH_SHAMAN: Enemy = {
  id: 'earth-shaman',
  name: 'Earth Shaman',
  level: 4,
  element: 'Venus',
  stats: {
    hp: 220,
    pp: 25,
    atk: 10,
    def: 14,
    mag: 16,
    spd: 9,
  },
  abilities: [
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 45,
  baseGold: 22,
};

/**
 * TIDE ENCHANTER - Buffer + Healer (House 8)
 * New enemy for House 8 (Mercury Djinn reward)
 * Role: Buffs + heals Jupiter Bear
 * Tactical Impact: Buffed bear becomes unkillable without Venus djinn
 */
export const TIDE_ENCHANTER: Enemy = {
  id: 'tide-enchanter',
  name: 'Tide Enchanter',
  level: 4,
  element: 'Mercury',
  stats: {
    hp: 240,
    pp: 30,
    atk: 11,
    def: 13,
    mag: 18,
    spd: 10,
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 24,
};

/**
 * FROST ORACLE - Party Healer (House 9)
 * New enemy for House 9
 * Role: Party-wide healing creates endurance battle
 * Tactical Impact: Two healers (Oracle + Ice Elemental) sustain each other
 */
export const FROST_ORACLE: Enemy = {
  id: 'frost-oracle',
  name: 'Frost Oracle',
  level: 5,
  element: 'Mercury',
  stats: {
    hp: 200,
    pp: 35,
    atk: 10,
    def: 12,
    mag: 20,
    spd: 11,
  },
  abilities: [
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
  ],
  baseXp: 55,
  baseGold: 26,
};

/**
 * TERRA WARDEN - Buffer + Tank + Healer (House 11)
 * New enemy for House 11
 * Role: Buffs both allies' ATK/DEF + heals
 * Tactical Impact: Triple-buffed enemies require counter-element summons
 */
export const TERRA_WARDEN: Enemy = {
  id: 'terra-warden',
  name: 'Terra Warden',
  level: 6,
  element: 'Venus',
  stats: {
    hp: 260,
    pp: 28,
    atk: 16,
    def: 16,
    mag: 14,
    spd: 9,
  },
  abilities: [
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 58,
  baseGold: 28,
};

/**
 * FLAME HERALD - Buffer + Debuffer (House 12)
 * New enemy for House 12 (T2 Djinn reward)
 * Role: Buffs Phoenix ATK, debuffs player DEF
 * Tactical Impact: Creates brutal synergy with Phoenix's 3 phases
 */
export const FLAME_HERALD: Enemy = {
  id: 'flame-herald',
  name: 'Flame Herald',
  level: 7,
  element: 'Mars',
  stats: {
    hp: 220,
    pp: 32,
    atk: 18,
    def: 14,
    mag: 20,
    spd: 13,
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 70,
  baseGold: 35,
};

// ============================================================================
// MODIFIED EXISTING ENEMIES
// ============================================================================

/**
 * ICE ELEMENTAL - MODIFIED (House 9)
 * Change: Added HEAL ability
 * Reason: Creates double-healer synergy with Frost Oracle
 * Tactical Impact: Two healers sustain each other, forcing summon usage
 */
export const ICE_ELEMENTAL: Enemy = {
  id: 'ice-elemental',
  name: 'Ice Elemental',
  level: 6,
  element: 'Mercury',
  stats: {
    hp: 130,
    pp: 24,
    atk: 12,
    def: 18,
    mag: 18,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },  // ← ADDED
  ],
  baseXp: 45,
  baseGold: 24,
};

/**
 * FLAME ELEMENTAL - MODIFIED (House 10)
 * Changes: Increased HP/PP/MAG, added BOOST_ATK and WEAKEN_DEF
 * Reason: First phase-change boss
 * Phase 1 (HP > 60%): BOOST_ATK on self, then aggressive
 * Phase 2 (HP ≤ 60%): WEAKEN_DEF on player, spam FIREBALL
 * Tactical Impact: Forces adaptive djinn swapping mid-battle
 */
export const FLAME_ELEMENTAL: Enemy = {
  id: 'flame-elemental',
  name: 'Flame Elemental',
  level: 6,
  element: 'Mars',
  stats: {
    hp: 180,   // ← CHANGED from 120
    pp: 35,    // ← CHANGED from 28
    atk: 14,
    def: 14,
    mag: 24,   // ← CHANGED from 20
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },    // ← ADDED
    { ...WEAKEN_DEF, unlockLevel: 1 },   // ← ADDED
  ],
  baseXp: 60,   // ← CHANGED from 45
  baseGold: 30, // ← CHANGED from 24
};

/**
 * PHOENIX - MODIFIED (House 12)
 * Changes: Increased HP/PP/MAG, added PARTY_HEAL and BOOST_ATK
 * Reason: Phase-change boss with rebirth mechanic
 * Phase 1 (HP > 50%): Aggressive (FIREBALL, BURN_TOUCH)
 * Phase 2 (HP 25-50%): "Rebirth" mode - PARTY_HEAL + BOOST_ATK
 * Phase 3 (HP < 25%): Desperation - spam HEAL on self
 * Tactical Impact: Must use Mercury djinn summons to burst through Phase 2 heal
 */
export const PHOENIX: Enemy = {
  id: 'phoenix',
  name: 'Phoenix',
  level: 8,
  element: 'Mars',
  stats: {
    hp: 240,   // ← CHANGED from 180
    pp: 40,    // ← CHANGED from 35
    atk: 22,
    def: 18,
    mag: 28,   // ← CHANGED from 26
    spd: 18,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },   // ← ADDED
    { ...BOOST_ATK, unlockLevel: 1 },    // ← ADDED
  ],
  baseXp: 110,  // ← CHANGED from 90
  baseGold: 60, // ← CHANGED from 50
};

// ============================================================================
// ENEMIES EXPORT DICTIONARY
// ============================================================================

/**
 * New enemies to add to the existing ENEMIES record:
 *
 * Usage: Merge these into the existing ENEMIES object in enemies.ts
 */
export const NEW_ENEMIES: Record<string, Enemy> = {
  // Counter-Strategy Enemies (NEW)
  'frost-mystic': FROST_MYSTIC,
  'gale-priest': GALE_PRIEST,
  'stone-guardian': STONE_GUARDIAN,
  'ember-cleric': EMBER_CLERIC,
  'earth-shaman': EARTH_SHAMAN,
  'tide-enchanter': TIDE_ENCHANTER,
  'frost-oracle': FROST_ORACLE,
  'terra-warden': TERRA_WARDEN,
  'flame-herald': FLAME_HERALD,

  // Modified Enemies (REPLACE existing)
  'ice-elemental': ICE_ELEMENTAL,
  'flame-elemental': FLAME_ELEMENTAL,
  'phoenix': PHOENIX,
};

// ============================================================================
// ENCOUNTER MODIFICATIONS REFERENCE
// ============================================================================

/**
 * ENCOUNTERS TO MODIFY (encounters.ts):
 *
 * HOUSE 4:
 *   enemies: ['frost-scout', 'frost-mystic']  // ← CHANGED from mercury-wolf
 *
 * HOUSE 5:
 *   enemies: ['gale-scout', 'gale-priest']    // ← CHANGED from jupiter-wolf
 *
 * HOUSE 6:
 *   enemies: ['stone-guardian', 'ember-cleric', 'flame-scout']  // ← CHANGED
 *
 * HOUSE 7:
 *   enemies: ['terra-soldier', 'venus-bear', 'earth-shaman']    // ← ADDED earth-shaman
 *
 * HOUSE 8:
 *   enemies: ['jupiter-bear', 'wind-soldier', 'tide-enchanter'] // ← ADDED tide-enchanter
 *
 * HOUSE 9:
 *   enemies: ['mercury-bear', 'frost-oracle', 'ice-elemental']  // ← CHANGED
 *
 * HOUSE 11:
 *   enemies: ['stone-captain', 'rock-elemental', 'terra-warden'] // ← ADDED terra-warden
 *
 * HOUSE 12:
 *   enemies: ['inferno-captain', 'phoenix', 'flame-herald']      // ← ADDED flame-herald
 */

// ============================================================================
// TACTICAL IMPACT SUMMARY
// ============================================================================

/**
 * DIFFICULTY CURVE IMPACT:
 *
 * HOUSE 4: First Priority Target
 * - Before: Scout + Wolf (both attackers) → Button mash wins
 * - After: Scout + Mystic (mystic heals scout) → Must focus-fire mystic
 * - Djinn Engagement: Mercury djinn give bonus damage vs. Mars scout
 *
 * HOUSE 5: Debuff Pressure
 * - Before: Scout + Wolf → Simple damage race
 * - After: Scout + Priest (priest blinds AND heals) → Must manage debuffs
 * - Djinn Engagement: Venus djinn counter Jupiter element
 *
 * HOUSE 6: Tank + Support
 * - Before: 3 attackers → AoE spam wins
 * - After: Guardian (high DEF, buffs self) + Cleric (heals guardian) + Scout
 * - Djinn Engagement: MUST use Mars djinn for counter-bonus vs. Stone Guardian
 *
 * HOUSE 7: SUMMONS MILESTONE
 * - Before: Soldier + Bear → No reason to use new summon
 * - After: Soldier + Bear + Shaman (buffs bear DEF, heals, AoE quake)
 * - Djinn Engagement: Shaman forces player to use 3-djinn summon for burst damage
 *
 * HOUSE 8: Endurance Test
 * - Before: Soldier + Bear → No synergy
 * - After: Bear + Soldier + Enchanter (buffs bear DEF AND heals it)
 * - Djinn Engagement: Buffed + healed bear requires Venus djinn counter-bonus
 *
 * HOUSE 9: Double Healer Hell
 * - Before: Soldier + Bear + Elemental → Linear difficulty
 * - After: Bear + Oracle (party heal!) + Elemental (heal)
 * - Djinn Engagement: Two healers sustain each other, MUST use summons
 *
 * HOUSE 10: Phase Introduction
 * - Before: Soldier + Bear + Elemental → Predictable
 * - After: Elemental has phases (Phase 1 buffs ATK, Phase 2 debuffs DEF + nukes)
 * - Djinn Engagement: Phase changes force reactive djinn swapping
 *
 * HOUSE 11: Trinity Wall
 * - Before: Captain + Elemental → Linear
 * - After: Captain + Elemental + Warden (buffs BOTH ATK/DEF + heals)
 * - Djinn Engagement: Triple-buffed enemies require counter-element summons
 *
 * HOUSE 12: Boss Gauntlet
 * - Before: Captain + Phoenix → Phoenix heals but no synergy
 * - After: Captain (buffs ATK) + Herald (buffs phoenix, debuffs player) + Phoenix (3 phases)
 * - Djinn Engagement:
 *   - Must use Mercury djinn for counter-element vs. Mars enemies
 *   - Must use summons in Phase 2 before Phoenix fully heals
 *   - Herald's DEF debuff makes counter-element critical
 *   - This is T2 Djinn reward house - player just got Granite!
 */

// ============================================================================
// BALANCING NOTES
// ============================================================================

/**
 * XP/GOLD ADJUSTMENTS:
 * Total XP increase across H4-H12: ~380 XP
 * - Compensates for increased difficulty
 * - Rewards mastery of djinn system
 *
 * DIFFICULTY CURVE:
 * - H4-H5: Learn to focus-fire healers (EASY)
 * - H6-H7: Learn to use counter-element bonuses (MEDIUM)
 * - H8-H9: Learn summons are mandatory (MEDIUM)
 * - H10-H11: Learn phase adaptations (HARD)
 * - H12: Master all systems (HARD - but T2 Djinn just unlocked)
 *
 * DESIGN CONSTRAINTS MET:
 * ✅ NO type immunities/resistances
 * ✅ Enemies don't have djinn
 * ✅ Only abilities + stats modified
 * ✅ Forces djinn system engagement:
 *   - Counter-element bonuses needed to overcome healing
 *   - Summons needed to burst through support
 *   - Djinn swapping needed for phase adaptations
 */

/**
 * IMPLEMENTATION ORDER:
 *
 * 1. ✅ Create enemies_v2.ts (this file) with new enemies
 * 2. [ ] Merge NEW_ENEMIES into enemies.ts ENEMIES export
 * 3. [ ] Update encounters.ts with new enemy arrays (see ENCOUNTER MODIFICATIONS)
 * 4. [ ] Test progression H4-H12 to verify difficulty scales properly
 * 5. [ ] Future: Implement AI phase logic for Flame Elemental (H10) and Phoenix (H12)
 */
