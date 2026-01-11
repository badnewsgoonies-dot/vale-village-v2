import { z } from "zod";
const ShopSchema = z.object({
  id: z.string().min(1).regex(/^[a-z-]+$/, "Shop ID must be kebab-case"),
  name: z.string().min(1),
  availableItems: z.array(z.string().min(1))
  // Note: unlockCondition is a function and cannot be validated by Zod
  // It will be preserved during runtime but not validated
});
const ShopsSchema = z.record(z.string(), ShopSchema);
export {
  ShopSchema,
  ShopsSchema
};
//# sourceMappingURL=ShopSchema-CQIYv1Xx.js.map
