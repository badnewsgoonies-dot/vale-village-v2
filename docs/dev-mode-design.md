Dev Mode Design — vale-village-v2

Summary
-------
This design describes a lightweight, safe DevMode overlay that can be toggled with a keyboard shortcut (Ctrl+D) and exposes three primary tabs: Cheats, Teleport, and State. The document specifies the DevMode state model (Zustand-friendly), public API signatures, keyboard/event handling, and a minimal integration plan with exact TODO locations for implementation.

Goals
-----
- Provide a single, well-scoped overlay used only in development builds.
- Keep runtime risk low: DevMode state must be opt-in (enabled flag) and never serialized into production save data.
- Provide clear API surface so other subsystems can expose debug helpers (commands, teleport hooks, snapshots).

Overlay layout
--------------
High-level: modal overlay that sits above the app UI and can be toggled visible/hidden. Layout is intentionally small and non-invasive.

- Global container (role=dialog) anchored to top-right, keyboard-focusable.
- Tabs (left nav or header):
  - Cheats — quick toggles and one-off actions (invincible, infinite-items, one-hit-kill, spawn enemy, spawn item)
  - Teleport — map selector + X/Y numeric inputs + "Teleport Now" button
  - State — read-only inspection of selected stores (slice selector), ability to snapshot/restore, and a JSON viewer with copy-to-clipboard

UI details (recommended structure):
- Header: title "Dev Mode" + close button (Esc hides overlay)
- Tabs area: list of tabs + keyboard shortcuts to switch (Alt+1/Alt+2/Alt+3 optional)
- Content area: controls per tab, clear labels and small helper text
- Footer: small area for overlay-level actions: "Take Snapshot", "Restore Snapshot", "Clear Snapshots"

Accessibility & safety
- Prevent keyboard handling when input/select/textarea is focused (see Event Handling).
- All actions must require explicit click (no accidental toggles on key press apart from the global toggle keybinding).
- Use feature-flagging: compile-time or runtime check so feature can be stripped/disabled in production builds (e.g., process.env.NODE_ENV !== 'production').

DevMode state model (TypeScript interface)
-----------------------------------------
export interface DevModeState {
  // feature controls
  enabled: boolean;        // global feature flag, default false in prod
  visible: boolean;        // overlay visibility

  // Cheats tab model
  cheats: {
    invincible: boolean;
    infiniteItems: boolean;
    oneHitKill: boolean;
    spawnEnabled: boolean;  // allow spawn controls to be used
  };

  // Teleport tab model
  teleport: {
    selectedMapId?: string | null;
    x: number | null;
    y: number | null;
  };

  // State tab model (inspection & snapshots)
  stateView: {
    selectedSlice?: string | null; // e.g., 'game', 'player', 'battle'
    snapshots: Record<string, any>; // named snapshots
  };

  // API methods (Zustand/Action style)
  toggleEnabled: () => void;
  setVisible: (v: boolean) => void;
  setCheat: (key: keyof DevModeState['cheats'], value: boolean) => void;
  setTeleportTarget: (mapId: string, x: number, y: number) => void;
  teleportNow: () => Promise<void>;
  takeSnapshot: (name: string) => void;
  restoreSnapshot: (name: string) => void;
  clearSnapshots: () => void;
}

Suggested Zustand slice factory (signature)
-------------------------------------------
// src/ui/state/devModeSlice.ts (recommended location)
export const createDevModeSlice = (set, get) => ({
  enabled: false,
  visible: false,
  cheats: { invincible: false, infiniteItems: false, oneHitKill: false, spawnEnabled: false },
  teleport: { selectedMapId: null, x: null, y: null },
  stateView: { selectedSlice: null, snapshots: {} },

  toggleEnabled: () => set(state => ({ enabled: !state.enabled })),
  setVisible: (v) => set({ visible: v }),
  setCheat: (key, value) => set(state => ({ cheats: { ...state.cheats, [key]: value } })),

  setTeleportTarget: (mapId, x, y) => set({ teleport: { selectedMapId: mapId, x, y } }),
  teleportNow: async () => {
    const t = get().teleport;
    if (!t.selectedMapId || t.x === null || t.y === null) return;
    // Implementation detail: call an exported teleport helper from core (see Integration)
    await teleportToMap(t.selectedMapId, t.x, t.y);
  },

  takeSnapshot: (name) => {
    // snapshot a minimal set of stores (namespaces listed in Integration)
    const snapshot = {
      game: getGameStateForSnapshot(),
      player: getPlayerStateForSnapshot(),
    };
    set(state => ({ stateView: { ...state.stateView, snapshots: { ...state.stateView.snapshots, [name]: snapshot } } }));
  },

  restoreSnapshot: (name) => {
    const snapshot = get().stateView.snapshots[name];
    if (!snapshot) return;
    restoreGameAndPlayerFromSnapshot(snapshot);
  },

  clearSnapshots: () => set(state => ({ stateView: { ...state.stateView, snapshots: {} } })),
});

