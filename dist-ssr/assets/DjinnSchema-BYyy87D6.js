import { z } from "zod";
import { E as ElementSchema } from "./UnitSchema-MSKS86um.js";
import { C as ContentAvailabilitySchema } from "./EquipmentSchema-P6m_X9MN.js";
const DjinnSummonEffectSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("damage"),
    description: z.string(),
    damage: z.number().int().min(0)
  }),
  z.object({
    type: z.literal("heal"),
    description: z.string(),
    healAmount: z.number().int().min(0)
  }),
  z.object({
    type: z.literal("buff"),
    description: z.string(),
    statBonus: z.object({
      atk: z.number().optional(),
      def: z.number().optional(),
      mag: z.number().optional(),
      spd: z.number().optional()
    })
  }),
  z.object({
    type: z.literal("special"),
    description: z.string()
  })
]);
const DjinnGrantedAbilitiesSchema = z.object({
  same: z.array(z.string()).min(0).max(6),
  counter: z.array(z.string()).min(0).max(6),
  neutral: z.array(z.string()).min(0).max(6)
});
const DjinnSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  element: ElementSchema,
  tier: z.enum(["1", "2", "3"]),
  summonEffect: DjinnSummonEffectSchema,
  grantedAbilities: z.record(z.string().min(1), DjinnGrantedAbilitiesSchema),
  availableIn: ContentAvailabilitySchema.optional().readonly()
});
export {
  DjinnGrantedAbilitiesSchema,
  DjinnSchema,
  DjinnSummonEffectSchema
};
//# sourceMappingURL=DjinnSchema-BYyy87D6.js.map
