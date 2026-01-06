# UI Menu Bugs
Generated: 2026-01-03T23:40:00Z

## Confirmed (with evidence)
### Pending menu selection snapshots are never applied
- **Location:** `src/ui/SettingsHowToPlayMenu.ts:105-196`
- **Symptoms:** The stack router stores a `MenuSelectionSnapshot` via `setPendingMenuSelection` every time Settings/How-To-Play closes, but nothing ever consumes `pendingSelectionByModal`, so returning focus/selection is a no-op.
- **Repro steps:** Open the pause menu (`Esc`), press `O` to jump into Settings, hit the modal’s back/close handler, then try to resume navigation with the keyboard—the pause menu always starts at the first option rather than the entry that triggered Settings.
- **Expected vs Actual:** Expect the menu to remember which option opened Settings/Help and restore that highlight/focus; actual behavior leaves the `selectedIndex` at the default (first option) because the snapshot map is never read.
- **Severity:** Medium
- **Notes:** This regression is not recorded in `BUGS.md` or `BUGS_NEW.md` despite being traceable solely through `SettingsHowToPlayMenu.ts` (no other file references `consumePendingMenuSelection`).

## Likely (needs repro)
### Pause menu never reapplies pending selection before keyboard input resumes
- **Location:** `src/ui/components/PauseMenu.tsx:166-207` (keyboard nav + menu rendering)
- **Symptoms:** When control returns from Settings or How-To-Play, `PauseMenu` always renders with `selectedIndex` at 0 because no `consumePendingMenuSelection` call resets `selectedIndex` to the stored snapshot.
- **Repro steps:** Trigger Settings (`O`) or How-To-Play (`H`) from the pause menu, close it via “Back” or “Close,” and then press `ArrowDown`—you must re-navigate from the top of the menu even if the previous selection was lower on the list.
- **Expected vs Actual:** Expected to resume listing from the last-used option (e.g., Settings) by reading the pending snapshot; actual behavior always starts at the top because the snapshot is never replayed.
- **Severity:** Medium
- **Notes:** This is inferred from the same `SettingsHowToPlayMenu` flow: the snapshot is stored but there is no consumer anywhere in `PauseMenu`/main menu code, so the restore flow is effectively dead code even though it is wired into the stack router.

### Settings modal leaves battle action menu unfocused
- **Location:** `src/ui/components/QueueBattleView.tsx:971-997` (toolbox action definitions) and `src/ui/components/SettingsScreen/SettingsScreen.tsx`
- **Symptoms:** The in-battle toolbox opens Settings with `openModal('settings')` directly, and `SettingsScreen` never talks to `settingsHowToPlayMenu`, so the selection snapshot/focus restoration that exists for the pause menu flow is never triggered.
- **Repro steps:** Start any battle, open Settings from the toolbox, close it with “Apply & Close” or ESC, then try to navigate the battle action menu with the keyboard—the arrow keys do nothing until you click the menu again because focus was never re-focused onto it.
- **Expected vs Actual:** Expect the helper to capture and restore the previous menu selection so keyboard navigation resumes immediately after the modal closes; actual behavior drops focus to the backdrop so the action menu ignores keyboard input.
- **Severity:** Medium
- **Notes:** `settingsHowToPlayMenu` has zero consumers in the repo (search only returns the class and this doc), so the pending selection infrastructure is effectively dead for battle/compendium flows even though the helper is wired up for the pause menu.

## Wishlist/UX
### Save slots should be keyboard-accessible
- **Location:** `src/ui/components/SaveMenu.tsx:218-280`
- **Symptoms:** Each save slot is rendered as a `div` overflowing grid space with `onClick` handlers, but there are no `tabindex`, `role`, or keyboard listeners, so keyboard-only or assistive-device users cannot navigate slots or confirm actions.
- **Repro steps:** Not applicable (design request).
- **Expected vs Actual:** Expected to be able to focus a slot with Tab/Arrow keys and activate it with Enter/Space; actual markup only responds to pointer `onClick`, which is inaccessible.
- **Severity:** Low
- **Notes:** The slipstream provides buttons elsewhere (e.g., action toolbar), so converting the slots or adding `role="button"`/`tabindex="0"` and keyboard handling would unblock menu accessibility without affecting existing pointer flows.

### Party compendium roster cards are not keyboard navigable
- **Location:** `src/ui/components/PartyManagementScreen.tsx:59-100`
- **Symptoms:** Each roster entry is a `div` with `onClick` but no `tabindex`, `role`, or keyboard handling, so the compendium tiles cannot be focused/activated without a mouse or touch.
- **Repro steps:** Open the Unit Compendium and try to select a different unit using Tab/Arrow + Enter—nothing happens because the cards never receive focus.
- **Expected vs Actual:** Expect the roster grid to expose each card as a focusable control (e.g., `button` or `role="button"` plus `tabindex="0"`) so keyboard/assistive users can browse units; the current markup is pointer-only.
- **Severity:** Low
- **Notes:** The existing effects already show stats per selection, so adding standard accessibility props would unlock keyboard navigation without altering the layout.

### Shop/Equipment unit selectors need keyboard hooks
- **Location:** `src/ui/components/ShopEquipScreen.tsx:217-399`
- **Symptoms:** Tabs and unit selectors in the shop/equipment modal are rendered as `button`-less `div`s (`tab-btn` is a button, but the per-unit cards are not focusable), so unit selection and tab-switching cannot be performed without a mouse.
- **Repro steps:** Open the Shop & Equipment modal via the Tower Hub or Shop shortcut, attempt to swap tabs or pick a different unit with the keyboard—focus only lands on the overlay close button and rows do not respond to Enter.
- **Expected vs Actual:** Expect the interactive tiles to be reachable via keyboard (e.g., using `tabindex="0"`/`role="tab"` or `button` elements); actual structure uses bare `div`s so keyboard-only users cannot change the selected unit or tab.
- **Severity:** Low
- **Notes:** The UI already toggles styles based on selection, so adding semantic interactive wrappers would improve accessibility with minimal rework.
