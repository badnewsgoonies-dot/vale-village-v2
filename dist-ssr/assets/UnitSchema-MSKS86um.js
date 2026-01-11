import { z } from "zod";
import { C as ContentAvailabilitySchema, a as EquipmentLoadoutSchema } from "./EquipmentSchema-P6m_X9MN.js";
const StatsSchema = z.object({
  hp: z.number().int().min(0),
  pp: z.number().int().min(0),
  atk: z.number().int().min(0),
  def: z.number().int().min(0),
  mag: z.number().int().min(0),
  spd: z.number().int().min(0)
});
const abilityIdRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AbilitySchema = z.object({
  id: z.string().regex(abilityIdRegex, {
    message: "Ability ID must be kebab-case (lowercase alphanumerics and hyphens only)"
  }),
  name: z.string().min(1),
  type: z.enum(["physical", "psynergy", "healing", "buff", "debuff", "summon"]),
  element: z.enum(["Venus", "Mars", "Jupiter", "Mercury", "Neutral"]).optional(),
  manaCost: z.number().int().min(0).max(5),
  // Cannot be negative! Max 5 for mana pool system
  basePower: z.number().int().min(0),
  // Cannot be negative!
  targets: z.enum(["single-enemy", "all-enemies", "single-ally", "all-allies", "self"]),
  unlockLevel: z.number().int().min(1).max(20),
  kind: z.enum(["attack", "psynergy"]).optional(),
  description: z.string(),
  // Optional properties
  chainDamage: z.boolean().optional(),
  revivesFallen: z.boolean().optional(),
  buffEffect: z.object({
    atk: z.number().optional(),
    def: z.number().optional(),
    mag: z.number().optional(),
    spd: z.number().optional(),
    hp: z.number().optional()
    // Max HP increase
  }).optional(),
  duration: z.number().int().min(1).optional(),
  // Status effect applied on hit (for physical/psynergy abilities)
  statusEffect: z.object({
    type: z.enum(["poison", "burn", "freeze", "paralyze", "stun"]),
    duration: z.number().int().min(1),
    chance: z.number().min(0).max(1).optional()
    // Probability of applying (0-1), defaults to 1.0
  }).optional(),
  // Debuff effects (stat reductions applied to targets)
  debuffEffect: z.object({
    atk: z.number().optional(),
    def: z.number().optional(),
    mag: z.number().optional(),
    spd: z.number().optional(),
    hp: z.number().optional()
    // Max HP reduction
  }).optional(),
  // Heal over time effect
  healOverTime: z.object({
    amount: z.number().int().min(1),
    // HP restored per turn
    duration: z.number().int().min(1)
    // Number of turns
  }).optional(),
  // Multi-hit attacks
  hitCount: z.number().int().min(1).max(10).optional(),
  // Number of hits (2-4 typical)
  // Revive mechanics
  revive: z.boolean().optional(),
  // Can revive KO'd units
  reviveHPPercent: z.number().min(0).max(1).optional(),
  // HP% restored when reviving (0-1)
  // Phase 2: Advanced offense mechanics
  ignoreDefensePercent: z.number().min(0).max(1).optional(),
  // % of target DEF to ignore (default 0)
  splashDamagePercent: z.number().min(0).max(1).optional(),
  // % damage dealt to non-primary targets (default 0)
  // Phase 2: Shield granting
  shieldCharges: z.number().int().min(1).max(99).optional(),
  // Number of hit charges granted when cast
  // Phase 2: Status cleanse
  removeStatusEffects: z.union([
    z.object({ type: z.literal("all") }),
    z.object({ type: z.literal("negative") }),
    z.object({
      type: z.literal("byType"),
      statuses: z.array(z.enum(["poison", "burn", "freeze", "paralyze", "stun", "debuff"]))
    })
  ]).optional(),
  // Phase 2: Damage reduction granting
  damageReductionPercent: z.number().min(0).max(1).optional(),
  // % damage reduction granted to target(s)
  // Phase 2: Immunity granting
  grantImmunity: z.object({
    all: z.boolean(),
    // If true, immune to all negative statuses
    types: z.array(z.enum(["poison", "burn", "freeze", "paralyze", "stun", "debuff"])).optional(),
    // Specific immunities
    duration: z.number().int().min(1)
    // Duration in turns
  }).optional(),
  // AI hints (optional metadata for AI decision-making)
  aiHints: z.object({
    priority: z.number().min(0).max(3).optional(),
    target: z.enum(["weakest", "random", "lowestRes", "healerFirst", "highestDef"]).optional(),
    avoidOverkill: z.boolean().optional(),
    opener: z.boolean().optional()
  }).optional()
});
const ElementSchema = z.enum(["Venus", "Mars", "Mercury", "Jupiter", "Neutral"]);
const UnitRoleSchema = z.enum([
  "Balanced Warrior",
  "Pure DPS",
  "Elemental Mage",
  "Healer",
  "Rogue Assassin",
  "AoE Fire Mage",
  "Support Buffer",
  "Defensive Tank",
  "Versatile Scholar",
  "Master Warrior"
]);
const DjinnStateSchema = z.enum(["Set", "Standby", "Recovery"]);
const StatKeySchema = z.enum(["hp", "pp", "atk", "def", "mag", "spd"]);
const StatusEffectSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("buff"),
    stat: StatKeySchema,
    modifier: z.number().positive(),
    duration: z.number().int().positive()
  }),
  z.object({
    type: z.literal("debuff"),
    stat: StatKeySchema,
    modifier: z.number().negative(),
    duration: z.number().int().positive()
  }),
  z.object({
    type: z.enum(["poison", "burn"]),
    damagePerTurn: z.number().int().positive(),
    duration: z.number().int().positive()
  }),
  z.object({
    type: z.enum(["freeze", "paralyze", "stun"]),
    duration: z.number().int().positive()
  }),
  z.object({
    type: z.literal("healOverTime"),
    healPerTurn: z.number().int().positive(),
    duration: z.number().int().positive()
  }),
  // Phase 2: Global damage reduction
  z.object({
    type: z.literal("damageReduction"),
    percent: z.number().min(0).max(1),
    // 0-1, e.g. 0.3 = 30% reduction
    duration: z.number().int().positive()
  }),
  // Phase 2: Hit-based shield
  z.object({
    type: z.literal("shield"),
    remainingCharges: z.number().int().min(0),
    // Consumed per hit
    duration: z.number().int().positive()
  }),
  // Phase 2: Invulnerability (blocks damage only, NOT statuses)
  z.object({
    type: z.literal("invulnerable"),
    duration: z.number().int().positive()
  }),
  // Phase 2: Status immunity
  z.object({
    type: z.literal("immunity"),
    all: z.boolean(),
    // If true, immune to all negative statuses
    types: z.array(z.enum(["poison", "burn", "freeze", "paralyze", "stun", "debuff"])).optional(),
    // Specific immunities
    duration: z.number().int().positive()
  }),
  // Phase 2: Auto-revive (uses-based, not time-based)
  z.object({
    type: z.literal("autoRevive"),
    hpPercent: z.number().min(0).max(1),
    // HP% restored when triggered
    usesRemaining: z.number().int().min(1)
    // Usually 1
  })
]);
const UnitDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  element: ElementSchema,
  role: UnitRoleSchema,
  baseStats: StatsSchema,
  growthRates: StatsSchema,
  abilities: z.array(AbilitySchema),
  manaContribution: z.number().int().min(0),
  description: z.string(),
  autoAttackTiming: z.enum(["same-turn", "next-turn"]).optional(),
  availableIn: ContentAvailabilitySchema.optional().readonly()
});
const UnitSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  element: ElementSchema,
  role: UnitRoleSchema,
  baseStats: StatsSchema,
  growthRates: StatsSchema,
  description: z.string(),
  manaContribution: z.number().int().min(0),
  level: z.number().int().min(1).max(20),
  xp: z.number().int().min(0),
  currentHp: z.number().int().min(0),
  autoAttackTiming: z.enum(["same-turn", "next-turn"]).optional(),
  equipment: EquipmentLoadoutSchema,
  storeUnlocked: z.boolean(),
  djinn: z.array(z.string().min(1)),
  djinnStates: z.record(z.string(), DjinnStateSchema),
  abilities: z.array(AbilitySchema),
  unlockedAbilityIds: z.array(z.string().min(1)),
  statusEffects: z.array(StatusEffectSchema),
  actionsTaken: z.number().int().min(0),
  battleStats: z.object({
    damageDealt: z.number().int().min(0),
    damageTaken: z.number().int().min(0)
  })
}).superRefine((u, ctx) => {
  const maxHp = u.baseStats.hp + (u.level - 1) * u.growthRates.hp;
  if (u.currentHp > maxHp) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `currentHp (${u.currentHp}) exceeds maxHp (${maxHp})`,
      path: ["currentHp"]
    });
  }
});
const UnitSchema$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DjinnStateSchema,
  ElementSchema,
  StatusEffectSchema,
  UnitDefinitionSchema,
  UnitRoleSchema,
  UnitSchema
}, Symbol.toStringTag, { value: "Module" }));
export {
  AbilitySchema as A,
  ElementSchema as E,
  StatsSchema as S,
  UnitSchema$1 as U
};
//# sourceMappingURL=UnitSchema-MSKS86um.js.map
