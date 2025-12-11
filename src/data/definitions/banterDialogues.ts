/**
 * Inter-Unit Banter Dialogues
 *
 * Short character-building exchanges between party members.
 * Triggered by party composition and progression milestones.
 *
 * Banter types:
 * - combat: Triggered before/after battles based on party
 * - overworld: Random when exploring with specific party
 * - milestone: Triggered at story milestones
 */
import type { DialogueTree } from '../schemas/DialogueSchema';

// ============================================================================
// COMBAT BANTER - Short pre-battle quips based on party composition
// ============================================================================

export const BANTER_ISAAC_SENTINEL_TEAMWORK: DialogueTree = {
  id: 'banter-isaac-sentinel-teamwork',
  name: 'Isaac & Sentinel Teamwork',
  startNodeId: 'sentinel-quip',
  nodes: [
    {
      id: 'sentinel-quip',
      speaker: 'Sentinel',
      text: 'You take left, I take right?',
      portrait: 'sentinel',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: 'Just like always. Ready when you are.',
      portrait: 'isaac',
    },
  ],
};

export const BANTER_SENTINEL_EARTH_PRIDE: DialogueTree = {
  id: 'banter-sentinel-earth-pride',
  name: 'Sentinel Earth Pride',
  startNodeId: 'sentinel-boast',
  nodes: [
    {
      id: 'sentinel-boast',
      speaker: 'Sentinel',
      text: 'Venus Adepts are the foundation of any team. Literally.',
      portrait: 'sentinel',
      nextNodeId: 'isaac-eyeroll',
    },
    {
      id: 'isaac-eyeroll',
      speaker: 'Isaac',
      text: '*sighs* I heard this one yesterday, Sentinel.',
      portrait: 'isaac',
      nextNodeId: 'sentinel-defense',
    },
    {
      id: 'sentinel-defense',
      speaker: 'Sentinel',
      text: "It's true though! We're GROUNDED.",
      portrait: 'sentinel',
    },
  ],
};

export const BANTER_STORMCALLER_IMPATIENT: DialogueTree = {
  id: 'banter-stormcaller-impatient',
  name: 'Stormcaller Impatient',
  startNodeId: 'stormcaller-fidget',
  nodes: [
    {
      id: 'stormcaller-fidget',
      speaker: 'Stormcaller',
      text: 'Can we hurry this up? My lightning is getting... antsy.',
      portrait: 'stormcaller',
      nextNodeId: 'sentinel-caution',
    },
    {
      id: 'sentinel-caution',
      speaker: 'Sentinel',
      text: 'Patience. A good defense requires-',
      portrait: 'sentinel',
      nextNodeId: 'stormcaller-cut-off',
    },
    {
      id: 'stormcaller-cut-off',
      speaker: 'Stormcaller',
      text: "BORING. Let's just ZAP them already!",
      portrait: 'stormcaller',
    },
  ],
};

export const BANTER_FULL_PARTY_READY: DialogueTree = {
  id: 'banter-full-party-ready',
  name: 'Full Party Ready',
  startNodeId: 'isaac-rally',
  nodes: [
    {
      id: 'isaac-rally',
      speaker: 'Isaac',
      text: 'Three Adepts together. This should be interesting.',
      portrait: 'isaac',
      nextNodeId: 'sentinel-steady',
    },
    {
      id: 'sentinel-steady',
      speaker: 'Sentinel',
      text: "I'll hold the line. You two handle the offense.",
      portrait: 'sentinel',
      nextNodeId: 'stormcaller-eager',
    },
    {
      id: 'stormcaller-eager',
      speaker: 'Stormcaller',
      text: "Music to my ears! Let's make some thunder!",
      portrait: 'stormcaller',
    },
  ],
};

// ============================================================================
// OVERWORLD BANTER - Random exploration dialogue
// ============================================================================

