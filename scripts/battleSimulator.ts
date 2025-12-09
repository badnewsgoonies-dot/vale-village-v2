import fs from 'node:fs';
import path from 'node:path';

import type { Unit, UnitDefinition } from '../src/core/models/Unit';
import type { Team } from '../src/core/models/Team';
import type { BattleState } from '../src/core/models/BattleState';
import type { Stats } from '../src/core/models/types';
import type { PRNG } from '../src/core/random/prng';
import { createUnit } from '../src/core/models/Unit';
import { createTeam } from '../src/core/models/Team';
import { startBattle } from '../src/core/services/BattleService';
import { executeRound, queueAction } from '../src/core/services/QueueBattleService';
import { makePRNG } from '../src/core/random/prng';
import { UNIT_DEFINITIONS } from '../src/data/definitions/units';
import { ENEMIES } from '../src/data/definitions/enemies';
import type { Enemy } from '../src/data/schemas/EnemySchema';

export type Strategy = 'basic-attack' | 'optimal-ability' | 'random';

export interface BattleMetrics {
  turns: number;
  damageDealt: number;
  damageTaken: number;
  manaUsed: number;
  abilitiesUsed: number;
  basicAttacksUsed: number;
  unitsKO: number;
  enemiesKO: number;
}

export interface SimulationResult {
  winner: 'player' | 'enemy' | 'draw';
  metrics: BattleMetrics;
  seed: number;
  rounds: number;
  finalState: BattleState;
}

export interface AggregatedResults {
  totalRuns: number;
  playerWins: number;
  enemyWins: number;
  draws: number;
  avgTurns: number;
  avgDamageDealt: number;
  avgDamageTaken: number;
  avgManaUsed: number;
  winRate: number;
  results: SimulationResult[];
}

/**
 * Create units from definitions
 */
function createUnitsFromIds(unitIds: string[], level: number = 1): Unit[] {
  const units: Unit[] = [];
  for (const id of unitIds) {
    const def = UNIT_DEFINITIONS[id];
    if (!def) {
      throw new Error(`Unknown unit: ${id}`);
    }
    // TypeScript needs explicit assertion for indexed Record access
    units.push(createUnit(def as UnitDefinition, level));
  }
  return units;
}

/**
 * Create enemy units from definitions
 */
function createEnemiesFromIds(enemyIds: string[]): Unit[] {
  return enemyIds.map(id => {
    const enemy = ENEMIES[id];
    if (!enemy) {
      throw new Error(`Unknown enemy: ${id}`);
    }
    // Ensure stats have all required fields
    const stats: Stats = {
      hp: enemy.stats.hp ?? 50,
      pp: enemy.stats.pp ?? 10,
      atk: enemy.stats.atk ?? 10,
      def: enemy.stats.def ?? 10,
      mag: enemy.stats.mag ?? 10,
      spd: enemy.stats.spd ?? 10,
    };
    // Convert enemy to unit format
    return {
      id: enemy.id,
      name: enemy.name,
      element: enemy.element,
      role: 'Balanced Warrior' as const, // Default role for enemies
      baseStats: stats,
      growthRates: {
        hp: 0,
        pp: 0,
        atk: 0,
        def: 0,
        mag: 0,
        spd: 0,
      },
      description: `Enemy: ${enemy.name}`,
      autoAttackTiming: 'same-turn' as const,
      manaContribution: 0,
      level: enemy.level,
      xp: 0,
      currentHp: stats.hp,
      equipment: {
        weapon: null,
        armor: null,
        helm: null,
        boots: null,
        accessory: null,
      },
      storeUnlocked: false,
      djinn: [],
      djinnStates: {},
      abilities: enemy.abilities,
      unlockedAbilityIds: enemy.abilities.map(a => a.id),
      statusEffects: [],
      actionsTaken: 0,
      battleStats: {
        damageDealt: 0,
        damageTaken: 0,
      },
    };
  });
}

/**
 * Queue actions for all player units based on strategy
 */
