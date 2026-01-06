# BUGS_NEW.md

This file lists 20 candidate bugs found by scanning src/ for risky patterns (TODO/FIXME, console.log, debugger, any casts, throw new Error, localStorage usage, ==). Each entry includes a file path, approximate line numbers, a short description, and a suggested severity.

1. src/ui/sprites/SimpleSprite.tsx (approx lines 210-225)
   - Description: Debug console.log left in production UI code and debug overlay logic that may render invalid DOM state; multiple "as any" casts weaken type safety.
   - Severity: Minor

2. src/ui/sprites/SimpleSprite.tsx (approx lines 339-366)
   - Description: Error handling and placeholder image generation may lead to silent UI failures; fallback path printing may leak internal info.
   - Severity: Minor

3. src/ui/sprites/BackgroundSprite.tsx (approx lines 90-106)
   - Description: console.warn when category missing could spam logs; random image selection/memoization may re-roll unexpectedly causing visual flicker.
   - Severity: Minor

4. src/ui/state/storySlice.ts (approx lines 48-88)
   - Description: Reducer contains console.log side-effects and synchronous grants processing which may have unintended side effects in reducers.
   - Severity: Moderate

5. src/ui/components/RewardsScreen.tsx (approx lines 80-120)
   - Description: TODO for missing unit logging and keyboard event handling assumes DOM presence; potential null deref or missing unit edge-case not handled.
   - Severity: Moderate

6. src/core/save/migrations.ts (approx lines 20-120)
   - Description: Migration logic mutates save shapes and contains console.warn fallbacks when encountering unknown versions; risk of silent data loss or invalid migration path.
   - Severity: Moderate

7. src/infra/save/LocalStorageSavePort.ts (approx lines 34-58)
   - Description: JSON.parse + zod validation flow may throw and is rethrown with concatenated messages; errors can crash load and leak implementation details to user logs.
   - Severity: Moderate

8. src/infra/save/LocalStorageSavePort.ts (approx lines 60-78)
   - Description: write/delete rethrow on localStorage errors (string concatenation) — could surface user-unfriendly messages and lack graceful fallback for quota or permission errors.
   - Severity: Minor

9. src/core/save/SaveService.ts (general)
   - Description: Replay tape storage naming ("vale:replay:tape") and naive stringification may cause incompatibilities and large localStorage usage without size checks.
   - Severity: Moderate

10. src/core/save/ReplayService.ts (general)
    - Description: Replay serialization/deserialization logic appears brittle; corrupted or partial replays could throw unhandled exceptions.
    - Severity: Moderate

11. src/core/algorithms/status.ts (approx lines 20-60)
    - Description: Status tick ordering (decay, DOT, healing, duration decrement) is complex; off-by-one or ordering bugs could incorrectly apply/remove effects.
    - Severity: Critical

12. src/core/algorithms/damage.ts (approx lines 260-400)
    - Description: applyHealing can throw when healing KO'd units unless revivesFallen is set; throwing in algorithmic code risks crashing calling code if not carefully caught.
    - Severity: Critical

13. src/core/algorithms/damage.ts (approx lines 20-44)
    - Description: Element advantage mapping is a hard-coded table; missing entries or incorrect mapping could cause gameplay imbalance.
    - Severity: Moderate

14. src/ui/components/overworld/OverworldCanvas.tsx (approx lines 140-174)
    - Description: Canvas lifecycle start/stop and event listener registration may leak listeners or miss cleanup during React re-renders, causing duplicate handlers.
    - Severity: Moderate

15. src/ui/components/overworld/engine/OverworldEngine.ts (general)
    - Description: Scene transitions, camera snap logic, and reliance on mutable layer state may produce race conditions and visual glitches during fast scene changes.
    - Severity: Moderate

16. src/ui/components/VirtualJoystick.tsx (general)
    - Description: Pointer/touch handling uses passive:false and direct pointer capture/release; may interfere with browser gestures and cause scrolling issues on mobile.
    - Severity: Minor

17. src/ui/components/TouchOverlay.tsx (general)
    - Description: preventDefault usage and complex pointer fallback logic could break accessibility or input in edge-case devices/browsers.
    - Severity: Minor

18. src/ui/components/QueueBattleView.tsx (approx lines 620-660)
    - Description: Event dequeue/scheduling logic uses refs and timeouts; race conditions can cause events to be dropped or processed out of order leading to UI/state desync.
    - Severity: Critical

19. src/ui/components/RewardsScreen.tsx (rendering section approx lines 299-349)
    - Description: Level-up rendering relies on many optional nested properties; insufficient null checks could lead to runtime exceptions when data shape differs.
    - Severity: Moderate

20. src/ui/components/overworld-v2/OverworldV2.tsx (general)
    - Description: Complex layer rendering and many "as any" casts reduce type safety and increase risk of runtime errors in render/update loops.
    - Severity: Moderate


Notes:
- These entries are based on a quick pattern scan and opening representative files; recommended next steps: run pnpm typecheck and unit/e2e tests to surface concrete failing lines, then triage/assign and add reproduction steps for each high/critical item.
