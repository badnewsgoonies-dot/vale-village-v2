import { z } from "zod";
function validateRecord(record, schema, category) {
  const errors = [];
  for (const [id, item] of Object.entries(record)) {
    const result = schema.safeParse(item);
    if (!result.success) {
      errors.push({
        category,
        id,
        errors: result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`)
      });
    }
  }
  return errors;
}
function validateCrossReferences(EQUIPMENT, ABILITIES, ENCOUNTERS, ENEMIES, DJINN, UNIT_DEFINITIONS, SHOPS) {
  const errors = [];
  for (const [id, equipment] of Object.entries(EQUIPMENT)) {
    const equip = equipment;
    if (equip.unlocksAbility && !ABILITIES[equip.unlocksAbility]) {
      errors.push({
        category: "Equipment",
        id,
        errors: [`unlocksAbility '${equip.unlocksAbility}' does not exist in ABILITIES`]
      });
    }
  }
  for (const [id, encounter] of Object.entries(ENCOUNTERS)) {
    const enc = encounter;
    for (const enemyId of enc.enemies || []) {
      if (!ENEMIES[enemyId]) {
        errors.push({
          category: "Encounter",
          id,
          errors: [`enemy '${enemyId}' does not exist in ENEMIES`]
        });
      }
    }
    if (enc.reward && enc.reward.djinn && !DJINN[enc.reward.djinn]) {
      errors.push({
        category: "Encounter",
        id,
        errors: [`reward.djinn '${enc.reward.djinn}' does not exist in DJINN`]
      });
    }
    if (enc.reward && enc.reward.unlockUnit && !UNIT_DEFINITIONS[enc.reward.unlockUnit]) {
      errors.push({
        category: "Encounter",
        id,
        errors: [`reward.unlockUnit '${enc.reward.unlockUnit}' does not exist in UNIT_DEFINITIONS`]
      });
    }
    if (enc.reward && enc.reward.equipment) {
      if (enc.reward.equipment.type === "fixed" && enc.reward.equipment.itemId) {
        if (!EQUIPMENT[enc.reward.equipment.itemId]) {
          errors.push({
            category: "Encounter",
            id,
            errors: [`reward.equipment.itemId '${enc.reward.equipment.itemId}' does not exist in EQUIPMENT`]
          });
        }
      }
      if (enc.reward.equipment.type === "choice" && enc.reward.equipment.options) {
        for (const optionId of enc.reward.equipment.options) {
          if (!EQUIPMENT[optionId]) {
            errors.push({
              category: "Encounter",
              id,
              errors: [`reward.equipment.options '${optionId}' does not exist in EQUIPMENT`]
            });
          }
        }
      }
    }
  }
  for (const [id, shop] of Object.entries(SHOPS)) {
    for (const itemId of shop.availableItems || []) {
      if (!EQUIPMENT[itemId]) {
        errors.push({
          category: "Shop",
          id,
          errors: [`availableItems '${itemId}' does not exist in EQUIPMENT`]
        });
      }
    }
  }
  return errors;
}
async function validateGameData() {
  try {
    const [
      djinnSchemaMod,
      unitSchemaMod,
      equipSchemaMod,
      enemySchemaMod,
      encounterSchemaMod,
      shopSchemaMod
    ] = await Promise.all([
      import("./assets/DjinnSchema-BYyy87D6.js").catch(() => ({ DjinnSchema: z.any() })),
      import("./assets/UnitSchema-MSKS86um.js").then((n) => n.U).catch(() => ({ UnitDefinitionSchema: z.any() })),
      import("./assets/EquipmentSchema-P6m_X9MN.js").then((n) => n.b).catch(() => ({ EquipmentSchema: z.any() })),
      import("./assets/EnemySchema-D7ZL6rKx.js").catch(() => ({ EnemySchema: z.any() })),
      import("./assets/EncounterSchema-CIz_O1Mr.js").catch(() => ({ EncounterSchema: z.any() })),
      import("./assets/ShopSchema-CQIYv1Xx.js").catch(() => ({ ShopSchema: z.any() }))
    ]);
    const [
      djinnDataMod,
      unitDataMod,
      equipDataMod,
      enemiesDataMod,
      encountersDataMod,
      shopsDataMod,
      abilitiesDataMod
    ] = await Promise.all([
      import("./assets/djinn-BxbCxXWu.js").catch(() => ({ DJINN: {} })),
      import("./assets/units-B-zlKtRH.js").catch(() => ({ UNIT_DEFINITIONS: {} })),
      import("./assets/equipment-D9T235xI.js").catch(() => ({ EQUIPMENT: {} })),
      import("./assets/enemies-D_IcxC13.js").catch(() => ({ ENEMIES: {} })),
      import("./assets/encounters-QRabhYcU.js").catch(() => ({ ENCOUNTERS: {} })),
      import("./assets/shops-BzApFC31.js").catch(() => ({ SHOPS: {} })),
      import("./assets/abilities-BqKwRqMm.js").catch(() => ({ ABILITIES: {} }))
    ]);
    const DjinnSchema = djinnSchemaMod.DjinnSchema ?? z.any();
    const UnitDefinitionSchema = unitSchemaMod.UnitDefinitionSchema ?? z.any();
    const EquipmentSchema = equipSchemaMod.EquipmentSchema ?? z.any();
    const EnemySchema = enemySchemaMod.EnemySchema ?? z.any();
    const EncounterSchema = encounterSchemaMod.EncounterSchema ?? z.any();
    const ShopSchema = shopSchemaMod.ShopSchema ?? z.any();
    const DJINN = djinnDataMod.DJINN ?? {};
    const UNIT_DEFINITIONS = unitDataMod.UNIT_DEFINITIONS ?? {};
    const EQUIPMENT = equipDataMod.EQUIPMENT ?? {};
    const ENEMIES = enemiesDataMod.ENEMIES ?? {};
    const ENCOUNTERS = encountersDataMod.ENCOUNTERS ?? {};
    const SHOPS = shopsDataMod.SHOPS ?? {};
    const ABILITIES = abilitiesDataMod.ABILITIES ?? {};
    const errors = [];
    const warnings = [];
    errors.push(...validateRecord(DJINN, DjinnSchema, "Djinn"));
    errors.push(...validateRecord(UNIT_DEFINITIONS, UnitDefinitionSchema, "Units"));
    errors.push(...validateRecord(EQUIPMENT, EquipmentSchema, "Equipment"));
    errors.push(...validateRecord(ENEMIES, EnemySchema, "Enemies"));
    errors.push(...validateRecord(ENCOUNTERS, EncounterSchema, "Encounters"));
    errors.push(...validateRecord(SHOPS, ShopSchema, "Shops"));
    errors.push(...validateCrossReferences(EQUIPMENT, ABILITIES, ENCOUNTERS, ENEMIES, DJINN, UNIT_DEFINITIONS, SHOPS));
    if (Object.keys(DJINN).length === 0) {
      warnings.push("No Djinn defined");
    }
    if (Object.keys(UNIT_DEFINITIONS).length === 0) {
      warnings.push("No Units defined");
    }
    if (Object.keys(ENEMIES).length === 0) {
      warnings.push("No Enemies defined");
    }
    if (Object.keys(ENCOUNTERS).length === 0) {
      warnings.push("No Encounters defined");
    }
    if (Object.keys(SHOPS).length === 0) {
      warnings.push("No Shops defined");
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  } catch (exception) {
    return {
      valid: false,
      errors: [
        {
          category: "ValidationException",
          id: "validateGameData",
          errors: [
            exception instanceof Error ? `${exception.message}${exception.stack ? "\n" + exception.stack : ""}` : `Unknown error during validation: ${String(exception)}`
          ]
        }
      ],
      warnings: []
    };
  }
}
function formatValidationResult(result) {
  if (result.valid && result.warnings.length === 0) {
    return "All game data validated successfully.";
  }
  const lines = [];
  if (!result.valid) {
    lines.push("DATA VALIDATION FAILED:");
    lines.push("");
    for (const error of result.errors) {
      lines.push(`[${error.category}] ${error.id}:`);
      for (const msg of error.errors) {
        lines.push(`  - ${msg}`);
      }
    }
  }
  if (result.warnings.length > 0) {
    if (lines.length > 0) lines.push("");
    lines.push("Warnings:");
    for (const warning of result.warnings) {
      lines.push(`  - ${warning}`);
    }
  }
  return lines.join("\n");
}
export {
  formatValidationResult,
  validateGameData
};
//# sourceMappingURL=validateData.js.map