export const BANTER_SENTINEL_VILLAGE_MEMORY: DialogueTree = {
  id: 'banter-sentinel-village-memory',
  name: 'Sentinel Village Memory',
  startNodeId: 'sentinel-remember',
  nodes: [
    {
      id: 'sentinel-remember',
      speaker: 'Sentinel',
      text: 'I remember when this village was peaceful. Before the Overseer...',
      portrait: 'sentinel',
      nextNodeId: 'isaac-comfort',
    },
    {
      id: 'isaac-comfort',
      speaker: 'Isaac',
      text: "We'll restore it. One house at a time.",
      portrait: 'isaac',
      nextNodeId: 'sentinel-grateful',
    },
    {
      id: 'sentinel-grateful',
      speaker: 'Sentinel',
      text: "Thank you, Isaac. It means more than you know.",
      portrait: 'sentinel',
    },
  ],
};

export const BANTER_STORMCALLER_WEATHER: DialogueTree = {
  id: 'banter-stormcaller-weather',
  name: 'Stormcaller Weather Talk',
  startNodeId: 'stormcaller-sense',
  nodes: [
    {
      id: 'stormcaller-sense',
      speaker: 'Stormcaller',
      text: "Storm's coming. I can feel it in my fingertips.",
      portrait: 'stormcaller',
      nextNodeId: 'sentinel-skeptical',
    },
    {
      id: 'sentinel-skeptical',
      speaker: 'Sentinel',
      text: "It's been sunny for three days.",
      portrait: 'sentinel',
      nextNodeId: 'stormcaller-dramatic',
    },
    {
      id: 'stormcaller-dramatic',
      speaker: 'Stormcaller',
      text: "*wiggles fingers* The storm is ME, Sentinel. I AM the weather.",
      portrait: 'stormcaller',
      nextNodeId: 'isaac-amused',
    },
    {
      id: 'isaac-amused',
      speaker: 'Isaac',
      text: '*holds back laughter* Very dramatic.',
      portrait: 'isaac',
    },
  ],
};

export const BANTER_ISAAC_LEADERSHIP: DialogueTree = {
  id: 'banter-isaac-leadership',
  name: 'Isaac Leadership',
  startNodeId: 'sentinel-question',
  nodes: [
    {
      id: 'sentinel-question',
      speaker: 'Sentinel',
      text: "Isaac, how do you stay so calm? I've seen veterans crack under less pressure.",
      portrait: 'sentinel',
      nextNodeId: 'isaac-honest',
    },
    {
      id: 'isaac-honest',
      speaker: 'Isaac',
      text: "Honestly? I'm terrified. But someone has to keep moving forward.",
      portrait: 'isaac',
      nextNodeId: 'stormcaller-respect',
    },
    {
      id: 'stormcaller-respect',
      speaker: 'Stormcaller',
      text: "That's... actually pretty inspiring. Don't let it go to your head.",
      portrait: 'stormcaller',
    },
  ],
};

// ============================================================================
// MILESTONE BANTER - Story progression moments
// ============================================================================

export const BANTER_HALFWAY_POINT: DialogueTree = {
  id: 'banter-halfway-point',
  name: 'Halfway Point',
  startNodeId: 'isaac-count',
  nodes: [
    {
      id: 'isaac-count',
      speaker: 'Isaac',
      text: 'Ten houses down. Ten more to go.',
      portrait: 'isaac',
      nextNodeId: 'sentinel-encourage',
    },
    {
      id: 'sentinel-encourage',
      speaker: 'Sentinel',
      text: "Halfway there. We're actually doing this.",
      portrait: 'sentinel',
      nextNodeId: 'stormcaller-hype',
    },
    {
      id: 'stormcaller-hype',
      speaker: 'Stormcaller',
      text: "Halfway? That means we're also halfway to celebrating! I call dibs on the victory feast!",
      portrait: 'stormcaller',
    },
  ],
};

