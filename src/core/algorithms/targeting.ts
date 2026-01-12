/**
 * Targeting algorithms
 * Resolve target sets for abilities
 * Pure functions, deterministic
 */

import type { Unit } from '../models/Unit';
import type { Ability } from '../../data/schemas/AbilitySchema';
import { isUnitKO } from '../models/Unit';

/**
 * Resolve targets for an ability
 * Returns array of units matching the ability's target type
 */
export function resolveTargets(
  ability: Ability,
  caster: Unit,
  playerUnits: readonly Unit[],
  enemyUnits: readonly Unit[]
): readonly Unit[] {
  const isPlayerUnit = playerUnits.some(u => u.id === caster.id);
  const canTargetKO = Boolean(ability.revivesFallen || ability.revive);

  switch (ability.targets) {
    case 'single-enemy':
      return isPlayerUnit
        ? enemyUnits.filter(u => canTargetKO || !isUnitKO(u))
        : playerUnits.filter(u => canTargetKO || !isUnitKO(u));

    case 'all-enemies':
      return isPlayerUnit
        ? enemyUnits.filter(u => canTargetKO || !isUnitKO(u))
        : playerUnits.filter(u => canTargetKO || !isUnitKO(u));

    case 'single-ally':
      return isPlayerUnit
        ? playerUnits.filter(u => canTargetKO || !isUnitKO(u))
        : enemyUnits.filter(u => canTargetKO || !isUnitKO(u));

    case 'all-allies':
      return isPlayerUnit
        ? playerUnits.filter(u => canTargetKO || !isUnitKO(u))
        : enemyUnits.filter(u => canTargetKO || !isUnitKO(u));

    case 'self':
      return [caster];

    default:
      return [];
  }
}

/**
 * Filter targets by validity (e.g., healing only works on alive units)
 */
export function filterValidTargets(
  targets: readonly Unit[],
  ability: Ability
): readonly Unit[] {
  const canTargetKO = Boolean(ability.revivesFallen || ability.revive);

  if (ability.type === 'healing' && !canTargetKO) {
    // Healing only works on alive units (unless it revives)
    return targets.filter(u => !isUnitKO(u));
  }

  // If it's not a revival ability, it generally shouldn't target KO'd units
  if (!canTargetKO) {
    return targets.filter(u => !isUnitKO(u));
  }

  // Other abilities can target KO'd units (for revival)
  return targets;
}

/**
 * Get valid targets for UI selection
 * Simplified version for UI components that need to show selectable targets
 * @param ability - Ability (null for basic attack)
 * @param caster - Unit casting the ability
 * @param playerTeam - Player team
 * @param enemies - Enemy units
 * @returns Array of valid target units for selection
 */
export function getValidTargets(
  ability: Ability | null,
  caster: Unit,
  playerTeam: { units: readonly Unit[] },
  enemies: readonly Unit[]
): readonly Unit[] {
  const isPlayerUnit = playerTeam.units.some(u => u.id === caster.id);
  const allies = isPlayerUnit ? playerTeam.units : enemies;
  const foes = isPlayerUnit ? enemies : playerTeam.units;

  if (!ability) {
    // Basic attack targets foes
    return foes.filter(u => !isUnitKO(u));
  }

  const canTargetKO = Boolean(ability.revivesFallen || ability.revive);

  switch (ability.targets) {
    case 'single-enemy':
    case 'all-enemies':
      return foes.filter(u => canTargetKO || !isUnitKO(u));
    case 'single-ally':
    case 'all-allies':
      return allies.filter(u => canTargetKO || !isUnitKO(u));
    case 'self':
      return [caster];
    default:
      return [];
  }
}

