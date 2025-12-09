/**
 * Recruitment Dialogue Scenes
 * Post-battle narratives for all 9 unit recruitments
 *
 * IMPORTANT: These dialogues trigger after battle victory and grant units via dialogue effects
 */

import type { DialogueTree } from '@/core/models/dialogue';

// HOUSE 01: War Mage + Forge Djinn
export const HOUSE_01_RECRUIT: DialogueTree = {
  id: 'house-01-recruit',
  name: 'House 01: War Mage Joins',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Isaac',
      text: 'The first house is ours. But who is that approaching?',
      portrait: 'isaac',
      nextNodeId: 'garet-intro',
    },
    {
      id: 'garet-intro',
      speaker: 'War Mage',
      text: "That was impressive! I'm a War Mage, skilled in Mars Psynergy. Mind if I join you?",
      portrait: 'garet',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "We could use your strength. Welcome to the team!",
      portrait: 'isaac',
      nextNodeId: 'forge-djinn',
    },
    {
      id: 'forge-djinn',
      speaker: 'War Mage',
      text: "And take this Forge Djinn I found - it'll boost our Mars power!",
      portrait: 'garet',
      effects: {
        recruitUnit: "war-mage",
        grantDjinn: "forge",
      },
    },
  ],
};

// HOUSE 02: Mystic (Story Join)
export const HOUSE_02_RECRUIT: DialogueTree = {
  id: 'house-02-recruit',
  name: 'House 02: Mystic Joins',
  startNodeId: 'arrival',
  nodes: [
    {
      id: 'arrival',
      speaker: 'Mystic',
      text: "I've been watching your progress. You fight for the people - I respect that.",
      portrait: 'mystic',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "We need all the help we can get to liberate these houses.",
      portrait: 'isaac',
      nextNodeId: 'mystic-joins',
    },
    {
      id: 'mystic-joins',
      speaker: 'Mystic',
      text: "Then I'll lend you my Mercury Psynergy. Together, we'll restore balance.",
      portrait: 'mystic',
      effects: { recruitUnit: "mystic" },
    },
  ],
};

// HOUSE 03: Ranger (Story Join)
export const HOUSE_03_RECRUIT: DialogueTree = {
  id: 'house-03-recruit',
  name: 'House 03: Ranger Joins',
  startNodeId: 'scouting',
  nodes: [
    {
      id: 'scouting',
      speaker: 'Ranger',
      text: '*drops from a tree branch* Hold. I have been tracking your progress through the houses.',
      portrait: 'ranger',
      nextNodeId: 'ranger-intel',
    },
    {
      id: 'ranger-intel',
      speaker: 'Ranger',
      text: "The corruption runs deep. House 4 holds a Frost Mystic - dangerous healer. House 5 guards a powerful fire wielder. You will need more than strength to succeed.",
      portrait: 'ranger',
      nextNodeId: 'isaac-impressed',
    },
    {
      id: 'isaac-impressed',
      speaker: 'Isaac',
      text: "You know the layout of the houses? That intelligence is invaluable!",
      portrait: 'isaac',
      nextNodeId: 'ranger-offer',
    },
    {
      id: 'ranger-offer',
      speaker: 'Ranger',
      text: '*nocks an arrow and aims at a distant target* My Jupiter Psynergy grants me keen sight. I can hit a shadow-touched creature from three hundred paces.',
      portrait: 'ranger',
      nextNodeId: 'isaac-question',
    },
    {
      id: 'isaac-question',
      speaker: 'Isaac',
      text: "Will you help us push forward? We could use your eyes and your bow.",
      portrait: 'isaac',
      nextNodeId: 'ranger-joins',
    },
    {
      id: 'ranger-joins',
      speaker: 'Ranger',
      text: "*releases the arrow, striking true* My arrows are yours. I will scout ahead and ensure no ambush catches us unaware.",
      portrait: 'ranger',
      effects: { recruitUnit: "ranger" },
    },
  ],
};

// HOUSE 04: Post-Battle (no unit recruitment, just victory dialogue)
export const HOUSE_04_POST_BATTLE: DialogueTree = {
  id: 'house-04-post',
  name: 'House 04: Victory',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Isaac',
      text: 'Another house freed. The villagers are grateful for our help.',
      portrait: 'isaac',
    },
  ],
};