export const BANTER_NEAR_END: DialogueTree = {
  id: 'banter-near-end',
  name: 'Near the End',
  startNodeId: 'sentinel-serious',
  nodes: [
    {
      id: 'sentinel-serious',
      speaker: 'Sentinel',
      text: "The Overseer's house is next. I can feel the darkness from here.",
      portrait: 'sentinel',
      nextNodeId: 'stormcaller-focused',
    },
    {
      id: 'stormcaller-focused',
      speaker: 'Stormcaller',
      text: '*unusually serious* No jokes this time. This is what we trained for.',
      portrait: 'stormcaller',
      nextNodeId: 'isaac-final',
    },
    {
      id: 'isaac-final',
      speaker: 'Isaac',
      text: "Win or lose, we do this together. I couldn't ask for better allies.",
      portrait: 'isaac',
      nextNodeId: 'sentinel-bond',
    },
    {
      id: 'sentinel-bond',
      speaker: 'Sentinel',
      text: "Friends, Isaac. We're friends.",
      portrait: 'sentinel',
    },
  ],
};

export const BANTER_VICTORY: DialogueTree = {
  id: 'banter-victory',
  name: 'Victory Celebration',
  startNodeId: 'stormcaller-celebrate',
  nodes: [
    {
      id: 'stormcaller-celebrate',
      speaker: 'Stormcaller',
      text: "WE DID IT! THE OVERSEER IS DONE! Who's ready to PARTY?!",
      portrait: 'stormcaller',
      nextNodeId: 'sentinel-relief',
    },
    {
      id: 'sentinel-relief',
      speaker: 'Sentinel',
      text: "*exhales* I honestly didn't know if we'd make it. But we did. Together.",
      portrait: 'sentinel',
      nextNodeId: 'isaac-gratitude',
    },
    {
      id: 'isaac-gratitude',
      speaker: 'Isaac',
      text: "I couldn't have done any of this alone. Thank you both. For everything.",
      portrait: 'isaac',
      nextNodeId: 'stormcaller-tearful',
    },
    {
      id: 'stormcaller-tearful',
      speaker: 'Stormcaller',
      text: "*sniff* Okay NOW I'm getting emotional. Group hug?",
      portrait: 'stormcaller',
      nextNodeId: 'sentinel-reluctant',
    },
    {
      id: 'sentinel-reluctant',
      speaker: 'Sentinel',
      text: '*sighs* ...Fine. Just this once.',
      portrait: 'sentinel',
    },
  ],
};

// ============================================================================
// BANTER TRIGGERS - Maps conditions to banter dialogues
// ============================================================================

export interface BanterTrigger {
  id: string;
  requiredParty: string[]; // Unit IDs that must be present
  minHousesLiberated?: number; // Minimum houses freed
  maxHousesLiberated?: number; // Maximum houses freed (for early game banter)
  chance: number; // 0-1 probability when conditions met
  context: 'combat' | 'overworld' | 'milestone';
}

