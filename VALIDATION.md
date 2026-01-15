# CI Validation Harness & Strategic Orchestration

This project includes a **Differential Validation Harness** that enforces strict invariants between the Simulation (Ground Truth) and the Driver (Runtime Reality). It serves as the "Strategic Orchestrator" for ensuring engine integrity.

## 3 Core Guarantees

1.  **Determinism Lock**: Same seed + same policy = exactly the same terminal state, metrics, and tick count. (Exit Code 1)
2.  **Sim↔Driver Differential**: The headless Simulator and the Browser Driver must match state *exactly* (within floating-point tolerance) at every tick. (Exit Code 2)
3.  **Policy Agnostic**: The harness accepts Random, Heuristic, or LLM-based policies.

## Strategic Orchestration Runbook

Orchestration is layered. Start at Tier 1, graduate to Tier 2, then Tier 3.

### Tier 1: Simulation-Only (Fast, Headless)
*No browser, no UI. Pure logic verification.*

**1. Sanity Check (Heuristic)**
Runs the simulator with a hardcoded heuristic policy.
```bash
npx ts-node validation/run_ci.ts --sim-only --policy heuristic --runs 10
```

**2. Fuzzing (Random)**
Runs 100 independent episodes with seeded RNG. Fails on nondeterminism or crashes.
```bash
npx ts-node validation/run_ci.ts --sim-only --policy random --runs 100 --fuzz
```

### Tier 2: Golden Traces (Regression Locking)
*Freeze reality to prevent regressions.*

**1. Record Traces**
Save successful episodes as portable JSON files in `validation/artifacts/traces/`.
```bash
npx ts-node validation/run_ci.ts --sim-only --policy heuristic --record-traces
```

**2. Replay Trace**
Verify the simulator hasn't regressed against a historical trace.
```bash
npx ts-node validation/run_ci.ts --replay-trace validation/artifacts/traces/trace_heuristic_123.json
```

### Tier 3: Differential Reality Lock (Sim ↔ Driver)
*Enforce parity between the Engine (Browser) and Truth (Sim).*

**1. Start the Game**
```bash
npm run dev
# Ensure game is running at http://localhost:5173
```

**2. Run Differential Harness**
Walks sim and browser in lockstep. Instant failure if states diverge.
```bash
npx ts-node validation/run_ci.ts --differential --policy heuristic --runs 20
```

### Tier 4: LLM / External Policy
*Plug in an agent to find exploits.*

**1. Start Policy Stub (or Real Agent)**
```bash
npx ts-node validation/llm_server_stub.ts
# OR start your Python agent at localhost:8765
```

**2. Run Harness with LLM Policy**
```bash
npx ts-node validation/run_ci.ts --policy llm --llm-endpoint http://localhost:8765 --runs 10
```

## Exit Codes

The harness is machine-readable for CI pipelines.

| Code | Meaning |
|------|---------|
| `0` | **Pass** |
| `1` | **Determinism Violation** (Flaky logic) |
| `2` | **Divergence** (Sim and Driver disagreed on state) |
| `3` | **Crash** (Exception thrown during episode) |
| `4` | **Configuration Error** |