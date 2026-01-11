# Design Specification — Combined Acquisition Flow

Status: Draft
Author: automated-orch
Date: 2026-01-11

## 1. Goals
- Provide a modern, unified "acquisition" experience allowing players to discover, preview, and acquire content (items, accessories, djinn, companions) using a combined UX that supports discovery, ceremony, and confirmation.
- Reduce cognitive load by combining discovery, preview, and onboarding into a compact flow while preserving delight (animation, music, micro-interactions).
- Define data contracts and implementation touchpoints for incremental implementation in the repo.

## 2. Key user stories
- As a player, I want to discover new items visually and read quick tips before deciding to acquire them.
- As a player, I want a short preview animation and audio cue when an item is highlighted.
- As a player, I want an onboarding "mini-ceremony" the first time I acquire a specific category (e.g., first djinn), with contextual teaching text.
- As a developer, I want clear data models and acceptance criteria to verify that the flow is implemented and testable.

## 3. End-to-end acquisition sequence (happy path)
1. Discovery: player opens Shop / loot modal / event reward sheet.
2. Filtering & preview: UI presents items with thumbnails; hover/select shows detailed preview panel (stats, short description, gallery frames).
3. Acquisition candidate: CTA "Acquire / Equip / Claim" becomes available; secondary CTA "Preview" plays a short animated preview.
4. Ceremony (first-time for category): lightweight overlay with title, 1–2 sentence teaching tip, celebratory audio, and a "Got it" confirmation.
5. Confirmation: final modal summarises effect (e.g., +HP, special ability) and an optional equip toggle.
6. Post-acquisition: flash animation on inventory and optional quick tutorial link.

Edge cases: insufficient currency (show cost modal), inventory full (show equip/replace flow), network failure (fallback toast / local optimistic update + reconcile).

## 4. Data models
- AcquisitionItem (JSON schema):
{
  "id": "string",
  "type": "string", // e.g., "item","djinn","accessory"
  "name": "string",
  "description": "string",
  "previewFrames": ["string"], // asset keys
  "statChanges": {"hp":0},
  "cost": {"currency":"gold","amount":0},
  "firstTimeCategory": "boolean"
}

- AcquisitionEvent:
{
  "eventId":"string",
  "source":"shop|loot|quest",
  "timestamp":"ISO8601",
  "items":[AcquisitionItem]
}

Constants must be defined in code (no magic numbers): currency types, animation durations (ms), audio cue ids.

## 5. UX wireframes (ASCII)
- List view (compact):
[ItemThumb] Name — Cost  [Preview]
[ItemThumb] Name — Cost  [Preview]

- Preview panel (right side) ASCII:
+-------------------------+
| ITEM NAME               |
| [big frame]             |
| Description...          |
| +HP: +5  +STR: +2       |
| [Acquire] [Equip toggle]|
+-------------------------+

- Ceremony overlay:
+-----------------------------+
| ★ New Djinn Acquired!       |
| "This djinn grants ..."    |
| [Play animation]  [Got it]  |
+-----------------------------+

SVG refs: place illustrative SVGs in docs/mockups/ if needed (not created here).

## 6. Animation & music integration notes
- Use short (400–800ms) ease-out animations for preview transitions; use constants in UI state (e.g., ANIM_PREVIEW_DURATION_MS).
- Assign an audio cue per category (sfx.item_acquire, sfx.djinn_acquire), volume controlled by global audio settings.
- Provide a one-shot celebratory music short (3–5s) for first-time ceremonies that respects user mute preferences.

## 7. Teaching / onboarding flows
- First-time-acquire per category: when firstAcquiredFlag(category) is false, show ceremony overlay and set flag true.
- Provide "Don't show again" toggle for players who dismiss teaching overlay.
- Include contextual help links in PauseMenu -> How-To -> Acquisition.

## 8. Implementation touchpoints (suggested repo locations)
- Discovery UI: src/ui/components/ShopScreen.tsx, src/ui/components/QueueBattleView.tsx (popup flows)
- Preview panel: src/ui/components/overworld-v2/layers/* or new src/ui/components/AcquisitionPreview.tsx
- Ceremony overlay & onboarding: src/ui/components/Modal* or src/ui/components/PauseMenu.tsx for help links
- State management: src/ui/state/* (add acquisitionSlice.ts or extend existing slices)
- Services: src/core/services/* (AcquisitionService to orchestrate events and persistence)
- Data definitions: src/data/definitions/* (add acquisition item schema & validation)
- Audio constants: src/ui/state/devModeSlice.ts or central audio manager

## 9. Measurable acceptance criteria
- The markdown spec file exists at docs/acquisition/DESIGN_SPECIFICATION_ACQUISITION_FLOW.md (this file).
- Preview panel opens and plays preview animation when user selects "Preview" (animation time = ANIM_PREVIEW_DURATION_MS constant).
- Ceremony overlay displays for first-time category acquisitions and sets a persistent flag.
- AcquisitionItem validation schema rejects malformed items (tests should cover schema validation).
- Automated verification: presence of key headings (Goals, User stories, Data models, Acceptance criteria) in the spec file.

## 10. Automated verification plan
- Unit tests (suggested): tests/spec_validation/test_acquisition_spec_presence.py — simple check that the file exists and contains required headings.
- Lint check: add a repository check that ensures constants referenced in this doc exist in code (manual step until a script added).
- Suggested command (not created here):
  python3 - <<PY
import sys,re
md=open('docs/acquisition/DESIGN_SPECIFICATION_ACQUISITION_FLOW.md').read()
for h in ['Goals','Key user stories','Data models','Measurable acceptance criteria']:
    assert re.search(h,md,flags=re.I), f"Missing heading: {h}"
print('OK')
PY

## 11. Next steps
- Review with product/UX to add visual mockups (SVGs) and define exact audio assets.
- Implement acquisitionSlice and AcquisitionPreview component; add schema validation in src/data/validateData.ts.
- Add automated test described above and wire into CI.

---

© vale-village-v2