// HOUSE 05: Blaze
export const HOUSE_05_RECRUIT: DialogueTree = {
  id: 'house-05-recruit',
  name: 'House 05: Blaze Joins',
  startNodeId: 'flames',
  nodes: [
    {
      id: 'flames',
      speaker: 'Blaze',
      text: '*emerges from a pillar of flame* So, you are the ones making waves across Vale. I have been watching.',
      portrait: 'blaze',
      nextNodeId: 'blaze-demonstrate',
    },
    {
      id: 'blaze-demonstrate',
      speaker: 'Blaze',
      text: '*conjures a ring of fire that spirals around the party* Fire answers to those with conviction. But do you have what it takes to wield true Mars Psynergy?',
      portrait: 'blaze',
      nextNodeId: 'isaac-unflinching',
    },
    {
      id: 'isaac-unflinching',
      speaker: 'Isaac',
      text: "*stands firm as flames lick the air around him* We've faced worse. The Overseer's shadow won't stop us - and neither will your test.",
      portrait: 'isaac',
      nextNodeId: 'blaze-impressed',
    },
    {
      id: 'blaze-impressed',
      speaker: 'Blaze',
      text: '*the flames recede* Ha! Most would have flinched. You have the spirit of a true warrior.',
      portrait: 'blaze',
      nextNodeId: 'isaac-request',
    },
    {
      id: 'isaac-request',
      speaker: 'Isaac',
      text: "We need your flames to burn through the resistance ahead. Will you join us?",
      portrait: 'isaac',
      nextNodeId: 'blaze-joins',
    },
    {
      id: 'blaze-joins',
      speaker: 'Blaze',
      text: "*ignites both fists* You've earned my fire. Let's reduce the Overseer's forces to ashes!",
      portrait: 'blaze',
      effects: { recruitUnit: "blaze" },
    },
  ],
};

// HOUSE 07: Breeze Djinn (no unit recruitment, just Djinn grant)
export const HOUSE_07_DJINN: DialogueTree = {
  id: 'house-07-djinn',
  name: 'House 07: Breeze Djinn',
  startNodeId: 'wind',
  nodes: [
    {
      id: 'wind',
      speaker: 'Isaac',
      text: 'Do you feel that? The wind carries something... a Djinn!',
      portrait: 'isaac',
      nextNodeId: 'breeze-appears',
    },
    {
      id: 'breeze-appears',
      speaker: 'Breeze',
      text: 'I am Breeze, spirit of Jupiter. You have proven worthy!',
      portrait: 'djinn',
      nextNodeId: 'summon-unlock',
    },
    {
      id: 'summon-unlock',
      speaker: 'Isaac',
      text: 'With three Djinn, we can now unleash Summon abilities!',
      portrait: 'isaac',
      effects: { grantDjinn: "breeze" },
    },
  ],
};

// HOUSE 08: Sentinel + Fizz Djinn
export const HOUSE_08_RECRUIT: DialogueTree = {
  id: 'house-08-recruit',
  name: 'House 08: Sentinel Joins',
  startNodeId: 'defender',
  nodes: [
    {
      id: 'defender',
      speaker: 'Sentinel',
      text: "I've defended this house for years, but corruption has spread too far. I need your help.",
      portrait: 'sentinel',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "Join us. Together we're stronger.",
      portrait: 'isaac',
      nextNodeId: 'fizz-djinn',
    },
    {
      id: 'fizz-djinn',
      speaker: 'Sentinel',
      text: "I found this Fizz Djinn while guarding the waters. It's yours now.",
      portrait: 'sentinel',
      effects: {
        recruitUnit: "sentinel",
        grantDjinn: "fizz",
      },
    },
  ],
};

// HOUSE 11: Karis
export const HOUSE_11_RECRUIT: DialogueTree = {
  id: 'house-11-recruit',
  name: 'House 11: Karis Joins',
  startNodeId: 'windcaller',
  nodes: [
    {
      id: 'windcaller',
      speaker: 'Karis',
      text: "The winds speak of your deeds. You're bringing hope back to these lands.",
      portrait: 'karis',
      nextNodeId: 'karis-demonstrate',
    },
    {
      id: 'karis-demonstrate',
      speaker: 'Karis',
      text: '*summons a whirlwind that lifts debris into the air* Watch closely - THIS is Jupiter Psynergy.',
      portrait: 'karis',
      nextNodeId: 'isaac-impressed',
    },
    {
      id: 'isaac-impressed',
      speaker: 'Isaac',
      text: '*shielding eyes from the wind* Incredible control! You could turn the tide of any battle.',
      portrait: 'isaac',
      nextNodeId: 'karis-explain',
    },
    {
      id: 'karis-explain',
      speaker: 'Karis',
      text: 'Wind is versatile. I can boost our speed, slice through armor, or create barriers of air. The sky is my domain.',
      portrait: 'karis',
      nextNodeId: 'isaac-request',
    },
    {
      id: 'isaac-request',
      speaker: 'Isaac',
      text: "We need that power. Will you join our fight against the Overseer?",
      portrait: 'isaac',
      nextNodeId: 'karis-joins',
    },
    {
      id: 'karis-joins',
      speaker: 'Karis',
      text: '*wind calms to a gentle breeze* I thought you would never ask. Let the storm begin!',
      portrait: 'karis',
      effects: { recruitUnit: "karis" },
    },
  ],
};

