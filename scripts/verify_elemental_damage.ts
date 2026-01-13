
import { runMultipleSimulations } from './battleSimulator';

// Scenario: Adept (Venus) vs Overseer (Jupiter) -> Venus > Jupiter
const PLAYER_UNIT = 'adept'; 
const ENEMY_UNIT = 'overseer';
const RUNS = 10;

console.log(`Running Verification: ${PLAYER_UNIT} vs ${ENEMY_UNIT} for ${RUNS} runs.`);

const results = runMultipleSimulations(
  [PLAYER_UNIT],
  [ENEMY_UNIT],
  'optimal-ability', // Use abilities to trigger elemental damage
  RUNS
);

console.log(`Average Damage Dealt: ${results.avgDamageDealt.toFixed(2)}`);