export const BANTER_TRIGGERS: BanterTrigger[] = [
  // Combat banter
  {
    id: 'banter-isaac-sentinel-teamwork',
    requiredParty: ['isaac', 'sentinel'],
    chance: 0.15,
    context: 'combat',
  },
  {
    id: 'banter-sentinel-earth-pride',
    requiredParty: ['isaac', 'sentinel'],
    minHousesLiberated: 9,
    chance: 0.1,
    context: 'combat',
  },
  {
    id: 'banter-stormcaller-impatient',
    requiredParty: ['stormcaller'],
    minHousesLiberated: 15,
    chance: 0.12,
    context: 'combat',
  },
  {
    id: 'banter-full-party-ready',
    requiredParty: ['isaac', 'sentinel', 'stormcaller'],
    minHousesLiberated: 16,
    chance: 0.2,
    context: 'combat',
  },

  // Overworld banter
  {
    id: 'banter-sentinel-village-memory',
    requiredParty: ['isaac', 'sentinel'],
    minHousesLiberated: 8,
    maxHousesLiberated: 14,
    chance: 0.08,
    context: 'overworld',
  },
  {
    id: 'banter-stormcaller-weather',
    requiredParty: ['sentinel', 'stormcaller'],
    minHousesLiberated: 15,
    chance: 0.1,
    context: 'overworld',
  },
  {
    id: 'banter-isaac-leadership',
    requiredParty: ['isaac', 'sentinel', 'stormcaller'],
    minHousesLiberated: 17,
    chance: 0.15,
    context: 'overworld',
  },

  // Milestone banter (higher chance, one-time triggers)
  {
    id: 'banter-halfway-point',
    requiredParty: ['isaac'],
    minHousesLiberated: 10,
    maxHousesLiberated: 10,
    chance: 1.0, // Always triggers at exactly house 10
    context: 'milestone',
  },
  {
    id: 'banter-near-end',
    requiredParty: ['isaac', 'sentinel', 'stormcaller'],
    minHousesLiberated: 19,
    maxHousesLiberated: 19,
    chance: 1.0, // Always triggers at house 19
    context: 'milestone',
  },
  {
    id: 'banter-victory',
    requiredParty: ['isaac'],
    minHousesLiberated: 20,
    chance: 1.0, // Always triggers after final victory
    context: 'milestone',
  },

  // New combat banter triggers
  {
    id: 'banter-mars-duo',
    requiredParty: ['war-mage', 'blaze'],
    chance: 0.15,
    context: 'combat',
  },
  {
    id: 'banter-mercury-mystic-calm',
    requiredParty: ['mystic', 'isaac'],
    minHousesLiberated: 4,
    chance: 0.1,
    context: 'combat',
  },
  {
    id: 'banter-ranger-first-strike',
    requiredParty: ['ranger', 'sentinel'],
    minHousesLiberated: 6,
    chance: 0.12,
    context: 'combat',
  },
  {
    id: 'banter-felix-reunion',
    requiredParty: ['isaac', 'felix'],
    minHousesLiberated: 17,
    chance: 0.2,
    context: 'combat',
  },
  {
    id: 'banter-karis-wind-sense',
    requiredParty: ['karis', 'stormcaller'],
    minHousesLiberated: 11,
    chance: 0.15,
    context: 'combat',
  },
  {
    id: 'banter-tyrell-eager',
    requiredParty: ['tyrell', 'mystic'],
    minHousesLiberated: 14,
    chance: 0.12,
    context: 'combat',
  },
  {
    id: 'banter-djinn-chatter',
    requiredParty: ['isaac'],
    minHousesLiberated: 1,
    maxHousesLiberated: 5,
    chance: 0.08,
    context: 'combat',
  },
  {
    id: 'banter-boss-intimidation',
    requiredParty: ['isaac', 'sentinel', 'ranger', 'blaze'],
    minHousesLiberated: 12,
    chance: 0.2,
    context: 'combat',
  },

  // New overworld banter triggers
  {
    id: 'banter-supplies-low',
    requiredParty: ['mystic', 'war-mage'],
    minHousesLiberated: 5,
    chance: 0.08,
    context: 'overworld',
  },
  {
    id: 'banter-djinn-collection',
    requiredParty: ['isaac', 'ranger'],
    minHousesLiberated: 8,
    chance: 0.1,
    context: 'overworld',
  },
  {
    id: 'banter-night-watch',
    requiredParty: ['isaac', 'sentinel'],
    minHousesLiberated: 10,
    chance: 0.1,
    context: 'overworld',
  },
];

// ============================================================================
// ADDITIONAL COMBAT BANTER - Element-based team interactions
// ============================================================================

export const BANTER_MARS_DUO: DialogueTree = {
  id: 'banter-mars-duo',
  name: 'Mars Duo Fire',
  startNodeId: 'blaze-hype',
  nodes: [
    {
      id: 'blaze-hype',
      speaker: 'Blaze',
      text: 'Two Mars Adepts? This is going to get HOT!',
      portrait: 'blaze',
      nextNodeId: 'warmage-agree',
    },
    {
      id: 'warmage-agree',
      speaker: 'War Mage',
      text: "Let's show them what double the fire means!",
      portrait: 'garet',
    },
  ],
};