// HOUSE 12: Granite Djinn (no unit recruitment)
export const HOUSE_12_DJINN: DialogueTree = {
  id: 'house-12-djinn',
  name: 'House 12: Granite Djinn',
  startNodeId: 'earth',
  nodes: [
    {
      id: 'earth',
      speaker: 'Isaac',
      text: 'The earth trembles... another Djinn!',
      portrait: 'isaac',
      nextNodeId: 'granite-appears',
    },
    {
      id: 'granite-appears',
      speaker: 'Granite',
      text: 'I am Granite, Tier 2 Venus Djinn. Your strength has called me!',
      portrait: 'djinn',
      effects: { grantDjinn: "granite" },
    },
  ],
};

// HOUSE 14: Tyrell
export const HOUSE_14_RECRUIT: DialogueTree = {
  id: 'house-14-recruit',
  name: 'House 14: Tyrell Joins',
  startNodeId: 'earthshaker',
  nodes: [
    {
      id: 'earthshaker',
      speaker: 'Tyrell',
      text: "You've got guts taking on these houses! I like that. But guts alone won't cut it.",
      portrait: 'tyrell',
      nextNodeId: 'tyrell-challenge',
    },
    {
      id: 'tyrell-challenge',
      speaker: 'Tyrell',
      text: '*cracks knuckles* Tell you what - show me your best attack. If you can push me back even one step, I join.',
      portrait: 'tyrell',
      nextNodeId: 'isaac-accepts',
    },
    {
      id: 'isaac-accepts',
      speaker: 'Isaac',
      text: '*readies weapon* You asked for it!',
      portrait: 'isaac',
      nextNodeId: 'tyrell-impressed',
    },
    {
      id: 'tyrell-impressed',
      speaker: 'Tyrell',
      text: '*staggers back two steps* Whoa! Not bad at all! Most people can\'t even make me flinch!',
      portrait: 'tyrell',
      nextNodeId: 'tyrell-respect',
    },
    {
      id: 'tyrell-respect',
      speaker: 'Tyrell',
      text: "You've got strength AND technique. The Overseer won't know what hit him!",
      portrait: 'tyrell',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "So you're in?",
      portrait: 'isaac',
      nextNodeId: 'tyrell-joins',
    },
    {
      id: 'tyrell-joins',
      speaker: 'Tyrell',
      text: "*pounds fist into palm* Ha! You bet I'm in! Let's make some noise together!",
      portrait: 'tyrell',
      effects: { recruitUnit: "tyrell" },
    },
  ],
};

// HOUSE 15: Stormcaller + Squall Djinn
export const HOUSE_15_RECRUIT: DialogueTree = {
  id: 'house-15-recruit',
  name: 'House 15: Stormcaller Joins',
  startNodeId: 'thunder',
  nodes: [
    {
      id: 'thunder',
      speaker: 'Stormcaller',
      text: "The storm is gathering. You stand at the eye of destiny.",
      portrait: 'stormcaller',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "Then help us ride the storm to victory.",
      portrait: 'isaac',
      nextNodeId: 'squall-djinn',
    },
    {
      id: 'squall-djinn',
      speaker: 'Stormcaller',
      text: "I bring both myself and Squall Djinn. Together, we'll unleash the tempest!",
      portrait: 'stormcaller',
      effects: {
        recruitUnit: "stormcaller",
        grantDjinn: "squall",
      },
    },
  ],
};

// HOUSE 17: Felix
export const HOUSE_17_RECRUIT: DialogueTree = {
  id: 'house-17-recruit',
  name: 'House 17: Felix Joins',
  startNodeId: 'reunion',
  nodes: [
    {
      id: 'reunion',
      speaker: 'Felix',
      text: "Isaac... I've been searching for you. The darkness has spread too far.",
      portrait: 'felix',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: "Felix! Together we can push it back!",
      portrait: 'isaac',
      nextNodeId: 'felix-joins',
    },
    {
      id: 'felix-joins',
      speaker: 'Felix',
      text: "Like old times. Let's finish this fight.",
      portrait: 'felix',
      effects: { recruitUnit: "felix" },
    },
  ],
};