function queuePlayerActions(
  state: BattleState,
  strategy: Strategy,
  rng: PRNG
): BattleState {
  let currentState = state;

  for (let i = 0; i < state.playerTeam.units.length; i++) {
    const unit = state.playerTeam.units[i];
    if (!unit || unit.currentHp <= 0) continue;

    // Find valid target (first alive enemy)
    const aliveEnemies = currentState.enemies.filter(e => e.currentHp > 0);
    if (aliveEnemies.length === 0) break;

    const targetId = aliveEnemies[0]!.id;

    let abilityId: string | null = null;

    switch (strategy) {
      case 'basic-attack':
        // Always use basic attack (null ability)
        abilityId = null;
        break;

      case 'optimal-ability':
        // Use first available ability that we can afford
        const usableAbilities = unit.abilities.filter(ability => {
          const manaCost = ability.manaCost ?? 0;
          return manaCost <= currentState.remainingMana &&
                 unit.unlockedAbilityIds.includes(ability.id);
        });

        if (usableAbilities.length > 0) {
          // Just use first available for now (can be enhanced later)
          const chosen = usableAbilities[0];
          abilityId = chosen!.id;
        }
        break;

      case 'random':
        // Randomly choose between basic attack and abilities
        if (rng.next() > 0.5) {
          const usableAbilities = unit.abilities.filter(ability => {
            const manaCost = ability.manaCost ?? 0;
            return manaCost <= currentState.remainingMana &&
                   unit.unlockedAbilityIds.includes(ability.id);
          });
          if (usableAbilities.length > 0) {
            const idx = Math.floor(rng.next() * usableAbilities.length);
            abilityId = usableAbilities[idx]!.id;
          }
        }
        break;
    }

    // Find ability definition if needed
    const ability = abilityId ? unit.abilities.find(a => a.id === abilityId) : undefined;

    // Queue the action
    const result = queueAction(currentState, unit.id, abilityId, [targetId], ability);

    if (result.ok) {
      currentState = result.value;
    } else {
      // If we can't afford the ability, fall back to basic attack
      const fallbackResult = queueAction(currentState, unit.id, null, [targetId]);
      if (fallbackResult.ok) {
        currentState = fallbackResult.value;
      }
    }
  }

  return currentState;
}

/**
 * Calculate metrics from battle state
 */
function calculateMetrics(
  state: BattleState,
  initialState: BattleState,
  rounds: number
): BattleMetrics {
  // Calculate damage dealt based on enemy HP loss
  const initialEnemyHp = initialState.enemies.reduce((sum, e) => sum + e.currentHp, 0);
  const finalEnemyHp = state.enemies.reduce((sum, e) => sum + Math.max(0, e.currentHp), 0);
  const damageDealt = initialEnemyHp - finalEnemyHp;

  // Calculate damage taken based on player HP loss
  const initialPlayerHp = initialState.playerTeam.units.reduce((sum, u) => sum + u.currentHp, 0);
  const finalPlayerHp = state.playerTeam.units.reduce((sum, u) => sum + Math.max(0, u.currentHp), 0);
  const damageTaken = initialPlayerHp - finalPlayerHp;

  // Mana regenerates each round, so we can't easily track total used
  // For now, estimate based on max mana pool
  const manaUsed = rounds * state.maxMana;

  const unitsKO = state.playerTeam.units.filter(u => u.currentHp <= 0).length;
  const enemiesKO = state.enemies.filter(e => e.currentHp <= 0).length;

  // Rough estimates for action counts
  const totalPlayerActions = rounds * state.playerTeam.units.length;
  const abilitiesUsed = Math.floor(totalPlayerActions * 0.3); // Estimate 30% abilities
  const basicAttacksUsed = totalPlayerActions - abilitiesUsed;

  return {
    turns: rounds,
    damageDealt,
    damageTaken,
    manaUsed,
    abilitiesUsed,
    basicAttacksUsed,
    unitsKO,
    enemiesKO,
  };
}

/**
 * Run a single battle simulation
 */
export function runSimulation(
  playerUnitIds: string[],
  enemyIds: string[],
  strategy: Strategy,
  seed: number,
  maxRounds: number = 100,
  playerLevel: number = 1
): SimulationResult {
  // Create units and enemies
  const playerUnits = createUnitsFromIds(playerUnitIds, playerLevel);
  const enemies = createEnemiesFromIds(enemyIds);

  // Create team
  const team = createTeam(playerUnits);

  // Create PRNG
  const rng = makePRNG(seed);

  // Start battle
  const battleResult = startBattle(team, enemies, rng);
  if (!battleResult.ok) {
    throw new Error(`Failed to start battle`);
  }

  let state = battleResult.value;
  const initialState = battleResult.value; // Save initial state for metrics

  let rounds = 0;

  // Run battle loop
  while (state.phase !== 'victory' && state.phase !== 'defeat' && rounds < maxRounds) {
    // Queue actions for all player units
    state = queuePlayerActions(state, strategy, rng);

    // Execute round
    const { state: newState, events } = executeRound(state, rng);
    state = newState;
    rounds++;

    // Break if battle ended
    if (state.phase === 'victory' || state.phase === 'defeat') {
      break;
    }
  }

  // Determine winner
  let winner: 'player' | 'enemy' | 'draw';
  if (state.phase === 'victory') {
    winner = 'player';
  } else if (state.phase === 'defeat') {
    winner = 'enemy';
  } else {
    winner = 'draw'; // Max rounds reached
  }

  const metrics = calculateMetrics(state, initialState, rounds);

  return {
    winner,
    metrics,
    seed,
    rounds,
    finalState: state,
  };
}

