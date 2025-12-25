# CODEX.md

This file provides guidance to Codex when working with code in this repository.

## Memory System - USE IT!

You have MCP memory tools available. **Use them proactively** to maintain context across sessions.

### Session Startup - Query First
Before starting work, check what's already known:
```
memory_query(type="d", recent="24h", limit=10)   # Recent decisions
memory_query(type="L", topic="VV2", limit=10)    # Lessons learned
memory_semantic("your task topic here")          # Semantic search
memory_briefing()                                # Full context briefing
```

### As You Work - Record Insights
Don't batch these - write them as you discover them:

**Decisions** (when you choose an approach):
```
memory_write(type="d", topic="VV2", text="Decided to use X instead of Y", choice="X", rationale="Because...")
```

**Lessons** (when you learn something reusable):
```
memory_write(type="L", topic="VV2", text="Lesson: Always check deriveUIPhase before assuming battle state")
```

**Facts** (when you discover important info):
```
memory_write(type="f", topic="VV2", text="queueBattleSlice.setBattle does NOT clear queuedActions")
```

### After Completing Work - Record Results
```
memory_write(type="R", topic="VV2", text="Fixed ability locking bug in BattleActionMenu", task_id="...", choice="success")
memory_write(type="L", topic="VV2", text="Lesson: Djinn tracker state check was inverted - should be === 'Set' not !== 'Set'")
```

### Memory Types Quick Reference
| Type | Letter | Use for |
|------|--------|---------|
| Decision | `d` | Choices made with rationale |
| Lesson | `L` | Reusable learnings |
| Result | `R` | Task outcomes |
| Fact | `f` | Discovered information |
| Note | `n` | General observations |
| Action | `a` | Things done |

### Why This Matters
- Other agents and future sessions can learn from your discoveries
- Prevents re-investigating the same issues
- Builds institutional knowledge about the codebase
- Your debugging insights are valuable - don't lose them!

## Project Context

This is **vale-village-v2**, a Preact port of a Golden Sun-inspired RPG. Key areas:

- `src/ui/state/` - Zustand slices (battleSlice, towerSlice, etc.)
- `src/ui/components/` - Preact components
- `src/core/` - Game logic, models, algorithms
- `tests/e2e/` - Playwright tests

### Common Issues to Watch For
1. **Battle state leakage** - queuedActions not cleared between battles
2. **deriveUIPhase** - Can return unexpected phases based on unit KO status
3. **Djinn tracker state** - 'Set' vs 'Standby' vs 'Recovery' affects ability availability
4. **Type safety** - strict mode is on, Zod inference can be tricky

## Commands
```bash
pnpm typecheck    # Check types
pnpm build        # Build
pnpm test         # Run tests
pnpm dev          # Dev server
```
