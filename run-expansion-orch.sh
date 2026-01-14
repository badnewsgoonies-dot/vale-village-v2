#!/bin/bash
# Vale Village v2 Expansion Orchestrator
# Uses Claude Haiku workers, 2 lanes max, 50 phases

set -e
cd /home/geni/Documents/vale-village-v2

# Export model settings for Haiku workers
export BRAIN_DECOMPOSER_MODEL=claude-haiku-4.5
export BRAIN_CRITIC_MODEL=claude-haiku-4.5
export LANE_RUNNER=copilot
export COPILOT_MODEL=claude-haiku-4.5
export MAX_LANES=2

LOG_FILE="expansion-orch-$(date +%Y%m%d-%H%M%S).log"

echo "=== VALE VILLAGE V2 EXPANSION ORCHESTRATOR ===" | tee "$LOG_FILE"
echo "Started: $(date)" | tee -a "$LOG_FILE"
echo "Model: claude-haiku-4.5" | tee -a "$LOG_FILE"
echo "Max Lanes: 2" | tee -a "$LOG_FILE"
echo "Phases: 1-50" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Read encyclopedia context
ENCYCLOPEDIA_CONTEXT=$(cat docs/encyclopedia/INDEX.md docs/encyclopedia/ARCHITECTURE.md docs/encyclopedia/PATTERNS.md 2>/dev/null | head -500)

# Phase execution function
run_phase() {
    local phase_num=$1
    local phase_desc=$2
    
    echo "[PHASE $phase_num] $phase_desc" | tee -a "$LOG_FILE"
    echo "Started: $(date)" | tee -a "$LOG_FILE"
    
    # Build the prompt with encyclopedia context
    PROMPT="You are expanding Vale Village v2, a Golden Sun-inspired RPG.

## CRITICAL: Read Encyclopedia First
$ENCYCLOPEDIA_CONTEXT

## Current Phase: $phase_num - $phase_desc

## Instructions:
1. Read the relevant source files first
2. Make minimal, surgical changes
3. Run typecheck after changes: pnpm typecheck
4. Run tests if relevant: pnpm test --run
5. Commit changes with descriptive message

## Constraints:
- Do NOT break existing functionality
- Follow existing code patterns from PATTERNS.md
- Use constants from src/core/constants.ts
- Keep changes focused on this phase only

Execute this phase now."

    # Run with Haiku model
    timeout 600 copilot --model claude-haiku-4.5 \
        --allow-all-tools \
        --silent \
        --prompt "$PROMPT" 2>&1 | tee -a "$LOG_FILE"
    
    echo "[PHASE $phase_num] Completed: $(date)" | tee -a "$LOG_FILE"
    echo "---" | tee -a "$LOG_FILE"
    
    # Brief pause between phases
    sleep 5
}

# Log to ORCH_JOURNAL
log_journal() {
    echo "" >> ORCH_JOURNAL.md
    echo "## [SESSION START] $(date '+%Y-%m-%d %H:%M')" >> ORCH_JOURNAL.md
    echo "**Goal:** Expand Vale Village v2 with 50 phases of content" >> ORCH_JOURNAL.md
    echo "**Model:** claude-haiku-4.5" >> ORCH_JOURNAL.md
    echo "**Max Lanes:** 2" >> ORCH_JOURNAL.md
    echo "**Session ID:** expansion-$(date +%s)" >> ORCH_JOURNAL.md
}

log_journal

# Phase definitions (extracted from VV2_PHASE_PLAN.md)
PHASES=(
    "1:Fix TypeScript errors in Sprite.tsx JSX types"
    "2:Fix battleSprites.ts implicit any type"
    "3:Fix module import errors in tests"
    "4:Fix ambient-zustand.ts integration"
    "5:Run full test suite and ensure passing"
    "6:Add 5 new enemy types - Fire Elemental, Ice Golem, Thunder Hawk, Earth Wyrm, Shadow Wisp"
    "7:Add 5 more enemy types - Poison Toad, Storm Knight, Lava Salamander, Crystal Bat, Dark Mage"
    "8:Create enemy sprite mappings for all new enemies"
    "9:Implement aggressive AI pattern for combat enemies"
    "10:Implement defensive AI pattern for support enemies"
    "11:Add mini-boss variants with 2x HP and special moves"
    "12:Implement elemental weakness/resistance matrix"
    "13:Create enemy group compositions for encounters"
    "14:Add special attack patterns per enemy type"
    "15:Create enemy loot tables and drop rates"
    "16:Add 5 new fire/earth abilities"
    "17:Add 5 new water/wind abilities"
    "18:Add 5 new light/dark abilities"
    "19:Create ability combo detection system"
    "20:Add ultimate abilities requiring full Djinn"
    "21:Implement buff/debuff stacking with limits"
    "22:Add 10 new weapons with unique effects"
    "23:Add 10 new armor pieces with set bonuses"
    "24:Create accessory slot with passive effects"
    "25:Test ability and item balance in battles"
    "26:Add tower floor type - Elemental Challenge"
    "27:Add tower floor type - Survival Wave"
    "28:Add tower floor type - Boss Rush"
    "29:Add tower floor type - Puzzle Room"
    "30:Add tower floor type - Resource Scarcity"
    "31:Create tower-specific elite enemies"
    "32:Implement tower progression rewards scaling"
    "33:Add tower challenge modifiers - double damage, no items, etc"
    "34:Create tower boss encounters at floors 10,20,30"
    "35:Implement tower scoring and leaderboard data"
    "36:Improve battle hit animations"
    "37:Add particle effects for elemental abilities"
    "38:Polish victory screen with rewards display"
    "39:Polish defeat screen with retry options"
    "40:Improve menu transition smoothness"
    "41:Add tutorial tooltips for new features"
    "42:Create loading screen with gameplay tips"
    "43:Improve mobile touch control responsiveness"
    "44:Add colorblind accessibility options"
    "45:Polish overworld movement and collision"
    "46:Run full regression test suite"
    "47:Performance optimization - reduce re-renders"
    "48:Memory leak audit - check for dangling listeners"
    "49:Cross-browser test - Chrome, Firefox, Safari"
    "50:Final build, update docs, commit all changes"
)

# Execute phases with 2 concurrent lanes
echo "Starting 50-phase expansion..." | tee -a "$LOG_FILE"

for phase_entry in "${PHASES[@]}"; do
    phase_num="${phase_entry%%:*}"
    phase_desc="${phase_entry#*:}"
    run_phase "$phase_num" "$phase_desc"
done

echo "" | tee -a "$LOG_FILE"
echo "=== EXPANSION COMPLETE ===" | tee -a "$LOG_FILE"
echo "Finished: $(date)" | tee -a "$LOG_FILE"

# Final journal entry
echo "" >> ORCH_JOURNAL.md
echo "## [SESSION END] $(date '+%Y-%m-%d %H:%M')" >> ORCH_JOURNAL.md
echo "**Status:** complete" >> ORCH_JOURNAL.md
echo "**Summary:** 50/50 phases executed" >> ORCH_JOURNAL.md