export const BANTER_MERCURY_MYSTIC_CALM: DialogueTree = {
  id: 'banter-mercury-mystic-calm',
  name: 'Mystic Calm Before Storm',
  startNodeId: 'mystic-calm',
  nodes: [
    {
      id: 'mystic-calm',
      speaker: 'Mystic',
      text: '*deep breath* Water flows. Water adapts. Water wins.',
      portrait: 'mystic',
      nextNodeId: 'isaac-curious',
    },
    {
      id: 'isaac-curious',
      speaker: 'Isaac',
      text: 'Is that a Mercury Adept thing?',
      portrait: 'isaac',
      nextNodeId: 'mystic-smile',
    },
    {
      id: 'mystic-smile',
      speaker: 'Mystic',
      text: '*small smile* It helps me focus. You should try it.',
      portrait: 'mystic',
    },
  ],
};

export const BANTER_RANGER_FIRST_STRIKE: DialogueTree = {
  id: 'banter-ranger-first-strike',
  name: 'Ranger First Strike',
  startNodeId: 'ranger-ready',
  nodes: [
    {
      id: 'ranger-ready',
      speaker: 'Ranger',
      text: '*draws bow* I go first. Always. Speed is everything.',
      portrait: 'ranger',
      nextNodeId: 'sentinel-counter',
    },
    {
      id: 'sentinel-counter',
      speaker: 'Sentinel',
      text: 'And what happens if they survive your first shot?',
      portrait: 'sentinel',
      nextNodeId: 'ranger-confident',
    },
    {
      id: 'ranger-confident',
      speaker: 'Ranger',
      text: "Then I take a second. And a third. I don't miss.",
      portrait: 'ranger',
    },
  ],
};

export const BANTER_FELIX_REUNION: DialogueTree = {
  id: 'banter-felix-reunion',
  name: 'Felix Reunion',
  startNodeId: 'felix-nostalgia',
  nodes: [
    {
      id: 'felix-nostalgia',
      speaker: 'Felix',
      text: "Remember when we used to spar in the training grounds, Isaac?",
      portrait: 'felix',
      nextNodeId: 'isaac-remember',
    },
    {
      id: 'isaac-remember',
      speaker: 'Isaac',
      text: "You always won. You were faster, stronger...",
      portrait: 'isaac',
      nextNodeId: 'felix-correction',
    },
    {
      id: 'felix-correction',
      speaker: 'Felix',
      text: "But you never gave up. That's why you're leading this liberation. Not me.",
      portrait: 'felix',
    },
  ],
};

export const BANTER_KARIS_WIND_SENSE: DialogueTree = {
  id: 'banter-karis-wind-sense',
  name: 'Karis Wind Sense',
  startNodeId: 'karis-sense',
  nodes: [
    {
      id: 'karis-sense',
      speaker: 'Karis',
      text: 'The winds tell me three enemies behind that door. One strong, two weak.',
      portrait: 'karis',
      nextNodeId: 'stormcaller-impressed',
    },
    {
      id: 'stormcaller-impressed',
      speaker: 'Stormcaller',
      text: 'Whoa, you can do that? All I sense is "time to zap things."',
      portrait: 'stormcaller',
      nextNodeId: 'karis-tease',
    },
    {
      id: 'karis-tease',
      speaker: 'Karis',
      text: 'Jupiter Psynergy has nuance. Perhaps I could teach you... subtlety.',
      portrait: 'karis',
      nextNodeId: 'stormcaller-reject',
    },
    {
      id: 'stormcaller-reject',
      speaker: 'Stormcaller',
      text: "Subtle? Me? HA! Where's the fun in that?",
      portrait: 'stormcaller',
    },
  ],
};

