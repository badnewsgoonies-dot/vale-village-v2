#!/usr/bin/env python3
"""
Playwright Gameplay Agent v1 - Aligned with Driver Contract v1.0 (Frozen)

This agent:
- Uses explicit `terminal` signal (not flags.runComplete)
- Handles `DispatchResult` envelope (not void)
- Computes Fun Metrics from state deltas
- Is a STRESS TESTER, not MCTS (honest naming)

Architecture note:
- This runs on the REAL game via Playwright
- True MCTS requires a pure Simulator layer (not implemented yet)
- This is still valuable for: validation, metrics, CI gates

Usage:
    python playwright_agent_v1.py --url http://localhost:5173 --runs 20
"""

import argparse
import json
import statistics
import time
from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Optional

from playwright.sync_api import sync_playwright, Page


# ============================================================================
# Driver Contract v1.0 Communication
# ============================================================================

def get_state(page: Page) -> Dict[str, Any]:
    """Get pure state snapshot from Driver."""
    return page.evaluate("window.__GAME_DRIVER__.getState()")


def dispatch(page: Page, action: Dict[str, Any]) -> Dict[str, Any]:
    """
    Dispatch action and get DispatchResult.
    Returns: { ok: bool, notes?: string[], terminal: { kind, reason? } }
    """
    return page.evaluate(
        "window.__GAME_DRIVER__.dispatch(arguments[0])",
        action
    )


def reset_run(page: Page, seed: Optional[int] = None) -> None:
    """Reset episode with optional seed."""
    page.evaluate("window.__GAME_DRIVER__.resetRun(arguments[0])", seed)


def check_version(page: Page) -> str:
    """Verify driver version compatibility."""
    return page.evaluate("window.__GAME_DRIVER__.version")


# ============================================================================
# Terminal Helpers
# ============================================================================

def is_terminal(state: Dict[str, Any]) -> bool:
    """Check explicit terminal signal."""
    terminal = state.get("terminal", {})
    return terminal.get("kind") in ("win", "lose")


def terminal_kind(state: Dict[str, Any]) -> str:
    """Get terminal kind: 'running', 'win', or 'lose'."""
    return state.get("terminal", {}).get("kind", "running")


# ============================================================================
# Policy (Stress Tester - NOT MCTS)
# ============================================================================

