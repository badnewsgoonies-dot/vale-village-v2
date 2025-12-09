import type { DialogueTree } from '../schemas/DialogueSchema';

/**
 * Post-battle dialogues that play after liberation encounters.
 * These are separate from pre-battle dialogues to allow clean state transitions:
 * pre-battle dialogue → battle → rewards → post-battle dialogue → recruitment
 */

export const HOUSE_01_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-01-post-battle',
  name: 'House 1 Liberation Complete',
  startNodeId: 'wolf-freed',
  nodes: [
    {
      id: 'wolf-freed',
      speaker: 'Isaac',
      text: "The wolf... it's free! The shadow has lifted.",
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_02_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-02-post-battle',
  name: 'House 2 Liberation Complete',
  startNodeId: 'bear-freed',
  nodes: [
    {
      id: 'bear-freed',
      speaker: 'Isaac',
      text: "Another creature saved. We're making progress.",
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_03_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-03-post-battle',
  name: 'House 3 Liberation Complete',
  startNodeId: 'hawk-freed',
  nodes: [
    {
      id: 'hawk-freed',
      speaker: 'Isaac',
      text: 'The hawk is free! Its strength is returning.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_04_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-04-post-battle',
  name: 'House 4 Liberation Complete',
  startNodeId: 'lion-freed',
  nodes: [
    {
      id: 'lion-freed',
      speaker: 'Isaac',
      text: 'A mighty lion, restored. The darkness is weakening.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_05_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-05-post-battle',
  name: 'House 5 Liberation Complete',
  startNodeId: 'dragon-freed',
  nodes: [
    {
      id: 'dragon-freed',
      speaker: 'Isaac',
      text: 'The dragon is free! All five houses have been liberated.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_06_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-06-post-battle',
  name: 'House 6 Liberation Complete',
  startNodeId: 'bear-freed',
  nodes: [
    {
      id: 'bear-freed',
      speaker: 'Isaac',
      text: 'The Mountain Bear stands free at last. It bows its head in gratitude before returning to the peaks.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_07_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-07-post-battle',
  name: 'House 7 Liberation Complete',
  startNodeId: 'wind-freed',
  nodes: [
    {
      id: 'wind-freed',
      speaker: 'Isaac',
      text: 'The wind spirits swirl joyfully around us before dispersing into the sky. Seven houses down!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_08_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-08-post-battle',
  name: 'House 8 Liberation Complete',
  startNodeId: 'sentinel-freed',
  nodes: [
    {
      id: 'sentinel-freed',
      speaker: 'Isaac',
      text: 'Sentinel is free from his chains! We have our first ally Adept!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_09_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-09-post-battle',
  name: 'House 9 Liberation Complete',
  startNodeId: 'elemental-freed',
  nodes: [
    {
      id: 'elemental-freed',
      speaker: 'Isaac',
      text: 'The Flame Elemental flickers peacefully now. The Mars Bear has returned to the wild.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_10_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-10-post-battle',
  name: 'House 10 Liberation Complete',
  startNodeId: 'halfway',
  nodes: [
    {
      id: 'halfway',
      speaker: 'Isaac',
      text: "Ten houses freed! We're halfway there. The Overseer must be getting nervous.",
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_11_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-11-post-battle',
  name: 'House 11 Liberation Complete',
  startNodeId: 'phoenix-freed',
  nodes: [
    {
      id: 'phoenix-freed',
      speaker: 'Isaac',
      text: 'The Phoenix rises in brilliant flames, reborn and free! It circles overhead before vanishing into the sun.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_12_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-12-post-battle',
  name: 'House 12 Liberation Complete',
  startNodeId: 'leviathan-freed',
  nodes: [
    {
      id: 'leviathan-freed',
      speaker: 'Isaac',
      text: 'The Leviathan plunges back into the depths, finally master of its own domain. Legend returns to legend.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_13_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-13-post-battle',
  name: 'House 13 Liberation Complete',
  startNodeId: 'thunderbird-freed',
  nodes: [
    {
      id: 'thunderbird-freed',
      speaker: 'Isaac',
      text: 'The Thunderbird spreads its wings, lightning crackling joyfully. It soars into the storm clouds, free at last!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_14_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-14-post-battle',
  name: 'House 14 Liberation Complete',
  startNodeId: 'soldiers-defeated',
  nodes: [
    {
      id: 'soldiers-defeated',
      speaker: 'Isaac',
      text: 'Three soldiers down at once! Our teamwork is unstoppable. Only six houses remain!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_15_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-15-post-battle',
  name: 'House 15 Liberation Complete',
  startNodeId: 'stormcaller-freed',
  nodes: [
    {
      id: 'stormcaller-freed',
      speaker: 'Isaac',
      text: 'Stormcaller is free! With a Jupiter Adept on our team, no storm can stop us now!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_16_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-16-post-battle',
  name: 'House 16 Liberation Complete',
  startNodeId: 'basilisk-freed',
  nodes: [
    {
      id: 'basilisk-freed',
      speaker: 'Isaac',
      text: "The Basilisk's petrifying gaze softens. It slithers away peacefully. The Rock Elemental crumbles into the earth, content.",
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_17_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-17-post-battle',
  name: 'House 17 Liberation Complete',
  startNodeId: 'warlords-defeated',
  nodes: [
    {
      id: 'warlords-defeated',
      speaker: 'Isaac',
      text: "The Warlords fall! The Overseer's elite forces are crumbling. Only three houses remain!",
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_18_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-18-post-battle',
  name: 'House 18 Liberation Complete',
  startNodeId: 'hydra-freed',
  nodes: [
    {
      id: 'hydra-freed',
      speaker: 'Isaac',
      text: "The Hydra's many heads bow in unison. The legendary serpent returns to the swamps, no longer enslaved.",
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_19_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-19-post-battle',
  name: 'House 19 Liberation Complete',
  startNodeId: 'final-warlords',
  nodes: [
    {
      id: 'final-warlords',
      speaker: 'Isaac',
      text: 'The last Warlords are defeated! Only the Overseer remains. This ends NOW!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_20_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-20-post-battle',
  name: 'House 20 Liberation Complete',
  startNodeId: 'overseer-defeated',
  nodes: [
    {
      id: 'overseer-defeated',
      speaker: 'Isaac',
      text: "The Overseer falls! The Chimera is free! All twenty houses are liberated! WE DID IT!",
      portrait: 'isaac',
    },
  ],
};

// ============================================================================
// CHAPTER 2: Post-Vale Progression (Houses 21-30)
// ============================================================================

export const HOUSE_21_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-21-post-battle',
  name: 'House 21 Liberation Complete',
  startNodeId: 'undead-vanquished',
  nodes: [
    {
      id: 'undead-vanquished',
      speaker: 'Isaac',
      text: '*watches the undead crumble to dust* The graveyard falls silent. House 21 is freed from necromantic chains.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_22_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-22-post-battle',
  name: 'House 22 Liberation Complete',
  startNodeId: 'skies-cleared',
  nodes: [
    {
      id: 'skies-cleared',
      speaker: 'Isaac',
      text: 'The aerial forces scatter! House 22 is ours. Even the skies cannot hold us back.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_23_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-23-post-battle',
  name: 'House 23 Liberation Complete',
  startNodeId: 'golems-shattered',
  nodes: [
    {
      id: 'golems-shattered',
      speaker: 'Isaac',
      text: '*the last golem crumbles* Clay and iron bow to our resolve. House 23 is liberated!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_24_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-24-post-battle',
  name: 'House 24 Liberation Complete',
  startNodeId: 'ice-thawed',
  nodes: [
    {
      id: 'ice-thawed',
      speaker: 'Isaac',
      text: '*warmth returns to the air* The eternal winter ends. House 24 thaws at last!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_25_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-25-post-battle',
  name: 'House 25 Liberation Complete',
  startNodeId: 'storm-calmed',
  nodes: [
    {
      id: 'storm-calmed',
      speaker: 'Isaac',
      text: '*the winds settle* Tempest Heights grow quiet. House 25 stands free beneath clear skies!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_26_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-26-post-battle',
  name: 'House 26 Liberation Complete',
  startNodeId: 'ritual-broken',
  nodes: [
    {
      id: 'ritual-broken',
      speaker: 'Isaac',
      text: '*the dark altar shatters* The necromantic rites are ended. House 26 will know no more death magic!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_27_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-27-post-battle',
  name: 'House 27 Liberation Complete',
  startNodeId: 'crystals-harmonized',
  nodes: [
    {
      id: 'crystals-harmonized',
      speaker: 'Isaac',
      text: '*the crystals hum peacefully* The convergence is complete. House 27 shines with pure light!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_28_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-28-post-battle',
  name: 'House 28 Liberation Complete',
  startNodeId: 'dragons-freed',
  nodes: [
    {
      id: 'dragons-freed',
      speaker: 'Isaac',
      text: '*the dragons roar in triumph* The apex predators are allies now. House 28 belongs to legend!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_29_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-29-post-battle',
  name: 'House 29 Liberation Complete',
  startNodeId: 'armada-sunk',
  nodes: [
    {
      id: 'armada-sunk',
      speaker: 'Isaac',
      text: '*waves crash peacefully* The Void Armada is no more. House 29 returns to the people!',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_30_POST_BATTLE_DIALOGUE: DialogueTree = {
  id: 'house-30-post-battle',
  name: 'House 30 Liberation Complete',
  startNodeId: 'nexus-claimed',
  nodes: [
    {
      id: 'nexus-claimed',
      speaker: 'Isaac',
      text: '*all four elements swirl in harmony* The Nexus Guardian falls! Chapter 2 complete - we have mastered all elements!',
      portrait: 'isaac',
    },
  ],
};

export const POST_BATTLE_DIALOGUES: Record<string, DialogueTree> = {
  'house-01-post-battle': HOUSE_01_POST_BATTLE_DIALOGUE,
  'house-02-post-battle': HOUSE_02_POST_BATTLE_DIALOGUE,
  'house-03-post-battle': HOUSE_03_POST_BATTLE_DIALOGUE,
  'house-04-post-battle': HOUSE_04_POST_BATTLE_DIALOGUE,
  'house-05-post-battle': HOUSE_05_POST_BATTLE_DIALOGUE,
  'house-06-post-battle': HOUSE_06_POST_BATTLE_DIALOGUE,
  'house-07-post-battle': HOUSE_07_POST_BATTLE_DIALOGUE,
  'house-08-post-battle': HOUSE_08_POST_BATTLE_DIALOGUE,
  'house-09-post-battle': HOUSE_09_POST_BATTLE_DIALOGUE,
  'house-10-post-battle': HOUSE_10_POST_BATTLE_DIALOGUE,
  'house-11-post-battle': HOUSE_11_POST_BATTLE_DIALOGUE,
  'house-12-post-battle': HOUSE_12_POST_BATTLE_DIALOGUE,
  'house-13-post-battle': HOUSE_13_POST_BATTLE_DIALOGUE,
  'house-14-post-battle': HOUSE_14_POST_BATTLE_DIALOGUE,
  'house-15-post-battle': HOUSE_15_POST_BATTLE_DIALOGUE,
  'house-16-post-battle': HOUSE_16_POST_BATTLE_DIALOGUE,
  'house-17-post-battle': HOUSE_17_POST_BATTLE_DIALOGUE,
  'house-18-post-battle': HOUSE_18_POST_BATTLE_DIALOGUE,
  'house-19-post-battle': HOUSE_19_POST_BATTLE_DIALOGUE,
  'house-20-post-battle': HOUSE_20_POST_BATTLE_DIALOGUE,
  // Chapter 2: Post-Vale Progression
  'house-21-post-battle': HOUSE_21_POST_BATTLE_DIALOGUE,
  'house-22-post-battle': HOUSE_22_POST_BATTLE_DIALOGUE,
  'house-23-post-battle': HOUSE_23_POST_BATTLE_DIALOGUE,
  'house-24-post-battle': HOUSE_24_POST_BATTLE_DIALOGUE,
  'house-25-post-battle': HOUSE_25_POST_BATTLE_DIALOGUE,
  'house-26-post-battle': HOUSE_26_POST_BATTLE_DIALOGUE,
  'house-27-post-battle': HOUSE_27_POST_BATTLE_DIALOGUE,
  'house-28-post-battle': HOUSE_28_POST_BATTLE_DIALOGUE,
  'house-29-post-battle': HOUSE_29_POST_BATTLE_DIALOGUE,
  'house-30-post-battle': HOUSE_30_POST_BATTLE_DIALOGUE,
};

/**
 * Maps encounter IDs to their post-battle dialogue IDs.
 * Checked by App.tsx after battle completion to trigger celebration dialogues.
 */
export const ENCOUNTER_TO_POST_BATTLE_DIALOGUE: Record<string, string> = {
  'house-01': 'house-01-post-battle',
  'house-02': 'house-02-post-battle',
  'house-03': 'house-03-post-battle',
  'house-04': 'house-04-post-battle',
  'house-05': 'house-05-post-battle',
  'house-06': 'house-06-post-battle',
  'house-07': 'house-07-post-battle',
  'house-08': 'house-08-post-battle',
  'house-09': 'house-09-post-battle',
  'house-10': 'house-10-post-battle',
  'house-11': 'house-11-post-battle',
  'house-12': 'house-12-post-battle',
  'house-13': 'house-13-post-battle',
  'house-14': 'house-14-post-battle',
  'house-15': 'house-15-post-battle',
  'house-16': 'house-16-post-battle',
  'house-17': 'house-17-post-battle',
  'house-18': 'house-18-post-battle',
  'house-19': 'house-19-post-battle',
  'house-20': 'house-20-post-battle',
  // Chapter 2: Post-Vale Progression
  'house-21': 'house-21-post-battle',
  'house-22': 'house-22-post-battle',
  'house-23': 'house-23-post-battle',
  'house-24': 'house-24-post-battle',
  'house-25': 'house-25-post-battle',
  'house-26': 'house-26-post-battle',
  'house-27': 'house-27-post-battle',
  'house-28': 'house-28-post-battle',
  'house-29': 'house-29-post-battle',
  'house-30': 'house-30-post-battle',
};
