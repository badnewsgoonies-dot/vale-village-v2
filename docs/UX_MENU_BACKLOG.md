# UX Menu Backlog (Scouting Run)

Generated from static scan (`analysis/menu_map.json`, `analysis/menu_map.md`) and memory briefing.

## Current Menus (sources)
- **Main Menu** — `src/screens/MainMenu.tsx`, `src/ui/components/MainMenu.tsx`; state: `gameFlowSlice`, `storySlice`
- **Pause Menu** — `src/modals/PauseMenu.tsx`, `src/ui/components/PauseMenu.tsx`; state: `gameFlowSlice`, `devModeSlice`
- **Save Menu** — `src/ui/components/SaveMenu.tsx`; state: `saveSlice`
- **Battle Action Menu** — `src/ui/components/BattleActionMenu.tsx`; state: `battleSlice`, `queueBattleSlice`
- **Inventory Modal** — `src/modals/InventoryModal.tsx`; state: `inventorySlice`
- **Settings / How-To-Play** — `src/modals/SettingsModal.tsx`; state: `devModeSlice`, `gameFlowSlice`
- **Djinn Detail Modal** — `src/ui/components/DjinnDetailModal.tsx`; state: `teamSlice`, `inventorySlice`

## P0 (Critical) TODOs
- Save Menu: add data-testids and focus-restore on close; ensure entry from Pause/Main menus restores prior focus target.
- Pause Menu: add data-testids and focus-restore on close; verify Esc/close returns focus to HUD/invoker.
- Add lightweight validator for menu_map.json (schema/menu count) as a pre-commit/check step.

## P1 (Polish) TODOs
- Inventory Modal: improve accessibility (ARIA labels for tabs/buttons) and focus order when opened from HUD.
- Battle Action Menu: surface selected/hovered state for keyboard users (ARIA + focus outlines).
- Settings Modal: audit toggle controls for ARIA roles/labels; ensure close returns focus.
- Expand entry_points in menu_map by scanning call sites/store usage for completeness.

## Suggested Tests (smoke/targeted)
- Playwright/Vitest: open/close Pause Menu -> verify focus returns to invoker and testids present.
- Open/close Save Menu from Pause and Main menus -> verify focus restore and testids present.
- Inventory Modal: open via HUD, tab through controls, assert ARIA labels and focusable order.
- Battle Action Menu: keyboard navigation asserts focus ring and selected state update.

## Artifacts
- Menu scan: `analysis/menu_scan.txt`
- Menu map: `analysis/menu_map.json`, `analysis/menu_map.md`
