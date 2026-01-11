# Research Notes — Memory-backed briefing

Generated: 2026-01-11T00:41:30Z
Source: /home/geni/swarm/memory mem-briefing & mem-semantic

---

## 1) Mem-briefing highlights (condensed)

- Recent decisions: focus on "he_is_coming" prototype (Python/Pygame parity, keep original assets/UI). Two recent agreed decisions recorded ~2h ago.
- Infrastructure notes: local Ollama/Codex CLI usage documented; some workers reported Linux box has no GPU (CPU-only) and Windows machine with GTX 1060 is used for model hosting.
- Known blockers: watch_vision run blocked (missing URL/prompt). Memory store size ~6737 entries; 561 new entries in last 24h.

## 2) Recent memory semantic hits (top items)
- repo_walk tools (tools/repo_walk.py) — deterministic repo inventory tooling exists in swarm memory.
- Several orch tasks completed: MenuStackRouter, InputLock improvements, HouseInterior spawn fixes, EarlyGameFlowController — many files under src/game and src/systems referenced.
- Task-level lessons: prefer memory-first workflows; record instrumentation and deterministic tests.

## 3) Recent decisions query (last 24h)
- he_is_coming: build a spiritual companion with gameplay parity feel, but avoid IP reuse; choice: agreed.
- he_is_coming: keep Python/Pygame parity for faster iteration, package later if needed; choice: agreed.

## 4) Key repo files & relevant code locations (quick map)
(These are the primary locations to inspect for strategic-phase-1 work)

- Overworld & rendering
  - src/ui/components/overworld-v2/OverworldV2.tsx
  - src/ui/components/overworld-v2/layers/*

- Core game logic & constants
  - src/core/constants.ts
  - src/constants/game.ts
  - src/core/models/BattleState.ts
  - src/core/services/BattleService.ts
  - src/core/services/QueueBattleService.ts
  - src/core/services/LevelNormalizationService.ts

- UI state & components
  - src/ui/state/ (battleSlice, queueBattleSlice, devModeSlice)
  - src/ui/components/* (BattleActionMenu, QueueBattleView, PauseMenu, etc.)

- Data validation & definitions
  - src/data/validateData.ts
  - src/data/definitions/{enemies,encounters,dialogues,maps}.ts

- Tests & tooling
  - tests/e2e/ (Playwright tests, e.g., gameplay-all-houses.spec.ts)
  - tools/ (repo_walk, instrumentation scripts referenced in memory)

These locations were repeatedly referenced in round notes and diffs (rounds 1–5).

## 5) Concrete external knowledge gaps (for later automated verification)
- Ollama/Codex deployment specifics: exact model names, memory/VRAM requirements, and CLI flags used in CI; verify which local models are required and whether Windows Ollama is reachable from CI runners.
- watch_vision dependencies and required upstream URLs/prompts (blocked run reported). Need canonical source and credential/access details.
- Any external design references for "Relics" or other content that were scraped into artifacts — provenance and licensing must be verified before reuse.
- Confirmation of GPU availability in target CI or developer machines for local model runs (some memory entries conflict about GPU presence).

## 6) Small actionable next steps (for worker handoff)
1. Record this briefing to swarm memory (decision/fact) noting where the notes were saved.  
2. Triage the watch_vision blocker: capture the missing URL/prompt and escalate if unavailable.  
3. Run a brief audit of the files listed in Section 4 to ensure no additional undocumented divergences exist between rounds 1–5 and main branch.

---

Notes produced from mem-briefing + mem-semantic outputs captured at generation time. This file is intended as a living handoff snapshot for strategic-phase-1 work.
