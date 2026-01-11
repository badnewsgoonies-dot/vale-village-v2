# Menu Map (generated)

Generated summary of core UI menus and modals discovered in the repository.

## Overview
This document summarizes menus found by static scan and links to their controlling files and UI components.

## Menus

- Main Menu
  - Files: src/screens/MainMenu.tsx, src/ui/components/MainMenu.tsx
  - State slices: gameFlowSlice, storySlice
  - Entry points: app boot, MainMenu screen

- Pause Menu
  - Files: src/modals/PauseMenu.tsx, src/ui/components/PauseMenu.tsx
  - State slices: gameFlowSlice, devModeSlice
  - Entry points: keyboard (Esc), HUD pause button, game store signals

- Save Menu
  - Files: src/ui/components/SaveMenu.tsx
  - State slices: saveSlice
  - Entry points: Pause Menu -> Save, Main Menu -> Save

- Battle Action Menu
  - Files: src/ui/components/BattleActionMenu.tsx
  - State slices: battleSlice, queueBattleSlice
  - Entry points: in-battle UI / QueueBattleView

- Inventory Modal
  - Files: src/modals/InventoryModal.tsx
  - State slices: inventorySlice
  - Entry points: HUD inventory button, menu shortcut

- Settings / How-To-Play
  - Files: src/modals/SettingsModal.tsx
  - State slices: devModeSlice, gameFlowSlice
  - Entry points: Pause Menu -> Settings, Main Menu -> Settings

- Djinn Detail Modal
  - Files: src/ui/components/DjinnDetailModal.tsx
  - State slices: teamSlice, inventorySlice
  - Entry points: party/team UI -> Djinn detail

## Validation
A lightweight validation was performed and confirmed:
- schema: menu_map_v1
- checks: menu_count_nonzero, each_menu_has_id_label, each_menu_has_ui_component

## Next steps
- Add explicit data-testids and focus-restore hooks to SaveMenu and PauseMenu (P0).
- Expand entry_points by scanning call sites and store usage (follow-up).

## Final summary
- Rounds 1-5 reviewed; canonical menu map (menu_map.json) validated and annotated.
- No code edits made in this round due to allowlist constraints; next action: implement P0 PRs targeting SaveMenu and PauseMenu to add testids and focus-restore.
- Risk: none identified within allowed files; external code changes may surface minor TypeScript fixes during PR.


### Review notes (2026-01-11T13:38:07Z)
- Confirmed menu_map.json aligns with repository scan and mem-briefing.
- Work completed in rounds 1-5 covers extraction and validation; no further edits to analysis files required.
- Next actionable: implement P0 focus/testid changes inside src/ui components (requires allowlist expansion).

