import { EntityBlueprint } from './content';

export class ContentValidator {
  /**
   * Simulates a standard combat encounter to ensure the entity is "solvable".
   * Returns TRUE if the entity is balanced, FALSE if it is cruft.
   */
  public static isEntityBalanced(entity: EntityBlueprint): boolean {
    // 1. Define the "Standard Player" for calibration
    const playerStats = {
      hp: 100,
      damage: 10
    };

    // 2. Prevent "Immortal" entities
    // An entity with 0 HP or excessively high defense is a bug.
    if (entity.stats.maxHp <= 0) return false;

    // 3. The Simulation: "Turns to Kill" (TTK)
    // How many hits does it take for the player to win?
    const playerHitsToWin = Math.ceil(entity.stats.maxHp / playerStats.damage);

    // How many hits does it take for the entity to kill the player?
    // Avoid division by zero if entity has 0 attack (passive mobs)
    const damage = Math.max(1, entity.stats.attack); 
    const entityHitsToWin = Math.ceil(playerStats.hp / damage);

    // 4. Causal Gating Rules
    
    // Rule A: The "Sponge" Check
    // If it takes > 20 hits to kill a basic mob, it's boring content.
    if (playerHitsToWin > 20) {
      console.warn(`[Validator] Entity ${entity.id} is a bullet sponge (TTK: ${playerHitsToWin}).`);
      return false;
    }

    // Rule B: The "Insta-Kill" Check
    // If the entity kills the player in 1 hit, it's unfair (unless it's a boss, flagged separately).
    if (entityHitsToWin <= 1) {
      console.warn(`[Validator] Entity ${entity.id} is unfair (OHKO).`);
      return false;
    }

    return true;
  }
}
