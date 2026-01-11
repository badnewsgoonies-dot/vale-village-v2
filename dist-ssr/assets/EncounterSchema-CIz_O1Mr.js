import { z } from "zod";
const EncounterRulesSchema = z.object({
  phaseChange: z.object({
    hpPct: z.number().min(0).max(1),
    // HP percentage threshold (0.0 to 1.0)
    addAbility: z.string().min(1)
    // Ability ID to add at phase change
  }).optional()
});
const equipmentOptionsUnique = (options) => new Set(options).size === options.length;
const EquipmentRewardSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("none")
  }),
  z.object({
    type: z.literal("fixed"),
    itemId: z.string().min(1)
  }),
  z.object({
    type: z.literal("choice"),
    options: z.array(z.string().min(1)).min(2).max(4).refine(equipmentOptionsUnique, {
      message: "Choice options must be unique"
    })
  })
]);
const EncounterRewardsSchema = z.object({
  xp: z.number().int().min(0),
  gold: z.number().int().min(0),
  equipment: EquipmentRewardSchema,
  djinn: z.string().min(1).optional(),
  // Djinn ID to award
  unlockUnit: z.string().min(1).optional(),
  unlockAbility: z.string().min(1).optional()
  // Future: apply unlocks in RewardsService/Store
});
const EncounterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  enemies: z.array(z.string().min(1)).min(1),
  difficulty: z.enum(["easy", "medium", "hard", "boss"]).optional(),
  rules: EncounterRulesSchema.optional(),
  reward: EncounterRewardsSchema,
  /** NPC sprite ID to use for the first enemy (leader) in battle */
  leaderSpriteId: z.string().min(1).optional(),
  /** Background ID for battle scene (e.g., 'gs1/Vale', 'gs2/Mars_Lighthouse') */
  backgroundId: z.string().min(1).optional()
});
export {
  EncounterRewardsSchema,
  EncounterRulesSchema,
  EncounterSchema,
  EquipmentRewardSchema
};
//# sourceMappingURL=EncounterSchema-CIz_O1Mr.js.map
