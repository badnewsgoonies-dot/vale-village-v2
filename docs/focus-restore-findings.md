Focus Restore Findings

Summary
- Implemented a minimal DOM-based focus-restore hook that captures document.activeElement on open and restores it on close.

Caveats / Observations
- If the previously focused element is removed from the DOM before the restore step, the hook silently no-ops.
- Restoration uses a microtask (setTimeout(..., 0)) to avoid clashing with synchronous DOM removals/animations; tests should account for this small delay.
- The hook attempts to focus the first focusable element inside the dialog; if none exist, it focuses the container itself.

Recommendations for lane 3 (wiring)
- Add the exact testids from docs/focus-restore-contract.md to PauseMenu and the chosen modal.
- Ensure opening the dialog does not shift DOM order such that the remembered element is removed before close.

Known limitations
- This hook is intentionally minimal and does not manage focus-traps or keyboard navigation inside the dialog; if full a11y modal behavior is required, consider adding a focus-trap implementation.

Recorded at: 2026-01-04T18:17:00Z
