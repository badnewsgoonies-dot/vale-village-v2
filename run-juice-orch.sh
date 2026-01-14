#!/bin/bash
# Vale Village v2 JUICE Orchestrator
# Focus: Feel, pacing, visual distinction - NOT new content
# Uses Copilot with gpt-5-mini, 2 lanes max, 10 phases

set -e
cd /home/geni/Documents/vale-village-v2

# Export model settings
export BRAIN_DECOMPOSER_MODEL=gpt-5-mini
export BRAIN_CRITIC_MODEL=gpt-5-mini
export LANE_RUNNER=copilot
export COPILOT_MODEL=gpt-5-mini
export MAX_LANES=2

LOG_FILE="juice-orch-$(date +%Y%m%d-%H%M%S).log"
OUTPUT_LOG="juice-orch-output.log"

echo "=== VALE VILLAGE V2 JUICE ORCHESTRATOR ===" | tee "$LOG_FILE" "$OUTPUT_LOG"
echo "Started: $(date)" | tee -a "$LOG_FILE" "$OUTPUT_LOG"
echo "Focus: FEEL & POLISH - not new content" | tee -a "$LOG_FILE" "$OUTPUT_LOG"
echo "Model: gpt-5-mini" | tee -a "$LOG_FILE" "$OUTPUT_LOG"
echo "Phases: 1-10" | tee -a "$LOG_FILE" "$OUTPUT_LOG"
echo "" | tee -a "$LOG_FILE" "$OUTPUT_LOG"

# Read encyclopedia context
ENCYCLOPEDIA_CONTEXT=$(cat docs/encyclopedia/INDEX.md docs/encyclopedia/ARCHITECTURE.md 2>/dev/null | head -400)

# Phase execution function
run_phase() {
    local phase_num=$1
    local phase_desc=$2

    echo "[PHASE $phase_num] $phase_desc" | tee -a "$LOG_FILE" "$OUTPUT_LOG"
    echo "Started: $(date)" | tee -a "$LOG_FILE" "$OUTPUT_LOG"

    # Build the prompt with context
    PROMPT="You are polishing Vale Village v2, a Golden Sun-inspired RPG.

## CRITICAL: This is a JUICE/POLISH pass - NO new content!
Focus on FEEL, PACING, VISUAL DISTINCTION.

## Encyclopedia Context:
$ENCYCLOPEDIA_CONTEXT

## Current Phase: $phase_num - $phase_desc

## Key Files for Reference:
- src/ui/components/BattleActionMenu.tsx - has ELEMENT_ICONS, TYPE_ICONS defined but unused
- src/data/definitions/units.ts - unit ability definitions with unlockLevel
- src/ui/styles/battle.css - battle styling

## Instructions:
1. Read the relevant source files FIRST
2. Make MINIMAL, surgical changes
3. Focus on visual/feel improvements only
4. Run typecheck: pnpm typecheck
5. Run tests: pnpm test --run
6. Commit with descriptive message

## Constraints:
- Do NOT add new game mechanics
- Do NOT add new enemies/abilities/items
- ONLY improve existing visual/UX
- Follow existing code patterns
- Keep changes focused on this phase only

Execute this phase now."

    # Run with model
    timeout 600 copilot --model gpt-5-mini \
        --allow-all-tools \
        --silent \
        --prompt "$PROMPT" 2>&1 | tee -a "$LOG_FILE" "$OUTPUT_LOG"

    echo "" | tee -a "$LOG_FILE" "$OUTPUT_LOG"
    echo "[PHASE $phase_num] Completed: $(date)" | tee -a "$LOG_FILE" "$OUTPUT_LOG"
    echo "---" | tee -a "$LOG_FILE" "$OUTPUT_LOG"

    # Brief pause between phases
    sleep 5
}

# Log to ORCH_JOURNAL
echo "" >> ORCH_JOURNAL.md
echo "## [JUICE SESSION START] $(date '+%Y-%m-%d %H:%M')" >> ORCH_JOURNAL.md
echo "**Goal:** Polish Vale Village v2 - feel, pacing, visual distinction" >> ORCH_JOURNAL.md
echo "**Model:** gpt-5-mini" >> ORCH_JOURNAL.md
echo "**Session ID:** juice-$(date +%s)" >> ORCH_JOURNAL.md

# JUICE Phase definitions - 10 focused polish phases
PHASES=(
    "1:Ability Visual Distinction - In BattleActionMenu.tsx AbilityGrid, replace ACTION_ICONS.abilities with element-based icons from ELEMENT_ICONS. Add colored border based on ability.element (Venus=amber, Mars=red, Mercury=blue, Jupiter=purple)"
    "2:Reduce Starter Abilities - In units.ts, change unlockLevel so each unit starts with only 2 abilities at L1. Spread remaining abilities across levels 2-6. Adept: Strike L1, Earth Spike L1, Stone Skin L3, Ice Lance L5, Aqua Heal L6"
    "3:Ability Menu Grouping - In BattleActionMenu.tsx, group abilities by element with headers. Add element star icon before each group header. Better spacing between groups"
    "4:Summon Menu Overhaul - In BattleActionMenu.tsx summon mode, show summon preview with sprite, name, element, power. Add cost display showing required djinn by element"
    "5:Screen Transitions - Add CSS fade/slide transitions (200-300ms) between major screens in App.tsx. Create transitions.css with fade-in, slide-up classes"
    "6:Battle Start Ceremony - In QueueBattleView.tsx, add 1-second Battle Start overlay when battle begins. Enemies should appear with slight delay/fade"
    "7:Turn Indicator Polish - In QueueBattleView.tsx, add clear turn banner showing current unit name. Add pulse/glow effect on active unit sprite"
    "8:Djinn Status Bar - Create DjinnStatusBar.tsx showing equipped djinn icons below each unit. Color code: Set=glowing, Standby=dim, Recovery=pulsing. Add to BattlefieldV2"
    "9:Victory Screen Polish - In VictoryScreen.tsx, add staggered reveal: Victory text, then XP gains slide in, then loot drops. Each line 200ms delay"
    "10:Tutorial Pacing - In dialogues.ts tutorial entries, add pause property for dramatic beats. In DialogueBox.tsx, respect pause delays before showing next line"
)

echo "Starting 10-phase juice polish..." | tee -a "$LOG_FILE" "$OUTPUT_LOG"

# Store PID for monitoring
echo $$ > .juice-orch.pid

for phase_entry in "${PHASES[@]}"; do
    phase_num="${phase_entry%%:*}"
    phase_desc="${phase_entry#*:}"
    run_phase "$phase_num" "$phase_desc"
done

echo "" | tee -a "$LOG_FILE" "$OUTPUT_LOG"
echo "=== JUICE POLISH COMPLETE ===" | tee -a "$LOG_FILE" "$OUTPUT_LOG"
echo "Finished: $(date)" | tee -a "$LOG_FILE" "$OUTPUT_LOG"

# Final journal entry
echo "" >> ORCH_JOURNAL.md
echo "## [JUICE SESSION END] $(date '+%Y-%m-%d %H:%M')" >> ORCH_JOURNAL.md
echo "**Status:** complete" >> ORCH_JOURNAL.md
echo "**Summary:** 10/10 juice phases executed" >> ORCH_JOURNAL.md

rm -f .juice-orch.pid
