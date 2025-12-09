# Vale Village v2 - Complete Compendium

**Generated:** 2025-12-09
**Purpose:** Complete sitemap of implemented vs planned features

---

## Quick Stats

| Category | Count | Status |
|----------|-------|--------|
| Playable Units | 11 | Complete |
| Enemies | 104+ | Complete |
| Abilities | 208 | Complete |
| Djinn | 20 | Complete |
| Equipment | 88 | Complete |
| UI Screens | 42+ | Mostly Complete |
| Sprite Assets | 1,707 | Complete |

---

## Compendium Sections

### Data Definitions
- [Units & Heroes](./units.md) - 11 playable characters with stats, abilities, roles
- [Enemies](./enemies.md) - 104+ enemies across 5 tiers
- [Abilities](./abilities.md) - 208 abilities (damage, heal, buff, debuff)
- [Djinn](./djinn.md) - 20 djinn across 4 elements
- [Equipment](./equipment.md) - 88 items (weapons, armor, accessories)

### Game Systems
- [Combat System](./systems/combat.md) - Queue-based battle mechanics
- [Damage Formulas](./systems/damage.md) - Physical, psynergy, elemental
- [Djinn Mechanics](./systems/djinn-mechanics.md) - SET/STANDBY, synergies, summons
- [Progression](./systems/progression.md) - XP, leveling, stat growth

### UI & Screens
- [Screen Sitemap](./ui-sitemap.md) - All screens and navigation flow
- [Battle UI](./ui/battle.md) - Queue battle components
- [Menus](./ui/menus.md) - Pause, shop, compendium screens

### Assets
- [Sprite Inventory](./assets/sprites.md) - 1,707 GIF sprites
- [Design Documents](./assets/docs.md) - Balance specs, migration guides

---

## Implementation Status

### Fully Implemented
- Core battle system (queue-based, deterministic)
- Damage calculation (physical + psynergy + elements)
- Djinn system (SET/STANDBY, synergies, recovery)
- Turn order (SPD-based with priorities)
- Status effects (buffs, debuffs, DoT)
- Progression (XP, leveling 1-20)
- Equipment system
- All 11 playable units
- 104+ enemies with balanced stats
- Battle Tower (30 floors)

### Partially Implemented
- Save system (core works, validation TODO)
- Some UI modals (stubs exist)

### Not Yet Implemented
- Battle replay system
- Chapter/story progression tracking
- Equipment alchemy/fusion

---

## File Locations

```
/src/data/definitions/
├── units.ts          # 11 heroes
├── enemies.ts        # 104+ enemies
├── abilities.ts      # 208 abilities
├── djinn.ts          # 20 djinn
├── equipment.ts      # 88 items
├── encounters.ts     # Battle setups
├── towerFloors.ts    # Tower progression
└── ...

/src/ui/
├── TitleScreen.tsx
├── MainMenu.tsx
├── QueueBattleView.tsx
├── battle/
│   ├── Battlefield.tsx
│   ├── CommandPanel.tsx
│   └── ...
└── ...

/public/sprites/
├── battle/           # 309 battle sprites
├── icons/            # 400 icons
├── scenery/          # 591 environment
└── ...
```

---

## Cross-References

- [Balance Spec](../balance-spec.md) - Combat balance philosophy
- [Stat Retuning Plan](../stat-retuning-plan.md) - Proposed stat changes
- [Tower Design](../../TOWER_NORMALIZATION_DESIGN.md) - Tower mechanics