def policy_random_uct(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Random UCT-style policy for stress testing.

    This is NOT real MCTS because:
    - We mutate real game state (no simulator)
    - No tree search, just heuristic sampling

    Honest name: random_stress_policy
    """
    import random

    player = state.get("player", {})
    world = state.get("world", {})

    # Dead? NOOP
    if player.get("hp", 0) <= 0:
        return {"type": "NOOP"}

    # Enemies exist? 50% attack, 50% move toward
    enemies = world.get("enemies", [])
    if enemies and random.random() < 0.5:
        return {"type": "ATTACK"}

    # Random movement for exploration
    dx = random.choice([-1, 0, 1])
    dy = random.choice([-1, 0, 1])
    return {"type": "MOVE", "dx": dx, "dy": dy}


# ============================================================================
# Episode Runner
# ============================================================================

@dataclass
class EpisodeResult:
    """Results from a single episode."""
    outcome: str  # 'win', 'lose', 'timeout'
    reason: Optional[str]
    duration_s: float
    ticks: int
    deaths_delta: int
    enemies_defeated_delta: int
    novelty_delta: int
    dispatch_errors: int


def run_episode(
    page: Page,
    seed: int,
    max_ticks: int = 1000,
    tick_sleep: float = 0.02
) -> EpisodeResult:
    """Run a single episode using Driver v1 contract."""

    # Reset with seed
    reset_run(page, seed)
    time.sleep(0.05)  # Let reset settle

    # Capture initial state
    s0 = get_state(page)
    deaths_start = s0["player"]["deaths"]
    enemies_start = s0.get("metrics", {}).get("enemiesDefeated", 0)
    novelty_start = s0.get("metrics", {}).get("novelty", 0)
    tick_start = s0["tick"]

    t0 = time.time()
    dispatch_errors = 0
    outcome = "timeout"
    reason = None

    for _ in range(max_ticks):
        state = get_state(page)

        # Check EXPLICIT terminal signal
        if is_terminal(state):
            outcome = terminal_kind(state)
            reason = state.get("terminal", {}).get("reason")
            break

        # Get action from policy
        action = policy_random_uct(state)

        # Dispatch and check result
        result = dispatch(page, action)
        if not result.get("ok", True):
            dispatch_errors += 1

        # Check terminal from dispatch result
        if result.get("terminal", {}).get("kind") in ("win", "lose"):
            outcome = result["terminal"]["kind"]
            reason = result["terminal"].get("reason")
            break

        time.sleep(tick_sleep)

    t1 = time.time()

    # Capture final state
    s1 = get_state(page)

    return EpisodeResult(
        outcome=outcome,
        reason=reason,
        duration_s=t1 - t0,
        ticks=s1["tick"] - tick_start,
        deaths_delta=s1["player"]["deaths"] - deaths_start,
        enemies_defeated_delta=s1.get("metrics", {}).get("enemiesDefeated", 0) - enemies_start,
        novelty_delta=s1.get("metrics", {}).get("novelty", 0) - novelty_start,
        dispatch_errors=dispatch_errors,
    )


# ============================================================================
# Fun Proxy Metrics (Math, not vibes)
# ============================================================================

def compute_fun_metrics(results: List[EpisodeResult]) -> Dict[str, Any]:
    """
    Compute Fun Proxy metrics from episode results.

    Formulas:
    - failure_rate = losses / total_episodes
    - pacing = enemies_defeated / total_time_minutes
    - novelty = avg(novelty_per_run)
    """
    if not results:
        return {"error": "no results"}

    def mean(xs: List[float]) -> float:
        return statistics.mean(xs) if xs else 0.0

    n = len(results)

    # Outcomes
    wins = sum(1 for r in results if r.outcome == "win")
    losses = sum(1 for r in results if r.outcome == "lose")
    timeouts = sum(1 for r in results if r.outcome == "timeout")

    # Rates
    win_rate = wins / n
    failure_rate = losses / n  # Explicit: losses, not deaths

    # Pacing: enemies per minute
    total_time_min = sum(r.duration_s for r in results) / 60.0
    total_enemies = sum(r.enemies_defeated_delta for r in results)
    pacing = total_enemies / max(total_time_min, 0.01)

    # Novelty: average per run
    avg_novelty = mean([r.novelty_delta for r in results])

    # Scoring (0-1)
    def score_failure(fr: float) -> float:
        """Target: 0.2-0.4"""
        if 0.2 <= fr <= 0.4:
            return 1.0
        if fr < 0.2:
            return fr / 0.2
        return max(0, 1 - (fr - 0.4) / 0.4)

    def score_pacing(p: float) -> float:
        """Target: 2-8 enemies/min"""
        if 2 <= p <= 8:
            return 1.0
        if p < 2:
            return p / 2
        return max(0, 1 - (p - 8) / 8)

    def score_novelty(n: float) -> float:
        """Target: >= 1 per run"""
        return min(1.0, n / 3) if n > 0 else 0.0

    fr_score = score_failure(failure_rate)
    pacing_score = score_pacing(pacing)
    novelty_score = score_novelty(avg_novelty)
    overall = (fr_score + pacing_score + novelty_score) / 3

    return {
        "episodes": n,
        "outcomes": {"wins": wins, "losses": losses, "timeouts": timeouts},
        "win_rate": round(win_rate, 3),

        "failure_rate": {
            "value": round(failure_rate, 3),
            "score": round(fr_score, 2),
            "assessment": _assess_failure(failure_rate),
        },

        "pacing": {
            "enemies_per_min": round(pacing, 2),
            "score": round(pacing_score, 2),
            "assessment": _assess_pacing(pacing),
        },

        "novelty": {
            "avg_per_run": round(avg_novelty, 2),
            "score": round(novelty_score, 2),
            "assessment": _assess_novelty(avg_novelty),
        },

        "overall_fun_score": round(overall, 2),

        "health": {
            "dispatch_errors": sum(r.dispatch_errors for r in results),
            "avg_ticks": round(mean([r.ticks for r in results]), 1),
            "avg_duration_s": round(mean([r.duration_s for r in results]), 2),
        },
    }


def _assess_failure(rate: float) -> str:
    if rate < 0.15:
        return "Too easy - buff enemies or add hazards"
    if rate > 0.50:
        return "Too hard - nerf damage or add health"
    return "Good challenge level"


def _assess_pacing(rate: float) -> str:
    if rate < 2:
        return "Boring - add more encounters"
    if rate > 8:
        return "Overwhelming - space out enemies"
    return "Good pacing"


def _assess_novelty(n: float) -> str:
    if n < 0.5:
        return "Repetitive - add new content types"
    return "Fresh content at good rate"


# ============================================================================
# Main
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description="Driver v1 Stress Tester")
    parser.add_argument("--url", default="http://localhost:5173")
    parser.add_argument("--runs", type=int, default=20)
    parser.add_argument("--max-ticks", type=int, default=1000)
    parser.add_argument("--tick-sleep", type=float, default=0.02)
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument("--headless", action="store_true")
    parser.add_argument("--output", help="Write JSON report")
    args = parser.parse_args()

    base_seed = args.seed if args.seed else int(time.time())

    print(f"[Agent v1] Driver Stress Tester")
    print(f"  URL: {args.url}")
    print(f"  Runs: {args.runs}")
    print(f"  Headless: {args.headless}")
    print(f"  Seed: {base_seed}")
    print()

    results: List[EpisodeResult] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=args.headless)
        page = browser.new_page()

        print(f"[Agent] Loading {args.url}...")
        page.goto(args.url, wait_until="networkidle")

        # Verify driver
        try:
            page.wait_for_function(
                "window.__GAME_DRIVER__ && window.__GAME_DRIVER__.version === 'v1'",
                timeout=10000
            )
            version = check_version(page)
            print(f"[Agent] Driver {version} detected")
        except Exception as e:
            print(f"[Agent] ERROR: Driver v1 not found: {e}")
            browser.close()
            return

        # Run episodes
        for i in range(args.runs):
            seed = base_seed + i
            result = run_episode(page, seed, args.max_ticks, args.tick_sleep)
            results.append(result)

            status = f"{result.outcome.upper()}"
            if result.reason:
                status += f" ({result.reason})"
            print(f"  [{i+1}/{args.runs}] {status} | {result.ticks} ticks | {result.duration_s:.1f}s")

        browser.close()

    # Compute and display metrics
    metrics = compute_fun_metrics(results)

    print()
    print("=" * 60)
    print("FUN METRICS REPORT (Driver v1)")
    print("=" * 60)

    print(f"\nOutcomes: {metrics['outcomes']['wins']}W / {metrics['outcomes']['losses']}L / {metrics['outcomes']['timeouts']}T")
    print(f"Win Rate: {metrics['win_rate']:.1%}")

    print(f"\nFailure Rate: {metrics['failure_rate']['value']:.1%} (score: {metrics['failure_rate']['score']}/1.0)")
    print(f"  {metrics['failure_rate']['assessment']}")

    print(f"\nPacing: {metrics['pacing']['enemies_per_min']:.1f}/min (score: {metrics['pacing']['score']}/1.0)")
    print(f"  {metrics['pacing']['assessment']}")

    print(f"\nNovelty: {metrics['novelty']['avg_per_run']:.1f}/run (score: {metrics['novelty']['score']}/1.0)")
    print(f"  {metrics['novelty']['assessment']}")

    print()
    print("=" * 60)
    print(f"OVERALL FUN SCORE: {metrics['overall_fun_score']:.2f}/1.0")
    print("=" * 60)

    if metrics["health"]["dispatch_errors"] > 0:
        print(f"\nWARNING: {metrics['health']['dispatch_errors']} dispatch errors")

    if args.output:
        output_data = {
            "driver_version": "v1",
            "config": {
                "url": args.url,
                "runs": args.runs,
                "max_ticks": args.max_ticks,
                "base_seed": base_seed,
            },
            "metrics": metrics,
            "episodes": [asdict(r) for r in results],
        }
        with open(args.output, "w") as f:
            json.dump(output_data, f, indent=2)
        print(f"\n[Agent] Report saved to {args.output}")


if __name__ == "__main__":
    main()