// HOUSE 18: Bane Djinn (no unit recruitment)
export const HOUSE_18_DJINN: DialogueTree = {
  id: 'house-18-djinn',
  name: 'House 18: Bane Djinn',
  startNodeId: 'shadow',
  nodes: [
    {
      id: 'shadow',
      speaker: 'Isaac',
      text: 'A powerful presence... a Tier 3 Djinn!',
      portrait: 'isaac',
      nextNodeId: 'bane-appears',
    },
    {
      id: 'bane-appears',
      speaker: 'Bane',
      text: 'I am Bane, Tier 3 Venus Djinn. The final battle approaches - take my power!',
      portrait: 'djinn',
      effects: { grantDjinn: "bane" },
    },
  ],
};

// HOUSE 20: Storm Djinn (final boss, no unit recruitment)
export const HOUSE_20_DJINN: DialogueTree = {
  id: 'house-20-djinn',
  name: 'House 20: Storm Djinn (Victory)',
  startNodeId: 'final-victory',
  nodes: [
    {
      id: 'final-victory',
      speaker: 'Isaac',
      text: "We did it! The corruption is finally lifted from Vale!",
      portrait: 'isaac',
      nextNodeId: 'storm-appears',
    },
    {
      id: 'storm-appears',
      speaker: 'Storm',
      text: 'I am Storm, the final Tier 3 Jupiter Djinn. You have proven yourself worthy!',
      portrait: 'djinn',
      nextNodeId: 'ending',
    },
    {
      id: 'ending',
      speaker: 'Isaac',
      text: 'With all 8 Djinn and our complete party, Vale is safe at last!',
      portrait: 'isaac',
      effects: { grantDjinn: "gust" },
    },
  ],
};

// HOUSE 06: Victory + Gust Djinn
export const HOUSE_06_VICTORY: DialogueTree = {
  id: 'house-06-victory',
  name: 'House 06: Steel Guardian Falls',
  startNodeId: 'guardian-falls',
  nodes: [
    {
      id: 'guardian-falls',
      speaker: 'Isaac',
      text: '*wipes sweat from brow* The Steel Guardian was tougher than I expected. But we prevailed!',
      portrait: 'isaac',
      nextNodeId: 'gust-appears',
    },
    {
      id: 'gust-appears',
      speaker: 'Gust',
      text: '*swirls into existence* You have freed me from the Guardian\'s chains! I am Gust, Jupiter Djinn!',
      portrait: 'djinn',
      nextNodeId: 'isaac-accepts',
    },
    {
      id: 'isaac-accepts',
      speaker: 'Isaac',
      text: 'A wind spirit! With Jupiter Psynergy on our side, our options expand greatly.',
      portrait: 'isaac',
      effects: { grantDjinn: "gust" },
    },
  ],
};

// HOUSE 09: Victory (equipment reward only)
export const HOUSE_09_VICTORY: DialogueTree = {
  id: 'house-09-victory',
  name: 'House 09: Inferno Conquered',
  startNodeId: 'inferno-falls',
  nodes: [
    {
      id: 'inferno-falls',
      speaker: 'Isaac',
      text: '*catches breath* The flames are quelled. Nine houses liberated - we are gaining momentum!',
      portrait: 'isaac',
      nextNodeId: 'team-reaction',
    },
    {
      id: 'team-reaction',
      speaker: 'War Mage',
      text: 'Ha! Those fire elementals were nothing compared to TRUE Mars Psynergy! Great work, everyone!',
      portrait: 'garet',
    },
  ],
};

// HOUSE 10: Victory - Act 1 Climax
export const HOUSE_10_VICTORY: DialogueTree = {
  id: 'house-10-victory',
  name: 'House 10: The Burning Gauntlet Cleared',
  startNodeId: 'milestone',
  nodes: [
    {
      id: 'milestone',
      speaker: 'Isaac',
      text: '*looks at the freed villagers* Ten houses. Half the village is free. We are truly making a difference.',
      portrait: 'isaac',
      nextNodeId: 'mystic-insight',
    },
    {
      id: 'mystic-insight',
      speaker: 'Mystic',
      text: '*sensing the flow of Psynergy* The Overseer\'s grip weakens with each victory. But the remaining houses will be harder.',
      portrait: 'mystic',
      nextNodeId: 'isaac-resolve',
    },
    {
      id: 'isaac-resolve',
      speaker: 'Isaac',
      text: 'Then we get stronger too. Forward - there is no turning back now!',
      portrait: 'isaac',
    },
  ],
};