/**
 * Run multiple simulations and aggregate results
 */
export function runMultipleSimulations(
  playerUnitIds: string[],
  enemyIds: string[],
  strategy: Strategy,
  runs: number,
  baseSeed: number = Date.now(),
  playerLevel: number = 1
): AggregatedResults {
  const results: SimulationResult[] = [];

  for (let i = 0; i < runs; i++) {
    const seed = baseSeed + i;
    const result = runSimulation(playerUnitIds, enemyIds, strategy, seed, 100, playerLevel);
    results.push(result);
  }

  // Aggregate stats
  const playerWins = results.filter(r => r.winner === 'player').length;
  const enemyWins = results.filter(r => r.winner === 'enemy').length;
  const draws = results.filter(r => r.winner === 'draw').length;

  const avgTurns = results.reduce((sum, r) => sum + r.metrics.turns, 0) / runs;
  const avgDamageDealt = results.reduce((sum, r) => sum + r.metrics.damageDealt, 0) / runs;
  const avgDamageTaken = results.reduce((sum, r) => sum + r.metrics.damageTaken, 0) / runs;
  const avgManaUsed = results.reduce((sum, r) => sum + r.metrics.manaUsed, 0) / runs;
  const winRate = (playerWins / runs) * 100;

  return {
    totalRuns: runs,
    playerWins,
    enemyWins,
    draws,
    avgTurns,
    avgDamageDealt,
    avgDamageTaken,
    avgManaUsed,
    winRate,
    results,
  };
}

/**
 * CLI entry point
 */
type ScenarioConfig = {
  id: string;
  name?: string;
  category?: string;
  playerUnits: string[];
  playerLevel?: number;
  enemyIds: string[];
  strategy?: Strategy;
  expectedWinRate?: [number, number];
  expectedTurns?: [number, number];
  notes?: string;
};

function writeOutputs(
  scenario: string,
  strategy: Strategy,
  runs: number,
  results: AggregatedResults,
  outJsonPath?: string,
  outMarkdownPath?: string
): void {
  const baseDir = path.resolve(__dirname, '..', 'docs', 'sims');
  const safeScenario = scenario.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeStrategy = strategy.replace(/[^a-zA-Z0-9_-]/g, '');

  const jsonPath = outJsonPath
    ? path.resolve(outJsonPath)
    : path.join(baseDir, `${safeScenario}-${safeStrategy}-${runs}.json`);
  const mdPath = outMarkdownPath
    ? path.resolve(outMarkdownPath)
    : path.join(baseDir, `${safeScenario}-${safeStrategy}-${runs}.md`);

  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });

  const summary = {
    scenario,
    strategy,
    runs: results.totalRuns,
    playerWins: results.playerWins,
    enemyWins: results.enemyWins,
    draws: results.draws,
    winRate: results.winRate,
    avgTurns: results.avgTurns,
    avgDamageDealt: results.avgDamageDealt,
    avgDamageTaken: results.avgDamageTaken,
    avgManaUsed: results.avgManaUsed,
  };

  fs.writeFileSync(
    jsonPath,
    JSON.stringify({ summary, results }, null, 2),
    'utf-8'
  );

  const mdLines = [
    `# Battle Simulation Results`,
    ``,
    `- Scenario: \`${scenario}\``,
    `- Strategy: \`${strategy}\``,
    `- Runs: ${results.totalRuns}`,
    ``,
    `## Win Rates`,
    `- Player Wins: ${results.playerWins} (${results.winRate.toFixed(1)}%)`,
    `- Enemy Wins: ${results.enemyWins}`,
    `- Draws: ${results.draws}`,
    ``,
    `## Averages`,
    `- Turns: ${results.avgTurns.toFixed(1)}`,
    `- Damage Dealt: ${results.avgDamageDealt.toFixed(1)}`,
    `- Damage Taken: ${results.avgDamageTaken.toFixed(1)}`,
    `- Mana Used: ${results.avgManaUsed.toFixed(1)}`,
    ``,
  ];

  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf-8');
}

function loadScenarioFile(filePath: string): Record<string, ScenarioConfig> | null {
  try {
    const resolved = path.resolve(process.cwd(), filePath);
    const raw = fs.readFileSync(resolved, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.scenarios)) {
      throw new Error('Invalid scenario file: missing scenarios array');
    }

    const map: Record<string, ScenarioConfig> = {};
    for (const scenario of parsed.scenarios) {
      if (!scenario?.id || !Array.isArray(scenario.playerUnits) || !Array.isArray(scenario.enemyIds)) {
        // Skip invalid entries quietly
        continue;
      }
      map[scenario.id] = {
        id: scenario.id,
        name: scenario.name,
        category: scenario.category,
        playerUnits: scenario.playerUnits,
        playerLevel: scenario.playerLevel,
        enemyIds: scenario.enemyIds,
        strategy: scenario.strategy as Strategy | undefined,
        expectedWinRate: scenario.expectedWinRate,
        expectedTurns: scenario.expectedTurns,
        notes: scenario.notes,
      };
    }

    return map;
  } catch (error) {
    console.warn(`Failed to load scenarios from ${filePath}:`, error);
    return null;
  }
}

