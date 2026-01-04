Focus Restore Contract

Overview
- Implemented a tiny focus-restore hook and added stable testids for e2e.
- Purpose: ensure keyboard & screen-reader focus returns to the previously focused element after a modal/menu unmounts.

Hook API
- File: src/ui/hooks/useFocusRestore.ts
- Signature: useFocusRestore(ref)
  - ref: RefObject<HTMLElement> pointing at the element that should receive initial focus while the component is mounted.
  - Behavior: on mount, saves document.activeElement and focuses ref.current if available; on unmount, restores focus to the saved element.
  - Usage: Call at top-level of modal/menu component (no return value).

Test IDs added (exact values)
- pause-option-<id>
  - Added to every PauseMenu option button. Replace <id> with a menu id such as "resume", "inventory", "settings".
- pause-menu-options
  - Added on the element with role="menu" that contains the option buttons.

Notes for e2e (Playwright)
- To test focus restoration:
  1. Focus a button in the main UI (e.g. the "Open Pause" control).
  2. Open the PauseMenu.
  3. Interact and close the PauseMenu (it unmounts).
  4. Assert focus is back on the original element.

Change summary
- src/ui/hooks/useFocusRestore.ts - new helper
- src/ui/components/PauseMenu.tsx - wired the hook and added data-testid attributes

