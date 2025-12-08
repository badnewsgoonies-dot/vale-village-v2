# Battle Simulator

Headless battle simulation harness for Vale Village v2 balance testing.

## Overview

This simulator runs battles without the UI, using the pure deterministic battle system from `QueueBattleService`. It's designed for:

- Balance testing of unit stats and abilities
- Performance benchmarking
- Regression testing of battle mechanics
- Data collection for AI training

## Usage

### Basic Usage

```bash
npx tsx scripts/runBattleSimulator.ts --scenario "4v4" --strategy "basic-attack" --runs 100
```

### Parameters

- `--scenario <name>` - Battle scenario to run (default: "4v4")
  - `1v1` - Single unit vs single enemy
  - `2v2` - Two units vs two enemies
  - `4v4` - Full party vs four enemies
  - `boss` - Full party vs single boss (Overseer)

- `--strategy <type>` - AI strategy for player units (default: "basic-attack")
  - `basic-attack` - Always use basic attacks (no mana cost)
  - `optimal-ability` - Use first affordable ability, fallback to basic attack
  - `random` - Randomly choose between attacks and abilities

- `--runs <number>` - Number of simulations to run (default: 100)

### Examples

```bash
# Test boss balance with 50 runs
npx tsx scripts/runBattleSimulator.ts --scenario "boss" --strategy "optimal-ability" --runs 50

# Quick 1v1 test with basic attacks
npx tsx scripts/runBattleSimulator.ts --scenario "1v1" --strategy "basic-attack" --runs 10

# Full balance test with abilities
npx tsx scripts/runBattleSimulator.ts --scenario "4v4" --strategy "optimal-ability" --runs 200
```

## Output Metrics

The simulator tracks and reports:

- **Win Rate** - Percentage of player victories
- **Average Turns** - Mean number of rounds per battle
- **Damage Dealt** - Average damage dealt to enemies
- **Damage Taken** - Average damage received by player team
- **Mana Used** - Estimated total mana expenditure

## Architecture

### Core Components

- **battleSimulator.ts** - Main simulation engine
  - `runSimulation()` - Single battle execution
  - `runMultipleSimulations()` - Batch execution with aggregation
  - `queuePlayerActions()` - Strategy-based action selection

- **runBattleSimulator.ts** - CLI entry point

### Strategy System

Strategies determine how player units select actions:

1. **basic-attack**: Always queues basic attacks (null ability)
2. **optimal-ability**: Selects first affordable ability, ensuring mana budget
3. **random**: Randomly chooses between basic attacks and affordable abilities

### Deterministic Execution

All battles use seeded PRNGs for reproducibility:
- Base seed defaults to `Date.now()` but can be controlled
- Each simulation uses `baseSeed + runIndex` as its seed
- Same seed = same battle outcome (pure deterministic execution)

## Integration with Battle System

The simulator uses the production battle services:

- `QueueBattleService.ts` - Planning phase and round execution
- `BattleService.ts` - Battle initialization and action execution
- `PRNG` - Seeded random number generator for determinism

All battle logic is shared with the game - no mocks or test doubles.

## Adding New Scenarios

Edit the `scenarios` object in `runBattleSimulator.ts`:

```typescript
const scenarios: Record<string, { player: string[]; enemies: string[] }> = {
  'my-scenario': {
    player: ['adept', 'war-mage'],
    enemies: ['venus-bear', 'mars-bear'],
  },
};
```

Unit IDs come from:
- `src/data/definitions/units.ts` (player units)
- `src/data/definitions/enemies.ts` (enemies)

## Performance

The simulator can run hundreds of battles per second:
- ~200ms for 100 runs of 4v4 battles
- ~1s for 1000 runs

Bottlenecks are primarily in:
1. Action queueing (strategy selection)
2. Round execution (damage calculation)
3. State updates (immutable data structures)

## Future Enhancements

Potential improvements:

1. **Advanced Strategies**
   - Priority-based ability selection
   - Team composition awareness
   - Adaptive tactics based on battle state

2. **Detailed Metrics**
   - Per-unit performance tracking
   - Ability usage frequency
   - Status effect impact analysis
   - Turn-by-turn state capture

3. **Batch Analysis**
   - Statistical significance testing
   - Confidence intervals for win rates
   - Performance regression detection
   - CSV export for external analysis

4. **Custom Scenarios**
   - JSON-based scenario definitions
   - Dynamic unit composition
   - Equipment and Djinn configurations

## Troubleshooting

### TypeScript Errors

Ensure you're using the project's TypeScript config:
```bash
pnpm exec tsc --noEmit scripts/battleSimulator.ts
```

### Import Errors

The simulator requires all game code to be available. Build the project first if needed:
```bash
pnpm build:typecheck
```

### Unexpected Results

Check the battle state after execution:
```typescript
const result = runSimulation(playerUnits, enemies, strategy, seed);
console.log(result.finalState); // Inspect final battle state
```

## Related Documentation

- [Queue Battle System](../src/core/services/QueueBattleService.ts)
- [Battle Service](../src/core/services/BattleService.ts)
- [Unit Definitions](../src/data/definitions/units.ts)
- [Enemy Definitions](../src/data/definitions/enemies.ts)
