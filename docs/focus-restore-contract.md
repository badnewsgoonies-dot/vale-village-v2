Focus Restore Contract

Purpose
- Define the exact DOM testids and observable behavior that E2E tests (lane 2) will rely on for focus restore.

Testids (exact values)
- data-testid="focus-restore-open-button"
  - The interactive control that opens the dialog/menu. Tests should focus/interact with this element prior to opening.
- data-testid="focus-restore-dialog"
  - The dialog or menu container that receives initial focus when opened (or contains the first focusable element).
- data-testid="focus-restore-close"
  - The control inside the dialog that closes it.

Behavior (observable rules for tests)
1. Before opening: tests MUST focus an element with data-testid="focus-restore-open-button" (or any focusable element—this is the expected "return target").
2. When the dialog opens (an app action causes the element with data-testid="focus-restore-dialog" to appear): focus must move into the dialog or its first focusable child.
3. When the dialog is closed (the app hides/removes the dialog or the close control is activated): focus MUST be returned to the element that had focus just before the dialog opened (the element with data-testid="focus-restore-open-button").
4. If the previously focused element was removed from the document before restore, no error should be thrown and focus may remain where it is.

Notes for implementers
- Tests MUST use only these testids; do not rely on implementation-specific DOM structure.
- Timing: tests may need to await next animation frame or microtask after close to observe restored focus (e.g. await page.waitForTimeout(0) or equivalent). Keep assertions resilient to one microtask delay.

Version: 1.0