// HOUSE 13: Victory - Act 2 Major Battle
export const HOUSE_13_VICTORY: DialogueTree = {
  id: 'house-13-victory',
  name: 'House 13: The Silver Strike',
  startNodeId: 'leviathan-freed',
  nodes: [
    {
      id: 'leviathan-freed',
      speaker: 'Isaac',
      text: '*watches the Leviathan dive into the depths* Another legendary creature freed. Thirteen down!',
      portrait: 'isaac',
      nextNodeId: 'ranger-intel',
    },
    {
      id: 'ranger-intel',
      speaker: 'Ranger',
      text: '*scans the horizon* My scouts report the remaining houses are heavily fortified. Elite guards await us.',
      portrait: 'ranger',
      nextNodeId: 'blaze-eager',
    },
    {
      id: 'blaze-eager',
      speaker: 'Blaze',
      text: '*flames flicker eagerly* Good! I was getting bored with these weaklings. Bring on the real challenge!',
      portrait: 'blaze',
    },
  ],
};

// HOUSE 16: Victory - Act 3 Opening
export const HOUSE_16_VICTORY: DialogueTree = {
  id: 'house-16-victory',
  name: 'House 16: The Mythril Edge',
  startNodeId: 'commander-falls',
  nodes: [
    {
      id: 'commander-falls',
      speaker: 'Isaac',
      text: '*sheathes weapon* The Lightning Commander was a worthy foe. Only four houses remain.',
      portrait: 'isaac',
      nextNodeId: 'karis-observation',
    },
    {
      id: 'karis-observation',
      speaker: 'Karis',
      text: '*the wind whispers around her* I sense immense power ahead. The Overseer is gathering his strongest forces.',
      portrait: 'karis',
      nextNodeId: 'tyrell-confident',
    },
    {
      id: 'tyrell-confident',
      speaker: 'Tyrell',
      text: '*cracks knuckles* Four houses? We have taken sixteen! Nothing can stop us now!',
      portrait: 'tyrell',
    },
  ],
};

// HOUSE 19: Victory - Final Armament
export const HOUSE_19_VICTORY: DialogueTree = {
  id: 'house-19-victory',
  name: 'House 19: The Final Armament',
  startNodeId: 'hydra-freed',
  nodes: [
    {
      id: 'hydra-freed',
      speaker: 'Isaac',
      text: '*breathing heavily* The Hydra and Warlords fall! Only the Overseer remains!',
      portrait: 'isaac',
      nextNodeId: 'felix-wisdom',
    },
    {
      id: 'felix-wisdom',
      speaker: 'Felix',
      text: '*grips his blade* We have come so far, Isaac. Whatever happens in the final house... it has been an honor.',
      portrait: 'felix',
      nextNodeId: 'isaac-rallies',
    },
    {
      id: 'isaac-rallies',
      speaker: 'Isaac',
      text: '*places hand on Felix\'s shoulder* Save the sentimentality for AFTER we win. Everyone - prepare for the final battle!',
      portrait: 'isaac',
      nextNodeId: 'team-ready',
    },
    {
      id: 'team-ready',
      speaker: 'War Mage',
      text: 'For Vale! For the villagers! FOR VICTORY!',
      portrait: 'garet',
    },
  ],
};

// Export all recruitment dialogues
export const RECRUITMENT_DIALOGUES: Record<string, DialogueTree> = {
  'house-01-recruit': HOUSE_01_RECRUIT,
  'house-02-recruit': HOUSE_02_RECRUIT,
  'house-03-recruit': HOUSE_03_RECRUIT,
  'house-04-post': HOUSE_04_POST_BATTLE,
  'house-05-recruit': HOUSE_05_RECRUIT,
  'house-06-victory': HOUSE_06_VICTORY,
  'house-07-djinn': HOUSE_07_DJINN,
  'house-08-recruit': HOUSE_08_RECRUIT,
  'house-09-victory': HOUSE_09_VICTORY,
  'house-10-victory': HOUSE_10_VICTORY,
  'house-11-recruit': HOUSE_11_RECRUIT,
  'house-12-djinn': HOUSE_12_DJINN,
  'house-13-victory': HOUSE_13_VICTORY,
  'house-14-recruit': HOUSE_14_RECRUIT,
  'house-15-recruit': HOUSE_15_RECRUIT,
  'house-16-victory': HOUSE_16_VICTORY,
  'house-17-recruit': HOUSE_17_RECRUIT,
  'house-18-djinn': HOUSE_18_DJINN,
  'house-19-victory': HOUSE_19_VICTORY,
  'house-20-djinn': HOUSE_20_DJINN,
};
