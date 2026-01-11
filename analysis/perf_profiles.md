# Performance Profiles & Test Run Documentation

**Last Updated:** 2026-01-11
**Project:** Vale Village v2 (Golden Sun Game Client)

---

## Overview

This document provides test run profiles, performance characteristics, and optimization notes for the Vale Village v2 codebase. It covers unit test performance, E2E test execution patterns, build metrics, and performance observations from the recent run.

---

## Summary of Recent Test Run

- Unit tests: 291 passed | 9 todo
- Test run duration: ~66.8s (transform 18.5s, setup 34.3s, collect 27.5s, tests 5.3s)
- Many heavy service tests are skipped in quick runs; consider enabling RUN_HEAVY for full validation
- Notable fixes applied in state slices: queuedActions reset on new encounter in both battleSlice and queueBattleSlice to eliminate cross-battle leakage.

---

## Quick Recommendations

- Keep heavy E2E tests gated behind RUN_HEAVY to avoid CI slowdowns.
- Add a lightweight perf test that asserts average AI decision time and serialization latency to track regressions.
- Profile AIService and SaveService if tower-mode E2E runs approach CI timeouts.

---

## Known Performance Hotspots (high level)

1. AI decision-making (src/core/services/AIService.ts) — can dominate per-turn time in tower runs.
2. State serialization for replays/saves (src/core/services/SaveService.ts).
3. Asset loading and sprite parsing (vite + runtime).

---

## Next Actions

- Add a small benchmark test for AI decisions and SaveService serialization.
- Track timing metrics in CI (simple telemetry to a JSON artifact) to detect regressions.

---

Document version: 1.0

Maintainer: Vale Village Development Team