API integration points (public helpers to expose from core modules)
------------------------------------------------------------------
- teleportToMap(mapId: string, x: number, y: number): Promise<void>
  - Responsibility: request the Scene/Router to transition to the given map and place the player at (x,y).
  - Implementation lives in src/core/scene or src/ui routing code; DevMode calls this helper.

- getGameStateForSnapshot(): any
  - Return a minimal serializable subset of game state for safe snapshotting (do NOT include large binary assets).

- restoreGameAndPlayerFromSnapshot(snapshot:any): void
  - Apply snapshot data to the relevant stores in a controlled manner.

Event handling & keyboard toggle
-------------------------------
Key design choices:
- Toggle overlay with Ctrl+D (on macOS use Meta+D optionally) — named constant to avoid magic strings.
- Respect input focus: ignore the toggle when document.activeElement is input/select/textarea or when contentEditable is true.
- Use a single, global keydown listener registered once (e.g., in src/App.tsx) when app mounts; the listener dispatches to the devMode slice only.

Concrete event strategy (pseudo):

const DEV_TOGGLE_KEYS = { ctrlKey: true, key: 'd' } // constant COMBO

function isTextInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || (el as HTMLElement).isContentEditable;
}

window.addEventListener('keydown', (e) => {
  // ignore repeated keydowns
  if (e.repeat) return;
  if (isTextInputFocused()) return;
  // Ctrl/Cmd+D toggle
  const ctrl = e.ctrlKey || e.metaKey; // support macOS Command
  if (ctrl && e.key.toLowerCase() === 'd') {
    e.preventDefault();
    // toggle visibility (do not enable by default)
    devModeSlice.setVisible(!devModeSlice.visible);
  }
  // Esc closes overlay if visible
  if (e.key === 'Escape' && devModeSlice.visible) {
    devModeSlice.setVisible(false);
  }
});

Notes:
- Use e.metaKey for macOS compatibility; guard behind a feature flag in prod builds.
- Keep key handling minimal; avoid adding global handlers for other dev actions to prevent conflicts.

Integration plan (minimal, concrete TODOs)
-----------------------------------------
Goal: implement with the least invasive changes and clear TODO markers so reviewers can follow.

1) Add a new state slice file (create):
   - Path: src/ui/state/devModeSlice.ts
   - Contents: export createDevModeSlice as above. Mark with TODOs to import core helpers.
   - Reason: keep dev-only state separate from production slices.

2) Mount the overlay conditionally in App component:
   - File: src/App.tsx
   - TODO location: near root component render (search for /* DevMode Mount */ or add new block)
   - Pseudo change: import useDevModeStore and <DevModeOverlay />; render overlay when devMode.enabled
   - Example snippet (non-invasive):
     {process.env.NODE_ENV !== 'production' && <DevModeOverlay />}

3) Add global key listener registration (single place):
   - File: src/App.tsx (inside top-level useEffect)
   - TODO: register keydown as described; use utility isTextInputFocused to avoid blocking inputs.

4) Implement UI component(s) — optional as separate PRs:
   - Path: src/ui/components/DevModeOverlay.tsx
   - Single component with internal tabs; keep small and use already existing UI primitives.
   - Make sure the overlay reads/writes only via devMode slice methods.

5) Core helpers for teleport and snapshot (expose safe APIs in core):
   - Files (suggested): src/core/scene/router.ts (teleport helper), src/store/gameStore.ts (snapshot helpers)
   - TODO comments: add export function teleportToMap(...) and getGameStateForSnapshot/restoreGameAndPlayerFromSnapshot

6) Safety checks & build-time gating
   - Wrap mounting code with process.env.NODE_ENV !== 'production' or a dedicated feature flag so production builds do not include the code.

Testing and verification
------------------------
- Manual: start dev server, press Ctrl+D to open overlay, toggle cheats, set teleport target and press Teleport Now.
- Automated: small unit tests for devMode slice methods (toggle, setCheat, snapshot) in tests/unit/devModeSlice.spec.ts.

TODO markers for reviewers
-------------------------
- TODO[DevModeSlice]: create src/ui/state/devModeSlice.ts — contains createDevModeSlice and small TODOs for core helper imports
- TODO[DevModeMount]: in src/App.tsx, add overlay mount + global key listener in top-level useEffect
- TODO[DevTeleport]: in core routing, export teleportToMap(mapId,x,y) for DevMode to call
- TODO[SnapshotHelpers]: export safe snapshot/restore helpers from store modules

Security & risks
----------------
- Risk: accidental enabling/persisting of cheats into player save data — mitigation: snapshots are stored only in-memory in devMode slice; add runtime assertion to prevent serialization into save files.
- Risk: keybinding conflicts — mitigation: only a single global Ctrl+D binding and guard when input has focus.

Final notes / conventions
-------------------------
- Use named constants for strings/keys (e.g., DEV_TOGGLE_COMBO = 'Ctrl+D') to avoid magic values.
- Keep DevMode UI read-only by default; require explicit toggles for destructive actions (restore snapshot should show a confirmation).
- All new code should be guarded to exclude production bundles (NODE_ENV checks) unless explicitly kept.

Prepared by: DevMode design (round summary)