export const BANTER_TYRELL_EAGER: DialogueTree = {
  id: 'banter-tyrell-eager',
  name: 'Tyrell Eager',
  startNodeId: 'tyrell-punch',
  nodes: [
    {
      id: 'tyrell-punch',
      speaker: 'Tyrell',
      text: '*cracks knuckles* Finally, some action! I was getting bored.',
      portrait: 'tyrell',
      nextNodeId: 'mystic-concern',
    },
    {
      id: 'mystic-concern',
      speaker: 'Mystic',
      text: "Tyrell, please don't rush in without-",
      portrait: 'mystic',
      nextNodeId: 'tyrell-charge',
    },
    {
      id: 'tyrell-charge',
      speaker: 'Tyrell',
      text: "TOO LATE! LET'S GOOOO!",
      portrait: 'tyrell',
      nextNodeId: 'mystic-sigh',
    },
    {
      id: 'mystic-sigh',
      speaker: 'Mystic',
      text: '*sighs* I\'ll prepare the healing spells...',
      portrait: 'mystic',
    },
  ],
};

export const BANTER_DJINN_CHATTER: DialogueTree = {
  id: 'banter-djinn-chatter',
  name: 'Djinn Chatter',
  startNodeId: 'flint-nervous',
  nodes: [
    {
      id: 'flint-nervous',
      speaker: 'Flint',
      text: '*hides behind Isaac* These enemies look mean...',
      portrait: 'djinn-venus',
      nextNodeId: 'forge-bravado',
    },
    {
      id: 'forge-bravado',
      speaker: 'Forge',
      text: 'Mean? BAH! I\'ll burn them to cinders! Right, Flint?',
      portrait: 'djinn-mars',
      nextNodeId: 'flint-scared',
    },
    {
      id: 'flint-scared',
      speaker: 'Flint',
      text: "I'll just... provide moral support. From back here. Way back here.",
      portrait: 'djinn-venus',
      nextNodeId: 'isaac-comfort',
    },
    {
      id: 'isaac-comfort',
      speaker: 'Isaac',
      text: "*pats Flint* It's okay, little guy. We've got this.",
      portrait: 'isaac',
    },
  ],
};

export const BANTER_BOSS_INTIMIDATION: DialogueTree = {
  id: 'banter-boss-intimidation',
  name: 'Boss Intimidation',
  startNodeId: 'sentinel-assess',
  nodes: [
    {
      id: 'sentinel-assess',
      speaker: 'Sentinel',
      text: '*analyzes enemy* This one is different. Stronger. More dangerous.',
      portrait: 'sentinel',
      nextNodeId: 'blaze-undeterred',
    },
    {
      id: 'blaze-undeterred',
      speaker: 'Blaze',
      text: 'Good. I was worried we might get bored.',
      portrait: 'blaze',
      nextNodeId: 'ranger-strategy',
    },
    {
      id: 'ranger-strategy',
      speaker: 'Ranger',
      text: "Focus fire. Don't let it recover. Isaac, you call the shots.",
      portrait: 'ranger',
      nextNodeId: 'isaac-lead',
    },
    {
      id: 'isaac-lead',
      speaker: 'Isaac',
      text: 'Everyone together. On my mark!',
      portrait: 'isaac',
    },
  ],
};

// ============================================================================
// OVERWORLD BANTER - Additional exploration dialogue
// ============================================================================

export const BANTER_SUPPLIES_LOW: DialogueTree = {
  id: 'banter-supplies-low',
  name: 'Supplies Running Low',
  startNodeId: 'mystic-concern',
  nodes: [
    {
      id: 'mystic-concern',
      speaker: 'Mystic',
      text: "We're running low on healing herbs. Should we visit the healer?",
      portrait: 'mystic',
      nextNodeId: 'warmage-dismiss',
    },
    {
      id: 'warmage-dismiss',
      speaker: 'War Mage',
      text: "Herbs? Who needs 'em! Just don't get hit!",
      portrait: 'garet',
      nextNodeId: 'mystic-exasperated',
    },
    {
      id: 'mystic-exasperated',
      speaker: 'Mystic',
      text: "That's... that's not how healing works, War Mage.",
      portrait: 'mystic',
    },
  ],
};

