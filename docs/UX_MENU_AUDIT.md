UX MENU AUDIT

Scope: PauseMenu, SaveMenu, InventoryModal, BattleActionMenu, SettingsModal/SettingsScreen

Summary of findings

- PauseMenu (src/ui/components/PauseMenu.tsx)
  - data-testid: pause-menu present on top-level container.
  - ARIA: role="dialog", aria-modal="true", aria-label present; menu items use role="menuitem" and aria-selected.
  - Focus-restore: implemented via local prevActiveRef + closeWithRestore which focuses previously-active element before onClose.
  - Recommendation: OK; consider standardizing on useFocusRestore hook (src/ui/hooks/useFocusRestore.ts) to reduce duplication.

- SaveMenu (src/ui/components/SaveMenu.tsx)
  - data-testid: save-menu present on container.
  - ARIA: role="dialog", aria-modal="true" and close button has aria-label.
  - Focus-restore: implemented locally (prevActiveRef + closeWithRestore) and used on overlay clicks and close button.
  - Recommendation: OK; standardize on useFocusRestore hook for consistency and add per-slot data-testids if tests need to target specific slots.

- InventoryModal (src/modals/InventoryModal.tsx)
  - data-testid: inventory-modal present on container.
  - ARIA: role="dialog", aria-modal="true", close button has aria-label; modal receives focus on mount (modalRef.focus()).
  - Focus-restore: MISSING — no capture/restore of previously-focused element on open/close.
  - Item controls: inventory item buttons do not include data-testid attributes or explicit ARIA (role/listbox/menu semantics) — currently plain buttons.
  - Recommendation: Add focus-restore (useFocusRestore or prevActiveRef + guarded focus restore) to ensure keyboard users return to prior context. Add data-testids for item rows (e.g. data-testid="inventory-item-{id}") and, if desired, use proper listbox/menu semantics and aria-selected on item buttons.

- BattleActionMenu (src/ui/components/BattleActionMenu.tsx)
  - data-testid: present (battle-action-menu, battle-action-menu-abilities, battle-action-menu-summon, ability-<id>, back buttons, action-psynergy, action-summon).
  - ARIA: role="dialog", aria-modal="true", aria-label on containers; buttons use aria-pressed/aria-disabled where appropriate.
  - Focus-restore: MISSING — menu sets tabIndex on containers and returns components, but does not capture/restore prior focus when opened/closed.
  - Recommendation: Add focus-restore (useFocusRestore) or capture prevActiveRef in parent to restore focus on close; consider moving focus into the dialog on open (already sets tabIndex) and returning focus on close.

- SettingsModal / SettingsScreen
  - SettingsScreen (src/ui/components/SettingsScreen/SettingsScreen.tsx): data-testid="settings-modal" present, tab buttons have data-testid entries, prevActiveRef is captured and restored in cleanup; active tab button focused on mount — GOOD.
  - SettingsModal (src/modals/SettingsModal.tsx): ARIA present (aria-modal, aria-labelledby) and modal focuses itself on mount, but it does NOT include data-testid on top-level container and does NOT capture/restore previous focus on close.
  - Recommendation: If SettingsModal is used in places tests target, add data-testid="settings-modal" and implement focus-restore (prefer useFocusRestore) to match SettingsScreen behavior. Consolidate modal/screen implementations where possible to avoid divergence.

Cross-cutting observations

- useFocusRestore hook exists at src/ui/hooks/useFocusRestore.ts but is not widely used; many components implement ad-hoc prevActiveRef + closeWithRestore logic. Recommend adopting the hook across menu/modal components for consistency and to centralize guarding (e.g., isConnected checks).

- Data-testids: Core menus (pause, save, inventory, battle action, settings screen) mostly include container-level data-testids; item-level testids are missing in InventoryModal items and SaveMenu slots — add them if fine-grained e2e tests will target items/slots.

- ARIA: Dialog containers consistently expose role="dialog" and aria-modal; buttons generally include aria-label/aria-pressed/aria-disabled where appropriate. Minor gaps are item elements that could benefit from aria-selected/role attributes.

Actionable fixes (P0/P1)

P0 (high):
- Add focus-restore to InventoryModal and BattleActionMenu (or their parent callers) using useFocusRestore to ensure previous focused element is restored on close.
- Add data-testid attributes for inventory item rows (e.g. data-testid="inventory-item-{id}") and for SaveMenu slots (e.g. data-testid="save-slot-{index}") to support deterministic E2E targeting.
- Add data-testid="settings-modal" to src/modals/SettingsModal.tsx and implement focus-restore in that modal (guarded, use hook).

P1 (medium):
- Refactor duplicated prevActiveRef + closeWithRestore patterns to use the centralized useFocusRestore hook; keep the existing guarded checks (isConnected) present in current implementations.
- Consider applying listbox/menu semantics to InventoryModal item list (role="listbox" + role="option"/aria-selected) if selection semantics are required for accessibility.

Next steps (for the worker)

- Create a small PR that implements the P0 changes (InventoryModal: focus-restore + per-item data-testids; BattleActionMenu: focus-restore; SettingsModal: add data-testid + focus-restore). Run E2E tests that target these menus to gather failing logs if any.

Risks / blockers

- Multiple overlapping implementations of settings (SettingsScreen vs SettingsModal) may cause duplication work; confirm which is used in production flows before making changes.
- Adding data-testids may require updating tests that already target elements by other selectors.

Decision

- Standardize on useFocusRestore for focus restore across menu/modal components and add missing data-testids for Inventory items and Save slots (P0).

Lesson

- Centralized accessibility helpers (focus-restore) reduce duplication and lower risk of regressions when multiple modal implementations exist.

