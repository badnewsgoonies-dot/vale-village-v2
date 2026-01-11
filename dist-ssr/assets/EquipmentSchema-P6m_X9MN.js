import { z } from "zod";
const ContentAvailabilitySchema = z.array(z.enum(["campaign", "tower"])).min(1);
const ElementSchema = z.enum(["Venus", "Mars", "Mercury", "Jupiter", "Neutral"]);
const EquipmentStatBonusSchema = z.object({
  hp: z.number().int(),
  pp: z.number().int(),
  atk: z.number().int(),
  def: z.number().int(),
  mag: z.number().int(),
  spd: z.number().int()
}).partial();
const EquipmentSlotSchema = z.enum(["weapon", "armor", "helm", "boots", "accessory"]);
const EquipmentTierSchema = z.enum([
  "basic",
  "bronze",
  "iron",
  "steel",
  "silver",
  "mythril",
  "legendary",
  "artifact"
]);
const EquipmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slot: EquipmentSlotSchema,
  tier: EquipmentTierSchema,
  cost: z.number().int().min(0),
  statBonus: EquipmentStatBonusSchema.default({}),
  // Default to empty object if missing
  allowedElements: z.array(ElementSchema).min(1).readonly(),
  // CHANGED: Make readonly for compatibility with Equipment type
  unlocksAbility: z.string().optional(),
  equipmentUnlocksPermanent: z.boolean().optional(),
  alwaysFirstTurn: z.boolean().optional(),
  availableIn: ContentAvailabilitySchema.optional().readonly()
});
const EquipmentLoadoutSchema = z.object({
  weapon: EquipmentSchema.nullable(),
  armor: EquipmentSchema.nullable(),
  helm: EquipmentSchema.nullable(),
  boots: EquipmentSchema.nullable(),
  accessory: EquipmentSchema.nullable()
});
const EquipmentSchema$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EquipmentLoadoutSchema,
  EquipmentSchema,
  EquipmentSlotSchema,
  EquipmentStatBonusSchema,
  EquipmentTierSchema
}, Symbol.toStringTag, { value: "Module" }));
export {
  ContentAvailabilitySchema as C,
  EquipmentSchema as E,
  EquipmentLoadoutSchema as a,
  EquipmentSchema$1 as b
};
//# sourceMappingURL=EquipmentSchema-P6m_X9MN.js.map
