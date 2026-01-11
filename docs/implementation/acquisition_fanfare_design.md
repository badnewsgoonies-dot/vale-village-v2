# Acquisition Fanfare Design

Purpose
- Provide a lightweight, reusable UI/UX "fanfare" when the player acquires an item (loot, relic, djinn, key item) that is visually satisfying and non-blocking for E2E tests.

Goals
- Communicate reward clearly (name, icon, rarity)
- Short, skippable animation usable across screens (overworld, battle, shop)
- Expose a small API for callers to await completion or fire-and-forget

Visuals & Frames
- Assets: 3-frame particle burst (burst-1..3), item icon sprite (provided by caller), subtle glow shader.
- Recommended durations: INTRO_FADE_MS = 160, HOLD_MS = 1200, OUTRO_FADE_MS = 160 (constants used by implementation).
- Easing: cubic-out for intro, cubic-in for outro.

States
1. hidden — not mounted
2. intro — panel fades/scale in with burst and sound
3. hold — item name + icon visible; optional description
4. outro — fade/scale out
5. done — resolves any awaiters, unmounts component

Triggers & UX
- Trigger: showAcquisitionFanfare(item: AcquisitionPayload, options?)
- Options: {awaitCompletion?: boolean (default true), skipIfModalOpen?: boolean}
- Keyboard/Esc/Click will immediately complete the current fanfare (skip animation) and resolve awaiters.

API
- showAcquisitionFanfare(payload: {id: string; name: string; iconUrl?: string; rarity?: string; desc?: string}, opts?): Promise<void>
- fireAndForget variant: showAcquisitionFanfare(payload, {awaitCompletion:false})

Integration Notes
- Keep accessible: announce via ARIA live region when the fanfare appears.
- Keep deterministic timing for E2E by exposing a TEST_MODE flag or overriding durations in tests.
- Do not bundle sounds by default; callers may provide a playSound() hook.

Testing
- Unit tests should validate API shape, skip behavior, and that the promise resolves.
- E2E tests should verify DOM mount/unmount and ARIA announcement (use a gated, light test to avoid flakiness).

Constants and non-magic numbers should be extracted into a single file for reuse.
