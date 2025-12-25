// [BT-RENTAL][BT-01] Rental Team Definitions for Battle Tower
// Pre-built, balanced teams for players without strong rosters

/**
 * Rental team configuration
 * Provides pre-built teams with equipment and djinn loadouts
 */
export interface RentalTeam {
  id: string;
  name: string;
  description: string;
  theme: 'balanced' | 'offensive' | 'defensive' | 'elemental' | 'specialized';
  element: 'Venus' | 'Mars' | 'Mercury' | 'Jupiter' | 'Mixed';
  unitIds: readonly string[];
  equipment?: Readonly<Record<string, readonly string[]>>; // unitId -> equipmentIds
  djinn?: Readonly<Record<string, readonly string[]>>; // unitId -> djinnIds
  recommendedForFloors: {
    readonly min: number;
    readonly max: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: readonly string[];
}

/**
 * Rental teams for Battle Tower
 * Provides pre-built, balanced teams for players without strong rosters
 *
 * Phase 1: 3 starter teams (beginner friendly)
 */
export const RENTAL_TEAMS: readonly RentalTeam[] = [
  // Beginner Team 1: Balanced Mixed Elements
  {
    id: 'rental-starter-balanced',
    name: 'Starter Squad',
    description:
      'Balanced team for beginners. Isaac leads with Garet providing damage and a Mystic for support.',
    theme: 'balanced',
    element: 'Mixed',
    unitIds: ['adept', 'war-mage', 'mystic'],
    equipment: {
      adept: ['bronze-sword', 'leather-vest', 'leather-cap'],
      'war-mage': ['bronze-mace', 'padded-armor', 'leather-gloves'],
      mystic: ['wooden-staff', 'cloth-robe', 'circlet'],
    },
    djinn: {
      adept: ['flint'], // Venus djinn for Earth adept
      'war-mage': ['forge'], // Mars djinn for Fire war-mage
    },
    recommendedForFloors: { min: 1, max: 10 },
    difficulty: 'beginner',
    tags: ['tutorial', 'balanced', 'mixed'],
  },

  // Beginner Team 2: Earth Defensive
  {
    id: 'rental-earth-defense',
    name: 'Earth Guardians',
    description:
      'Tanky Venus team focused on defense. High HP and DEF for sustained battles.',
    theme: 'defensive',
    element: 'Venus',
    unitIds: ['adept', 'sentinel', 'master-warrior'],
    equipment: {
      adept: ['iron-sword', 'iron-shield', 'iron-helm'],
      sentinel: ['war-hammer', 'knight-armor', 'guardian-ring'],
      'master-warrior': ['steel-blade', 'steel-armor', 'war-gloves'],
    },
    djinn: {
      adept: ['flint', 'granite'], // Flint for damage, Granite for DEF buff
      sentinel: ['quartz'], // Quartz for healing
    },
    recommendedForFloors: { min: 1, max: 15 },
    difficulty: 'beginner',
    tags: ['tank', 'venus', 'defensive'],
  },

  // Beginner Team 3: Fire Offensive
  {
    id: 'rental-fire-burst',
    name: 'Blaze Brigade',
    description:
      'Aggressive Mars team with high damage output. Glass cannon strategy - defeat enemies quickly.',
    theme: 'offensive',
    element: 'Mars',
    unitIds: ['war-mage', 'blaze', 'tyrell'],
    equipment: {
      'war-mage': ['flame-sword', 'fire-mail', 'burning-circlet'],
      blaze: ['inferno-axe', 'pyro-armor', 'ember-ring'],
      tyrell: ['magma-blade', 'molten-plate', 'phoenix-helm'],
    },
    djinn: {
      'war-mage': ['forge', 'kindle'], // High damage summons
      blaze: ['ember'], // Fire burst for single-target
    },
    recommendedForFloors: { min: 5, max: 20 },
    difficulty: 'intermediate',
    tags: ['dps', 'mars', 'offensive', 'burst'],
  },
] as const;

/**
 * Get all rental teams suitable for a floor number
 *
 * @param floorNumber - Current tower floor
 * @returns Array of rental teams available for this floor
 */
export function getRentalTeamsForFloor(floorNumber: number): readonly RentalTeam[] {
  return RENTAL_TEAMS.filter(
    team =>
      floorNumber >= team.recommendedForFloors.min &&
      floorNumber <= team.recommendedForFloors.max
  );
}

/**
 * Get rental teams by difficulty bracket
 *
 * @param difficulty - Difficulty level
 * @returns Array of rental teams for this difficulty
 */
export function getRentalTeamsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): readonly RentalTeam[] {
  return RENTAL_TEAMS.filter(team => team.difficulty === difficulty);
}

/**
 * Get a rental team by ID
 *
 * @param teamId - Rental team ID
 * @returns Rental team or null if not found
 */
export function getRentalTeamById(teamId: string): RentalTeam | null {
  return RENTAL_TEAMS.find(team => team.id === teamId) ?? null;
}

/**
 * Calculate how well a rental team matches player needs
 * Returns a score from 0-100
 *
 * @param team - Rental team to evaluate
 * @param floorNumber - Current tower floor
 * @param playerLevel - Player's average unit level
 * @returns Match score (0-100)
 */
export function calculateTeamMatchScore(
  team: RentalTeam,
  floorNumber: number,
  playerLevel: number
): number {
  let score = 0;

  // Floor match (0-40 points)
  const floorMid =
    (team.recommendedForFloors.min + team.recommendedForFloors.max) / 2;
  const floorDiff = Math.abs(floorNumber - floorMid);
  score += Math.max(0, 40 - floorDiff * 2);

  // Level appropriate (0-30 points)
  if (team.difficulty === 'beginner' && playerLevel < 10) {
    score += 30;
  } else if (
    team.difficulty === 'intermediate' &&
    playerLevel >= 10 &&
    playerLevel < 20
  ) {
    score += 30;
  } else if (team.difficulty === 'advanced' && playerLevel >= 20) {
    score += 30;
  } else {
    score += 10;
  }

  // Bonus for exact floor match (0-30 points)
  if (
    floorNumber >= team.recommendedForFloors.min &&
    floorNumber <= team.recommendedForFloors.max
  ) {
    score += 30;
  }

  return Math.min(100, score);
}

/**
 * Get recommended rental teams with explanations
 *
 * @param floorNumber - Current tower floor
 * @param playerLevel - Player's average unit level
 * @param limit - Maximum number of recommendations (default: 3)
 * @returns Array of recommendations with scores and reasons
 */
export interface RentalTeamRecommendation {
  team: RentalTeam;
  matchScore: number;
  reason: string;
}

export function getRecommendedRentalTeams(
  floorNumber: number,
  playerLevel: number,
  limit: number = 3
): readonly RentalTeamRecommendation[] {
  const availableTeams = getRentalTeamsForFloor(floorNumber);

  const recommendations = availableTeams.map(team => {
    const matchScore = calculateTeamMatchScore(team, floorNumber, playerLevel);
    let reason = '';

    if (team.difficulty === 'beginner') {
      reason = 'Great for learning tower mechanics';
    } else if (team.difficulty === 'intermediate') {
      reason = 'Balanced team for mid-tier floors';
    } else {
      reason = 'Optimized for challenging encounters';
    }

    if (team.theme === 'balanced') {
      reason += '. Versatile against all enemy types.';
    } else if (team.theme === 'offensive') {
      reason += '. High damage for quick victories.';
    } else if (team.theme === 'defensive') {
      reason += '. Sustainable for long battles.';
    }

    return {
      team,
      matchScore,
      reason,
    };
  });

  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
