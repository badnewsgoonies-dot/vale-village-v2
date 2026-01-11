"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAllGameData = validateAllGameData;
/**
 * Validates all game data at startup
 * Should be called before game starts
 */
const AbilitySchema_1 = require("../../data/schemas/AbilitySchema");
const EquipmentSchema_1 = require("../../data/schemas/EquipmentSchema");
const UnitSchema_1 = require("../../data/schemas/UnitSchema");
const EnemySchema_1 = require("../../data/schemas/EnemySchema");
const ShopSchema_1 = require("../../data/schemas/ShopSchema");
const StarterKitSchema_1 = require("../../data/schemas/StarterKitSchema");
const StoryFlagsSchema_1 = require("../../data/schemas/StoryFlagsSchema");
const RecruitmentDataSchema_1 = require("../../data/schemas/RecruitmentDataSchema");
const abilities_1 = require("../../data/definitions/abilities");
const equipment_1 = require("../../data/definitions/equipment");
const units_1 = require("../../data/definitions/units");
const enemies_1 = require("../../data/definitions/enemies");
const shops_1 = require("../../data/definitions/shops");
const starterKits_1 = require("../../data/definitions/starterKits");
const storyFlags_1 = require("../../data/definitions/storyFlags");
const recruitmentData_1 = require("../../data/definitions/recruitmentData");
const balanceValidation_1 = require("./balanceValidation");
function validateAllGameData() {
    const errors = [];
    // Validate abilities
    Object.entries(abilities_1.ABILITIES).forEach(([id, ability]) => {
        const result = AbilitySchema_1.AbilitySchema.safeParse(ability);
        if (!result.success) {
            const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            errors.push(`Ability ${id}: ${errorMessages}`);
        }
    });
    // Validate equipment
    Object.entries(equipment_1.EQUIPMENT).forEach(([id, equipment]) => {
        const result = EquipmentSchema_1.EquipmentSchema.safeParse(equipment);
        if (!result.success) {
            const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            errors.push(`Equipment ${id}: ${errorMessages}`);
        }
    });
    // Validate unit definitions
    Object.entries(units_1.UNIT_DEFINITIONS).forEach(([id, unit]) => {
        const result = UnitSchema_1.UnitDefinitionSchema.safeParse(unit);
        if (!result.success) {
            const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            errors.push(`Unit ${id}: ${errorMessages}`);
        }
    });
    // Validate enemies
    Object.entries(enemies_1.ENEMIES).forEach(([id, enemy]) => {
        const result = EnemySchema_1.EnemySchema.safeParse(enemy);
        if (!result.success) {
            const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            errors.push(`Enemy ${id}: ${errorMessages}`);
        }
    });
    // Validate shops
    Object.entries(shops_1.SHOPS).forEach(([id, shop]) => {
        // Note: ShopSchema doesn't validate unlockCondition functions
        const shopData = { ...shop };
        delete shopData.unlockCondition; // Remove function for validation
        const result = ShopSchema_1.ShopSchema.safeParse(shopData);
        if (!result.success) {
            const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            errors.push(`Shop ${id}: ${errorMessages}`);
        }
    });
    // Validate starter kits
    Object.entries(starterKits_1.STARTER_KITS).forEach(([element, kit]) => {
        const result = StarterKitSchema_1.StarterKitSchema.safeParse(kit);
        if (!result.success) {
            const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            errors.push(`Starter Kit ${element}: ${errorMessages}`);
        }
    });
    // Validate story flag mappings
    const storyFlagUnitResult = StoryFlagsSchema_1.StoryFlagToUnitSchema.safeParse(storyFlags_1.STORY_FLAG_TO_UNIT);
    if (!storyFlagUnitResult.success) {
        const errorMessages = storyFlagUnitResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        errors.push(`Story Flag to Unit mapping: ${errorMessages}`);
    }
    const storyFlagDjinnResult = StoryFlagsSchema_1.StoryFlagToDjinnSchema.safeParse(storyFlags_1.STORY_FLAG_TO_DJINN);
    if (!storyFlagDjinnResult.success) {
        const errorMessages = storyFlagDjinnResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        errors.push(`Story Flag to Djinn mapping: ${errorMessages}`);
    }
    // Validate encounter to recruitment dialogue mapping
    const encounterRecruitResult = RecruitmentDataSchema_1.EncounterToRecruitmentDialogueSchema.safeParse(recruitmentData_1.ENCOUNTER_TO_RECRUITMENT_DIALOGUE);
    if (!encounterRecruitResult.success) {
        const errorMessages = encounterRecruitResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        errors.push(`Encounter to Recruitment Dialogue mapping: ${errorMessages}`);
    }
    // Cross-reference checks
    // Check ability unlock levels (1-20)
    Object.entries(abilities_1.ABILITIES).forEach(([id, ability]) => {
        if (ability.unlockLevel < 1 || ability.unlockLevel > 20) {
            errors.push(`Ability ${id}: unlockLevel out of range (1..20)`);
        }
    });
    // Check unit abilities exist
    Object.entries(units_1.UNIT_DEFINITIONS).forEach(([id, unit]) => {
        for (const ability of unit.abilities) {
            if (!abilities_1.ABILITIES[ability.id]) {
                errors.push(`Unit ${id}: unknown ability id "${ability.id}"`);
            }
        }
    });
    // Check enemy abilities exist
    Object.entries(enemies_1.ENEMIES).forEach(([id, enemy]) => {
        for (const ability of enemy.abilities) {
            if (!abilities_1.ABILITIES[ability.id]) {
                errors.push(`Enemy ${id}: unknown ability id "${ability.id}"`);
            }
        }
        // Check enemy drop equipment is valid
        if (enemy.drops) {
            for (const d of enemy.drops) {
                const r = EquipmentSchema_1.EquipmentSchema.safeParse(d.equipment);
                if (!r.success) {
                    const errorMessages = r.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                    errors.push(`Enemy ${id}: invalid drop equipment: ${errorMessages}`);
                }
            }
        }
    });
    // Check equipment unlocksAbility references exist
    Object.entries(equipment_1.EQUIPMENT).forEach(([id, equipment]) => {
        if (equipment.unlocksAbility) {
            if (!abilities_1.ABILITIES[equipment.unlocksAbility]) {
                errors.push(`Equipment ${id}: unlocksAbility "${equipment.unlocksAbility}" does not exist in ABILITIES`);
            }
        }
    });
    if (errors.length > 0) {
        throw new Error(`Data validation failed:\n${errors.join('\n')}`);
    }
    // Use console.warn instead of console.log (allowed in validation)
    // [REMOVED] console.warn('✅ All game data validated successfully');
    // Validate content balance (warnings, not errors)
    const balanceWarnings = (0, balanceValidation_1.validateContentBalance)({
        enemies: enemies_1.ENEMIES,
        abilities: abilities_1.ABILITIES,
        equipment: equipment_1.EQUIPMENT,
    });
    if (balanceWarnings.length > 0) {
        // [REMOVED] console.warn('⚠️  Balance warnings detected:');
        // [REMOVED] console.warn(formatBalanceWarnings(balanceWarnings));
    }
    else {
        // [REMOVED] console.warn('✅ No balance issues detected');
    }
}
