/**
 * Enemy group compositions
 * Simple mapping of group IDs to arrays of enemy IDs so encounters can reference pre-built groups.
 */

export const ENEMY_GROUPS: Record<string, readonly string[]> = {
  // Bandit ambush: two bandits plus a scavenger
  'bandit-ambush': ['bandit', 'bandit', 'scavenger'],

  // Wolf pack: three wolves
  'wolf-pack': ['venus-wolf', 'venus-wolf', 'venus-wolf'],

  // Golem duo: clay + iron golems
  'golem-duo': ['clay-golem', 'iron-golem'],
};
