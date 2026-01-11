import { z } from 'zod';
import { StatsSchema } from './StatsSchema';
import { ElementSchema } from './UnitSchema';
import { AbilitySchema } from './AbilitySchema';
import { EquipmentSchema } from './EquipmentSchema';

/**
 * Zod schema for Equipment drop
 */
export const EquipmentDropSchema = z.object({
  equipment: EquipmentSchema,
  chance: z.number().min(0).max(1), // 0.0 to 1.0 (0% to 100%)
});

/**
 * Phase configuration for bosses with HP-triggered behavior changes
 * Example: Phoenix enters "rebirth mode" at 50% HP, prioritizing healing
 */
export const PhaseConfigSchema = z.object({
  // HP threshold (0.0-1.0) below which this phase activates
  threshold: z.number().min(0).max(1),
  // Ability IDs that become prioritized in this phase (subset of main abilities)
  priorityAbilities: z.array(z.string()).min(1),
  // Optional stat multiplier applied during this phase
  statMultiplier: z.object({
    atk: z.number().optional(),
    def: z.number().optional(),
    mag: z.number().optional(),
    spd: z.number().optional(),
  }).optional(),
});

export type PhaseConfig = z.infer<typeof PhaseConfigSchema>;

/**
 * Zod schema for Enemy
 * Enemies are similar to Units but simpler:
 * - No equipment or Djinn
 * - Fixed stats (no growth rates)
 * - Reward data for XP and Gold
 * - Optional equipment drops with chances
 * - Optional phase configuration for bosses with HP-triggered behavior
 */
export const EnemySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  level: z.number().int().min(1).max(20),  // Levels 1-20
  stats: StatsSchema,
  abilities: z.array(AbilitySchema).min(1),  // At least 1 ability
  element: ElementSchema,
  baseXp: z.number().int().min(0),
  baseGold: z.number().int().min(0),
  drops: z.array(EquipmentDropSchema).optional(),
  // Phase configuration for bosses - sorted by threshold ascending
  phases: z.array(PhaseConfigSchema).optional(),
});

export type Enemy = z.infer<typeof EnemySchema>;
export type EquipmentDrop = z.infer<typeof EquipmentDropSchema>;

