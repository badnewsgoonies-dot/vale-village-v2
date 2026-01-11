# Missing IDs / Zod Validation Diagnostic Report

This report maps validation error categories emitted by src/data/validateData.ts to the source definition files to inspect and lists candidate files likely requiring fixes.

## How to read validation output
- validateData.formatValidationResult prints entries like:
  [<Category>] <id>:
    - <message>
  where `Category` is the collection validated (e.g., "Encounter", "Equipment") and `id` is the definition key in that collection.
- Schema validation errors come from validateRecord(schema.safeParse) and are per-item (category + id).
- Cross-reference errors come from validateCrossReferences and report missing referenced IDs (e.g. `enemy 'foo' does not exist in ENEMIES`).

## Category → definition file mapping
- Djinn -> src/data/definitions/djinn.ts (DJINN)
- Units -> src/data/definitions/units.ts (UNIT_DEFINITIONS)
- Equipment -> src/data/definitions/equipment.ts (EQUIPMENT)
- Enemies -> src/data/definitions/enemies.ts (ENEMIES)
- Encounters -> src/data/definitions/encounters.ts (ENCOUNTERS)
- Shops -> src/data/definitions/shops.ts (SHOPS)
- Abilities -> src/data/definitions/abilities.ts (ABILITIES)
- Dialogues / misc -> src/data/definitions/*.ts (consult specific file named by id)

## Common cross-reference error messages and where to look
- "unlocksAbility '<abilityId>' does not exist in ABILITIES"
  - Inspect: src/data/definitions/equipment.ts (the equipment entry with that id) and src/data/definitions/abilities.ts (missing abilityId)

- "enemy '<enemyId>' does not exist in ENEMIES"
  - Inspect: src/data/definitions/encounters.ts (encounter entry) and src/data/definitions/enemies.ts (enemyId missing)

- "reward.djinn '<djinnId>' does not exist in DJINN"
  - Inspect: src/data/definitions/encounters.ts (reward) and src/data/definitions/djinn.ts

- "reward.unlockUnit '<unitId>' does not exist in UNIT_DEFINITIONS"
  - Inspect: src/data/definitions/encounters.ts and src/data/definitions/units.ts

- "reward.equipment.itemId '<itemId>' does not exist in EQUIPMENT"
  - Inspect: src/data/definitions/encounters.ts and src/data/definitions/equipment.ts

- "reward.equipment.options '<itemId>' does not exist in EQUIPMENT"
  - Inspect: src/data/definitions/encounters.ts and src/data/definitions/equipment.ts

- "availableItems '<itemId>' does not exist in EQUIPMENT"
  - Inspect: src/data/definitions/shops.ts (shop.availableItems) and src/data/definitions/equipment.ts

## Candidate files likely to require fixes
- src/data/definitions/encounters.ts
- src/data/definitions/enemies.ts
- src/data/definitions/equipment.ts
- src/data/definitions/abilities.ts
- src/data/definitions/djinn.ts
- src/data/definitions/units.ts
- src/data/definitions/shops.ts
- Any dialogue or miscellaneous definition that appears in validation output (src/data/definitions/*.ts)

## Suggested next steps to reproduce & locate exact errors
1. Run the validator in a Node REPL or small script to capture full output:

   node -e "(async()=>{const m=await import('./src/data/validateData');const r=await m.validateGameData();console.log(m.formatValidationResult(r));process.exit(r.valid?0:1)})();"

2. For each `[Category] <id>` error line, open the corresponding definition file from the mapping above and look up the `<id>` key to inspect fields and references.
3. Fix either the missing referenced id in the target definition file or correct the reference in the source definition.

## Static Analysis Findings: Missing Enemy IDs

The following enemies are referenced in `src/data/definitions/encounters.ts` but do not exist in `src/data/definitions/enemies.ts`:

- **blaze** - Referenced in encounters but should be "blaze-soldier"
- **bane** - No similar variant found; needs definition or reference correction
- **basilisk** - Referenced in encounters but should be "elder-basilisk"
- **breeze** - No similar variant found; needs definition or reference correction
- **chimera** - No similar variant found; needs definition or reference correction
- **hydra** - No similar variant found; needs definition or reference correction
- **leviathan** - No similar variant found; needs definition or reference correction
- **phoenix** - Referenced in encounters but should be "alpha-phoenix"
- **vortex-sentry** - Referenced in encounters but should be "vortex-sentinel" or "jupiter-vortex-sentry"

**Action items for encounters.ts:**
1. Replace `'blaze'` with `'blaze-soldier'`
2. Replace `'basilisk'` with `'elder-basilisk'`
3. Replace `'phoenix'` with `'alpha-phoenix'`
4. Replace `'vortex-sentry'` with `'vortex-sentinel'` (or `'jupiter-vortex-sentry'` if Jupiter-specific)
5. Define or correct references for: `'bane'`, `'breeze'`, `'chimera'`, `'hydra'`, `'leviathan'`

## Static Analysis Findings: Missing Equipment IDs

The following equipment items are referenced in `src/data/definitions/encounters.ts` but do not exist in `src/data/definitions/equipment.ts`:

- **curio-charm** - Referenced in encounter rewards but no definition exists

**Action items for equipment.ts:**
1. Define `'curio-charm'` or remove references from encounters.ts reward definitions

## Notes / Assumptions
- This diagnostic is derived from static analysis of definition files in src/data/definitions/ and cross-reference scanning.
- Findings include only confirmed missing IDs from static scan; no runtime validation was performed.
- For runtime validation and additional error details, run: `node -e "(async()=>{const m=await import('./src/data/validateData');const r=await m.validateGameData();console.log(m.formatValidationResult(r));process.exit(r.valid?0:1)})();"`
- Some missing enemies may be intentional (e.g., if encounters are under development).

---
Generated by repo diagnostic scan. Updated with concrete static-scan findings for missing IDs.
