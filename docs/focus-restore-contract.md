# Focus Restore Contract

Purpose
- Restore keyboard focus to the originating control when a modal/menu is closed, to avoid keyboard focus loss for keyboard users and Playwright tests.

Public API (Lane 1 implementer)
- function attachFocusRestore(triggerTestId: string, modalTestId: string, closeTestId: string): void
  - Behavior: when a DOM element with data-testid=triggerTestId is used to open the modal identified by data-testid=modalTestId, calling attachFocusRestore will record the trigger element as the focus target and restore focus to it when the modal's close control (data-testid=closeTestId) fires a close action.
  - Example usage (pseudo):
    attachFocusRestore('pause-inventory-button', 'inventory-modal', 'inventory-close-button');

Test IDs added by Lane 1 (exact strings tests will use)
- data-testid="pause-inventory-button" — the Inventory action/button inside the Pause menu that opens Inventory.
- data-testid="inventory-modal" — the Inventory modal container element.
- data-testid="inventory-close-button" — the modal's explicit close control (button) that dismisses the inventory modal.

Notes for Playwright tests
- Tests should open the Pause menu, click the pause-inventory-button, assert inventory-modal is visible, close it via inventory-close-button, then assert document.activeElement has data-testid "pause-inventory-button".
- Selector examples for tests: `[data-testid="pause-inventory-button"]`, `[data-testid="inventory-modal"]`, `[data-testid="inventory-close-button"]`.

Contract version: 1.0
Author: lane/2 worker (creates test), expects Lane 1 to implement helper and add the exact testids above.
