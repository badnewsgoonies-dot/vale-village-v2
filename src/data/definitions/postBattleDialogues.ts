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
};