export const BANTER_DJINN_COLLECTION: DialogueTree = {
  id: 'banter-djinn-collection',
  name: 'Djinn Collection',
  startNodeId: 'ranger-notice',
  nodes: [
    {
      id: 'ranger-notice',
      speaker: 'Ranger',
      text: 'How many Djinn do we have now? I lost count.',
      portrait: 'ranger',
      nextNodeId: 'isaac-count',
    },
    {
      id: 'isaac-count',
      speaker: 'Isaac',
      text: 'Enough for some powerful Summons. But there are more out there.',
      portrait: 'isaac',
      nextNodeId: 'ranger-hunt',
    },
    {
      id: 'ranger-hunt',
      speaker: 'Ranger',
      text: "Then let's hunt them down. Every Djinn makes us stronger.",
      portrait: 'ranger',
    },
  ],
};

export const BANTER_NIGHT_WATCH: DialogueTree = {
  id: 'banter-night-watch',
  name: 'Night Watch',
  startNodeId: 'sentinel-watch',
  nodes: [
    {
      id: 'sentinel-watch',
      speaker: 'Sentinel',
      text: '*stares at horizon* I can take first watch. You all rest.',
      portrait: 'sentinel',
      nextNodeId: 'isaac-offer',
    },
    {
      id: 'isaac-offer',
      speaker: 'Isaac',
      text: "I'll join you. Can't sleep anyway.",
      portrait: 'isaac',
      nextNodeId: 'sentinel-grateful',
    },
    {
      id: 'sentinel-grateful',
      speaker: 'Sentinel',
      text: '*nods* The burden is lighter when shared.',
      portrait: 'sentinel',
    },
  ],
};

// ============================================================================
// Export all banter dialogues
// ============================================================================

export const BANTER_DIALOGUES: Record<string, DialogueTree> = {
  'banter-isaac-sentinel-teamwork': BANTER_ISAAC_SENTINEL_TEAMWORK,
  'banter-sentinel-earth-pride': BANTER_SENTINEL_EARTH_PRIDE,
  'banter-stormcaller-impatient': BANTER_STORMCALLER_IMPATIENT,
  'banter-full-party-ready': BANTER_FULL_PARTY_READY,
  'banter-sentinel-village-memory': BANTER_SENTINEL_VILLAGE_MEMORY,
  'banter-stormcaller-weather': BANTER_STORMCALLER_WEATHER,
  'banter-isaac-leadership': BANTER_ISAAC_LEADERSHIP,
  'banter-halfway-point': BANTER_HALFWAY_POINT,
  'banter-near-end': BANTER_NEAR_END,
  'banter-victory': BANTER_VICTORY,
  // New combat banter
  'banter-mars-duo': BANTER_MARS_DUO,
  'banter-mercury-mystic-calm': BANTER_MERCURY_MYSTIC_CALM,
  'banter-ranger-first-strike': BANTER_RANGER_FIRST_STRIKE,
  'banter-felix-reunion': BANTER_FELIX_REUNION,
  'banter-karis-wind-sense': BANTER_KARIS_WIND_SENSE,
  'banter-tyrell-eager': BANTER_TYRELL_EAGER,
  'banter-djinn-chatter': BANTER_DJINN_CHATTER,
  'banter-boss-intimidation': BANTER_BOSS_INTIMIDATION,
  // New overworld banter
  'banter-supplies-low': BANTER_SUPPLIES_LOW,
  'banter-djinn-collection': BANTER_DJINN_COLLECTION,
  'banter-night-watch': BANTER_NIGHT_WATCH,
};
