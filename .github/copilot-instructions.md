# Copilot Instructions (vale-village-v2)

## Memory System - USE IT!

You have access to swarm memory at `/home/geni/swarm/memory`. Query it before starting work.

### Session Startup
```bash
# Get context briefing
python3 /home/geni/swarm/memory/mem-briefing.py

# Semantic search for your task
python3 /home/geni/swarm/memory/mem-semantic.py "your task topic" --limit 10

# Query recent decisions
/home/geni/swarm/memory/mem-db.sh query type=d recent=24h limit=10
```

### Record Your Work
```bash
# Record a decision
/home/geni/swarm/memory/mem-db.sh write type=d topic=VV2 text="Decided X because Y" choice=X

# Record a lesson learned
/home/geni/swarm/memory/mem-db.sh write type=L topic=VV2 text="Lesson: Always check X before Y"

# Record task result
/home/geni/swarm/memory/mem-db.sh write type=R topic=VV2 text="Fixed bug in X" choice=success
```

### Memory Types
| Type | Use for |
|------|---------|
| `d` | Decisions with rationale |
| `L` | Lessons learned |
| `R` | Task results |
| `f` | Facts discovered |
| `n` | General notes |

## Project Context

This is **vale-village-v2**, a Preact port of a Golden Sun-inspired RPG.

### Key Directories
- `src/ui/state/` - Zustand slices (battleSlice, towerSlice, etc.)
- `src/ui/components/` - Preact components
- `src/core/` - Game logic, models, algorithms
- `tests/e2e/` - Playwright tests

### Overworld Rendering
The live overworld uses **OverworldV2**:
- `src/ui/components/overworld-v2/OverworldV2.tsx`
- `src/ui/components/overworld-v2/layers/*`

### Commands
```bash
pnpm typecheck    # Check types
pnpm build        # Build
pnpm test         # Run tests
pnpm dev          # Dev server
```
