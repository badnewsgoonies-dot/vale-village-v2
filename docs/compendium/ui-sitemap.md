# UI & Screens Sitemap

**Total:** 42+ TSX components

---

## Navigation Flow

```
TitleScreen
    ↓ (any key)
MainMenu
    ├→ New Game → OverworldMap
    ├→ Continue → SaveMenu → OverworldMap
    ├→ Compendium → PartyManagementScreen / DjinnCollectionScreen
    └→ Battle Tower → TowerHubScreen

OverworldMap
    ├→ ESC → PauseMenu
    │         ├→ Team Management (T)
    │         ├→ Inventory (I)
    │         ├→ Djinn Collection (D)
    │         ├→ Save Game (S)
    │         └→ Return to Title (Q)
    ├→ NPC → DialogueBoxV2
    ├→ Battle → PreBattleTeamSelectScreenV2
    │              ↓
    │          QueueBattleView (Planning)
    │              ↓
    │          QueueBattleView (Executing)
    │              ↓
    │          VictoryOverlay / DefeatOverlay
    │              ↓
    │          RewardsScreen
    └→ Shop → ShopScreen

TowerHubScreen
    ├→ Start Battle → QueueBattleView
    ├→ Rest Floor → Party/Equipment/Djinn
    └→ Quit → MainMenu
```

---

## Screen Categories

### Entry Screens
| Screen | File | Status |
|--------|------|--------|
| TitleScreen | `TitleScreen.tsx` | Complete |
| MainMenu | `MainMenu.tsx` | Complete |
| IntroScreen | `IntroScreen.tsx` | Stub |

### Overworld
| Screen | File | Status |
|--------|------|--------|
| OverworldMap | `OverworldMap.tsx` | Complete |

### Battle Screens
| Screen | File | Status |
|--------|------|--------|
| QueueBattleView | `QueueBattleView.tsx` | Complete |
| PreBattleTeamSelectScreenV2 | `PreBattleTeamSelectScreenV2.tsx` | Complete |

### Menu Screens
| Screen | File | Status |
|--------|------|--------|
| PauseMenu | `PauseMenu.tsx` | Complete |
| SaveMenu | `SaveMenu.tsx` | Stub |
| PartyManagementScreen | `PartyManagementScreen.tsx` | Complete |
| DjinnCollectionScreen | `DjinnCollectionScreen.tsx` | Complete |
| ShopScreen | `ShopScreen.tsx` | Complete |

### Post-Battle
| Screen | File | Status |
|--------|------|--------|
| RewardsScreen | `RewardsScreen.tsx` | Complete |
| VictoryOverlay | `VictoryOverlay.tsx` | Complete |
| DefeatOverlay | `DefeatOverlay.tsx` | Complete |

### Tower
| Screen | File | Status |
|--------|------|--------|
| TowerHubScreen | `TowerHubScreen.tsx` | Complete |

---

## Battle UI Components

### Core Battle
| Component | Purpose | Status |
|-----------|---------|--------|
| Battlefield | Unit sprite columns | Complete |
| BattleUnitSprite | Sprite renderer | Complete |
| CommandPanel | Attack/Psynergy/Djinn buttons | Complete |
| QueuePanel | Action queue + Execute button | Complete |
| BattleLog | Event transcript | Complete |
| BattlePortraitRow | Unit portraits + HP bars | Complete |

### Meters & Indicators
| Component | Purpose | Status |
|-----------|---------|--------|
| BattleManaBar | Mana orbs display | Complete |
| CritMeter | Crit counter (X/Y) | Complete |
| ModeLabel | Battle type label | Complete |

### Djinn UI
| Component | Purpose | Status |
|-----------|---------|--------|
| DjinnPanel | Djinn activation popup | Complete |
| DjinnBar | Djinn display | Stub |

### Dialogs
| Component | Purpose | Status |
|-----------|---------|--------|
| DialogueBoxV2 | Typewriter dialogue | Complete |

---

## Keyboard Shortcuts

### Global
| Key | Action |
|-----|--------|
| ESC | Pause / Back |
| Enter/Space | Confirm |

### Pause Menu
| Key | Action |
|-----|--------|
| T | Team Management |
| I | Inventory |
| D | Djinn Collection |
| S | Save Game |
| O | Settings |
| H | How to Play |
| Q | Return to Title |

### Dialogue
| Key | Action |
|-----|--------|
| 1-9 | Select choice |
| Enter | Advance |
| ESC | Skip (if allowed) |

---

## Status Legend

| Status | Meaning |
|--------|---------|
| Complete | Fully functional |
| Stub | File exists, minimal implementation |
| Placeholder | Exists but needs work |

---

## Component Count by Category

| Category | Count |
|----------|-------|
| Entry/Menu screens | 8 |
| Battle screens | 3 |
| Battle components | 15+ |
| HUD elements | 5+ |
| Dialogs/Modals | 5+ |
| Supporting (sprites, utils) | 6+ |

**Total:** 42+ TSX components
