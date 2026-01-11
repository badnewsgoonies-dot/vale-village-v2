# Menu UX Brief — Vale Village v2

Summary:
- Memory briefing (mem-briefing.py) flagged: "Prioritize focus-restore & SaveMenu as P0" and listed recent decisions and infra notes. (see mem-briefing output snapshot: Recent Decisions include smart loosenings and menu focus priorities)
- Semantic query for "menu UX" returned lessons pointing at MenuStackRouter, PauseMenu, and MainMenuScene as recent work (mem-semantic results).

A. Discovered UX issues (with file references)
1. Focus restoration and modal focus loss
   - Files: src/ui/components/PauseMenu.tsx, src/ui/components/SaveMenu.tsx, src/modals/InventoryModal.tsx, src/ui/components/MainMenu.tsx
   - Symptom: ActiveElement is not reliably restored after nested Settings/How-To-Play dialogs; keyboard users lose context.

2. JRPG textbox font & styling inconsistencies
   - Files: src/index.css, src/ui/styles/GoldenSunTheme.css, src/ui/components/DialogueBoxV2.tsx
   - Symptom: Press Start 2P font not reliably loaded; `.gs-window` styles are scattered and produce visual regressions.

3. Accessibility: missing keyboard handlers and testids
   - Files: src/ui/components/SaveMenu.tsx, src/ui/components/EquipmentChoicePicker.tsx, src/ui/components/VirtualJoystick.tsx
   - Symptom: Many click-only controls lack keyboard equivalents and stable testids for E2E tests.

4. Menu navigation stack regressions
   - Files: src/game/menus/MenuStackRouter.ts, src/game/scenes/MainMenuScene.ts
   - Symptom: Settings/How-To-Play push/pop can flash or lose previous menu state in edge cases.


B. Prioritized change list (P0/P1/P2) with estimates
- P0 (Immediate, 1-2 days): Focus-restore & SaveMenu
  - Implement useFocusRestore(isOpen, fallbackRef) hook; apply to PauseMenu, SaveMenu, InventoryModal, and MenuStackRouter integration. Add Playwright smoke test asserting focus returns to saved element.
- P1 (UI polish, 2 days): JRPG textbox & font
  - Consolidate `.gs-window` rules into GoldenSunTheme CSS module; ensure Press Start 2P is loaded with fallback and verified in CI via computed-style assertions.
- P2 (Accessibility & testability, 2-3 days): Keyboard handlers + testids
  - Add keyboard handlers for onClick-only elements, add data-testid attributes to toolbox/menu buttons, and update E2E tests.

C. Measurable acceptance criteria
- P0 Acceptance: Playwright test: open PauseMenu -> open Settings -> close Settings -> assert document.activeElement equals the original button element (testid-based). Manual keyboard navigation reproduces no focus loss.
- P1 Acceptance: CI style assertion passes: computed font-family for `.gs-window` contains "Press Start 2P" or fallback; visual regression baseline unchanged on 3 sample dialogs.
- P2 Acceptance: E2E tests cover SaveMenu and EquipmentChoicePicker keyboard navigation; all added data-testid selectors are documented in a short mapping table.

D. Memory command references (executed)
- Ran: python3 /home/geni/swarm/memory/mem-briefing.py (snapshot included in brief)
- Ran: python3 /home/geni/swarm/memory/mem-semantic.py "menu UX" --limit 10 (top lessons: MenuStackRouter, PauseMenu, MainMenuScene)

E. Next steps
1. Create `src/ui/hooks/useFocusRestore.ts` (small hook) and PR applying it to PauseMenu and SaveMenu (P0).  
2. Add Playwright smoke test `tests/e2e/menu-focus.spec.ts` asserting focus restoration.  
3. Iterate P1/P2 in follow-up PRs and mark done in IMPROVEMENT_BACKLOG.md.

<!-- End of menu-ux-brief -->