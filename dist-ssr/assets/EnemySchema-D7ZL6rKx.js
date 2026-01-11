import { z } from "zod";
import { E as ElementSchema, S as StatsSchema, A as AbilitySchema } from "./UnitSchema-MSKS86um.js";
import { E as EquipmentSchema } from "./EquipmentSchema-P6m_X9MN.js";
const EquipmentDropSchema = z.object({
  equipment: EquipmentSchema,
  chance: z.number().min(0).max(1)
  // 0.0 to 1.0 (0% to 100%)
});
const PhaseConfigSchema = z.object({
  // HP threshold (0.0-1.0) below which this phase activates
  threshold: z.number().min(0).max(1),
  // Ability IDs that become prioritized in this phase (subset of main abilities)
  priorityAbilities: z.array(z.string()).min(1),
  // Optional stat multiplier applied during this phase
  statMultiplier: z.object({
    atk: z.number().optional(),
    def: z.number().optional(),
    mag: z.number().optional(),
    spd: z.number().optional()
  }).optional()
});
const EnemySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  level: z.number().int().min(1).max(20),
  // Levels 1-20
  stats: StatsSchema,
  abilities: z.array(AbilitySchema).min(1),
  // At least 1 ability
  element: ElementSchema,
  baseXp: z.number().int().min(0),
  baseGold: z.number().int().min(0),
  drops: z.array(EquipmentDropSchema).optional(),
  // Phase configuration for bosses - sorted by threshold ascending
  phases: z.array(PhaseConfigSchema).optional()
});
export {
  EnemySchema,
  EquipmentDropSchema,
  PhaseConfigSchema
};
//# sourceMappingURL=EnemySchema-D7ZL6rKx.js.map