function main() {
  const args = process.argv.slice(2);

  let scenario = '4v4';
  let strategy: Strategy = 'basic-attack';
  let runs = 100;
  let outJsonPath: string | undefined;
  let outMarkdownPath: string | undefined;
  let scenariosPath = 'docs/balance-scenarios.json';
  let strategyFromArg = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scenario' && args[i + 1]) {
      scenario = args[i + 1]!;
      i++;
    } else if (args[i] === '--strategy' && args[i + 1]) {
      strategy = args[i + 1] as Strategy;
      strategyFromArg = true;
      i++;
    } else if (args[i] === '--runs' && args[i + 1]) {
      runs = parseInt(args[i + 1]!, 10);
      i++;
    } else if (args[i] === '--out-json' && args[i + 1]) {
      outJsonPath = args[i + 1]!;
      i++;
    } else if (args[i] === '--out-md' && args[i + 1]) {
      outMarkdownPath = args[i + 1]!;
      i++;
    } else if (args[i] === '--scenarios' && args[i + 1]) {
      scenariosPath = args[i + 1]!;
      i++;
    }
  }

  // Define built-in fallback scenarios
  const fallbackScenarios: Record<string, ScenarioConfig> = {
    '1v1': {
      id: '1v1',
      playerUnits: ['adept'],
      enemyIds: ['venus-wolf'],
    },
    '2v2': {
      id: '2v2',
      playerUnits: ['adept', 'war-mage'],
      enemyIds: ['venus-wolf', 'mars-wolf'],
    },
    '4v4': {
      id: '4v4',
      playerUnits: ['adept', 'war-mage', 'mystic', 'ranger'],
      enemyIds: ['venus-wolf', 'mars-wolf', 'mercury-wolf', 'jupiter-wolf'],
    },
    'boss': {
      id: 'boss',
      playerUnits: ['adept', 'war-mage', 'mystic', 'ranger'],
      enemyIds: ['overseer'],
      strategy: 'optimal-ability',
    },
  };

  const loadedScenarios = loadScenarioFile(scenariosPath);
  const scenarios = loadedScenarios ?? fallbackScenarios;

  const selectedScenario = scenarios[scenario];
  if (!selectedScenario) {
    console.error(`Unknown scenario: ${scenario}`);
    console.error(`Available scenarios: ${Object.keys(scenarios).join(', ')}`);
    process.exit(1);
  }

  const chosenStrategy = strategyFromArg
    ? strategy
    : (selectedScenario.strategy ?? strategy);
  const playerLevel = selectedScenario.playerLevel ?? 1;

  console.log(`Running ${runs} simulations...`);
  console.log(`Scenario: ${scenario}`);
  if (selectedScenario.name) {
    console.log(`Name: ${selectedScenario.name}`);
  }
  if (selectedScenario.category) {
    console.log(`Category: ${selectedScenario.category}`);
  }
  console.log(`Strategy: ${chosenStrategy}`);
  console.log(`Player Level: ${playerLevel}`);
  console.log(`Player: ${selectedScenario.playerUnits.join(', ')}`);
  console.log(`Enemies: ${selectedScenario.enemyIds.join(', ')}`);
  console.log('');

  const results = runMultipleSimulations(
    selectedScenario.playerUnits,
    selectedScenario.enemyIds,
    chosenStrategy,
    runs,
    Date.now(),
    playerLevel
  );

  console.log('=== RESULTS ===');
  console.log(`Total Runs: ${results.totalRuns}`);
  console.log(`Player Wins: ${results.playerWins} (${results.winRate.toFixed(1)}%)`);
  console.log(`Enemy Wins: ${results.enemyWins}`);
  console.log(`Draws: ${results.draws}`);
  console.log('');
  console.log('=== AVERAGES ===');
  console.log(`Turns: ${results.avgTurns.toFixed(1)}`);
  console.log(`Damage Dealt: ${results.avgDamageDealt.toFixed(1)}`);
  console.log(`Damage Taken: ${results.avgDamageTaken.toFixed(1)}`);
  console.log(`Mana Used: ${results.avgManaUsed.toFixed(1)}`);

  try {
    writeOutputs(scenario, chosenStrategy, runs, results, outJsonPath, outMarkdownPath);
    console.log('');
    console.log(`Results written to docs/sims (or custom paths if provided).`);
  } catch (error) {
    console.warn('Failed to write simulation outputs:', error);
  }
}

// Export main for CLI usage
export { main };
