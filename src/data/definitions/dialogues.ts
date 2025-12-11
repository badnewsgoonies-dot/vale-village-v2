import type { DialogueTree } from '@/core/models/dialogue';
import { VS1_SCENE_PRE, VS1_SCENE_POST, VS1_ENCOUNTER_ID } from '../../story/vs1Constants';
import { RECRUITMENT_DIALOGUES } from './recruitmentDialogues';
import { HOUSE_ENEMY_DIALOGUES } from './houseEnemyDialogues';
import { POST_BATTLE_DIALOGUES } from './postBattleDialogues';

export const VS1_PRE_SCENE: DialogueTree = {
  id: VS1_SCENE_PRE,
  name: "VS1: Garet's Challenge",
  startNodeId: 'intro',
  nodes: [
    {
      id: 'intro',
      speaker: 'Isaac',
      text: 'Garet... I need to prove myself.',
      portrait: 'isaac',
      nextNodeId: 'challenge',
    },
    {
      id: 'challenge',
      speaker: 'Garet',
      text: "Show me what you've got, Isaac! Let's see if you're ready.",
      portrait: 'garet',
      effects: { startBattle: VS1_ENCOUNTER_ID },
    },
  ],
};

export const VS1_POST_SCENE: DialogueTree = {
  id: VS1_SCENE_POST,
  name: 'VS1: Garet Joins',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Isaac',
      text: 'You fought well, Garet.',
      portrait: 'isaac',
      nextNodeId: 'garet-response',
    },
    {
      id: 'garet-response',
      speaker: 'Garet',
      text: "You've got what it takes. I'm joining your team!",
      portrait: 'garet',
      nextNodeId: 'forge',
    },
    {
      id: 'forge',
      speaker: 'Garet',
      text: "And take this Forge Djinn - it'll help us both in battle.",
      portrait: 'garet',
      effects: {
        // Mirror House 1 rewards in a narrative, VS1-only context
        recruitUnit: 'war-mage',
        grantDjinn: 'forge',
      },
    },
  ],
};

// First Djinn Intro - Flint explains the global Djinn pool
export const DJINN_INTRO_DIALOGUE: DialogueTree = {
  id: 'tutorial:djinn-intro',
  name: 'Djinn Tutorial: Flint\'s Guidance',
  startNodeId: 'flint-appears',
  nodes: [
    {
      id: 'flint-appears',
      speaker: 'Flint',
      text: "Hey Isaac! I'm Flint, your first Djinn. Mind if I explain how my power works?",
      portrait: 'djinn-venus',
      nextNodeId: 'djinn-explain-pool',
    },
    {
      id: 'djinn-explain-pool',
      speaker: 'Flint',
      text: 'Djinn travel as a shared pool for your whole party. You can Set up to three of us at once.',
      portrait: 'djinn-venus',
      nextNodeId: 'djinn-explain-team',
    },
    {
      id: 'djinn-explain-team',
      speaker: 'Flint',
      text: "When we're Set, we empower every Adept in your active team with new abilities and stat boosts.",
      portrait: 'djinn-venus',
      nextNodeId: 'djinn-prebattle-reminder',
    },
    {
      id: 'djinn-prebattle-reminder',
      speaker: 'Flint',
      text: "Before big fights, you'll see a Djinn panel during battle prep. That's where you pick which three of us travel into combat.",
      portrait: 'djinn-venus',
      nextNodeId: 'djinn-outro',
    },
    {
      id: 'djinn-outro',
      speaker: 'Flint',
      text: "That's all you need for now. I'll handle the rest—just remember to keep an eye on those three slots!",
      portrait: 'djinn-venus',
      effects: {
        // Use story flag for tutorial completion; Djinn is already present from the starting team setup
        grantDjinn: 'flint',
        first_djinn_intro_completed: true,
      },
    },
  ],
};

export const SHOPKEEPER_DIALOGUE: DialogueTree = {
  id: 'shopkeeper-weapons',
  name: 'Weapon Shop Owner',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Shopkeeper',
      text: 'Welcome to my shop! Looking for a new weapon?',
      portrait: 'shopkeeper',
      choices: [
        { id: 'buy', text: 'Show me your wares.', nextNodeId: 'show-shop' },
        { id: 'leave', text: 'Just browsing.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'show-shop',
      speaker: 'Shopkeeper',
      text: 'Here are my finest weapons!',
      portrait: 'shopkeeper',
      effects: { openShop: true },
    },
    {
      id: 'farewell',
      speaker: 'Shopkeeper',
      text: 'Come back anytime!',
      portrait: 'shopkeeper',
    },
  ],
};

// ============================================================================
// SHOPKEEPER PERSONALITIES - Varied merchant characters
// ============================================================================

export const GRUMPY_SHOPKEEPER: DialogueTree = {
  id: 'shopkeeper-grumpy',
  name: 'Grumpy Arms Dealer',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Grimwald',
      text: '*barely looks up* Yeah, yeah. Buying or wasting my time?',
      portrait: 'shopkeeper-grumpy',
      choices: [
        { id: 'buy', text: "I'm here to buy.", nextNodeId: 'show-shop' },
        { id: 'chat', text: 'Rough day?', nextNodeId: 'complain' },
        { id: 'leave', text: 'Never mind.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'show-shop',
      speaker: 'Grimwald',
      text: '*sighs heavily* Fine. Take a look. Touch anything you break, you bought.',
      portrait: 'shopkeeper-grumpy',
      effects: { openShop: true },
    },
    {
      id: 'complain',
      speaker: 'Grimwald',
      text: "Rough day? Rough decade. Used to forge weapons for the king's army. Now I sell to kids fighting shadows.",
      portrait: 'shopkeeper-grumpy',
      nextNodeId: 'complain-2',
    },
    {
      id: 'complain-2',
      speaker: 'Grimwald',
      text: '*grumbles* At least you lot actually use the steel. Half these villagers would rather hide than fight.',
      portrait: 'shopkeeper-grumpy',
      nextNodeId: 'grudging-respect',
    },
    {
      id: 'grudging-respect',
      speaker: 'Grimwald',
      text: "...You've got spine, coming in here. Alright. I'll show you the good stuff.",
      portrait: 'shopkeeper-grumpy',
      effects: { openShop: true },
    },
    {
      id: 'farewell',
      speaker: 'Grimwald',
      text: '*waves dismissively* Door works both ways.',
      portrait: 'shopkeeper-grumpy',
    },
  ],
};

export const ENTHUSIASTIC_SHOPKEEPER: DialogueTree = {
  id: 'shopkeeper-enthusiastic',
  name: 'Enthusiastic Inventor',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Tinkerbelle',
      text: 'CUSTOMER! Oh this is wonderful! Have you seen my latest invention? It shoots fire AND ice!',
      portrait: 'shopkeeper-inventor',
      choices: [
        { id: 'buy', text: "Sounds dangerous. Show me what you've got.", nextNodeId: 'show-shop' },
        { id: 'ask-invention', text: 'Fire AND ice? How does that work?', nextNodeId: 'explain' },
        { id: 'leave', text: "I'll come back later...", nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'show-shop',
      speaker: 'Tinkerbelle',
      text: '*nearly trips over prototype* Here! Everything is hand-crafted! Mostly stable! Probably!',
      portrait: 'shopkeeper-inventor',
      effects: { openShop: true },
    },
    {
      id: 'explain',
      speaker: 'Tinkerbelle',
      text: "Opposing elemental resonance! You channel Mars and Mercury Psynergy through alternating chambers and—",
      portrait: 'shopkeeper-inventor',
      nextNodeId: 'explain-2',
    },
    {
      id: 'explain-2',
      speaker: 'Tinkerbelle',
      text: '*sparks fly from a nearby device* —theoretically it shouldn\'t explode! I\'ve only had three explosions this week!',
      portrait: 'shopkeeper-inventor',
      nextNodeId: 'explain-3',
    },
    {
      id: 'explain-3',
      speaker: 'Tinkerbelle',
      text: 'Want to see the catalog? I also make defensive gear! Very few of those explode!',
      portrait: 'shopkeeper-inventor',
      effects: { openShop: true },
    },
    {
      id: 'farewell',
      speaker: 'Tinkerbelle',
      text: 'Come back soon! I\'m working on boots that let you walk through walls! Well, one wall. Once.',
      portrait: 'shopkeeper-inventor',
    },
  ],
};

export const SHREWD_MERCHANT: DialogueTree = {
  id: 'shopkeeper-shrewd',
  name: 'Shrewd Merchant',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Goldwyn',
      text: '*steeples fingers* Ah, the hero of Vale. Your reputation precedes you... as does your need for quality equipment.',
      portrait: 'shopkeeper-shrewd',
      choices: [
        { id: 'buy', text: 'What do you have?', nextNodeId: 'appraise' },
        { id: 'negotiate', text: 'I hope your prices are fair.', nextNodeId: 'negotiate' },
        { id: 'leave', text: 'Another time.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'appraise',
      speaker: 'Goldwyn',
      text: '*eyes your current equipment* Hmm. Adequate gear, but I see room for improvement. Allow me...',
      portrait: 'shopkeeper-shrewd',
      effects: { openShop: true },
    },
    {
      id: 'negotiate',
      speaker: 'Goldwyn',
      text: '*chuckles* Fair is a matter of perspective. My prices reflect quality, availability, and... current circumstances.',
      portrait: 'shopkeeper-shrewd',
      nextNodeId: 'negotiate-2',
    },
    {
      id: 'negotiate-2',
      speaker: 'Goldwyn',
      text: 'The Overseer\'s grip has made supply lines... difficult. But for someone liberating the village? I might find some flexibility.',
      portrait: 'shopkeeper-shrewd',
      nextNodeId: 'negotiate-3',
    },
    {
      id: 'negotiate-3',
      speaker: 'Goldwyn',
      text: '*slides open a hidden drawer* These items aren\'t on the regular menu. Interested?',
      portrait: 'shopkeeper-shrewd',
      effects: { openShop: true },
    },
    {
      id: 'farewell',
      speaker: 'Goldwyn',
      text: 'Business is always open, hero. When you\'re ready to invest in survival, you know where to find me.',
      portrait: 'shopkeeper-shrewd',
    },
  ],
};

export const RETIRED_WARRIOR_SHOP: DialogueTree = {
  id: 'shopkeeper-warrior',
  name: 'Retired Warrior Shop',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Old Rusk',
      text: '*sets down whetstone* Another fighter. I can always tell. You\'ve got that look in your eyes.',
      portrait: 'shopkeeper-warrior',
      choices: [
        { id: 'buy', text: 'I need equipment for the battles ahead.', nextNodeId: 'show-shop' },
        { id: 'ask-past', text: 'You were a warrior?', nextNodeId: 'past' },
        { id: 'ask-tips', text: 'Any advice from experience?', nextNodeId: 'advice' },
        { id: 'leave', text: 'Take care, old timer.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'show-shop',
      speaker: 'Old Rusk',
      text: 'Every piece here I\'ve tested in battle myself. Nothing fancy—just steel that won\'t fail you when it matters.',
      portrait: 'shopkeeper-warrior',
      effects: { openShop: true },
    },
    {
      id: 'past',
      speaker: 'Old Rusk',
      text: '*rubs old scar* Forty years with a blade. Fought in the Lalivero campaign, the Tolbi uprising, the Sol Sanctum expedition.',
      portrait: 'shopkeeper-warrior',
      nextNodeId: 'past-2',
    },
    {
      id: 'past-2',
      speaker: 'Old Rusk',
      text: 'Knees gave out before my spirit did. Now I make sure the next generation has proper steel. It\'s not retirement—it\'s redeployment.',
      portrait: 'shopkeeper-warrior',
      nextNodeId: 'greeting',
    },
    {
      id: 'advice',
      speaker: 'Old Rusk',
      text: 'Never neglect your armor. Glory-seekers fixate on their weapons, but dead heroes don\'t tell tales.',
      portrait: 'shopkeeper-warrior',
      nextNodeId: 'advice-2',
    },
    {
      id: 'advice-2',
      speaker: 'Old Rusk',
      text: 'And always—ALWAYS—carry a backup weapon. Lost my main blade fighting a Golem once. Would\'ve died if not for my boot knife.',
      portrait: 'shopkeeper-warrior',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Old Rusk',
      text: '*nods solemnly* Give \'em hell, kid. Show that Overseer what Vale is made of.',
      portrait: 'shopkeeper-warrior',
    },
  ],
};

export const MYSTERIOUS_ARTIFACT_DEALER: DialogueTree = {
  id: 'shopkeeper-artifacts',
  name: 'Mysterious Artifact Dealer',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Whisper',
      text: '*speaks from the shadows* You seek power beyond common steel. I sense it.',
      portrait: 'shopkeeper-mysterious',
      choices: [
        { id: 'buy', text: 'What do you offer?', nextNodeId: 'show-shop' },
        { id: 'ask-artifacts', text: 'Where do your artifacts come from?', nextNodeId: 'origins' },
        { id: 'suspicious', text: 'Why hide in the dark?', nextNodeId: 'suspicious' },
        { id: 'leave', text: 'This feels wrong. Goodbye.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'show-shop',
      speaker: 'Whisper',
      text: 'Items touched by ancient Psynergy. Each carries... history. Handle with care.',
      portrait: 'shopkeeper-mysterious',
      effects: { openShop: true },
    },
    {
      id: 'origins',
      speaker: 'Whisper',
      text: 'Ruins older than memory. Temples where the Wise One was worshipped. Places where Alchemy still lingers.',
      portrait: 'shopkeeper-mysterious',
      nextNodeId: 'origins-2',
    },
    {
      id: 'origins-2',
      speaker: 'Whisper',
      text: 'The Overseer seeks these relics too. Keeping them from him is... part of my service to Vale.',
      portrait: 'shopkeeper-mysterious',
      nextNodeId: 'greeting',
    },
    {
      id: 'suspicious',
      speaker: 'Whisper',
      text: '*soft laugh* Light casts shadows, young Adept. I work where the Overseer\'s eyes cannot reach.',
      portrait: 'shopkeeper-mysterious',
      nextNodeId: 'suspicious-2',
    },
    {
      id: 'suspicious-2',
      speaker: 'Whisper',
      text: 'Trust is earned, not given. Perhaps in time you will understand my methods. For now, know that we share an enemy.',
      portrait: 'shopkeeper-mysterious',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Whisper',
      text: 'Caution is wise. Return when you understand that darkness is merely... a tool.',
      portrait: 'shopkeeper-mysterious',
    },
  ],
};

// ============================================================================
// NPC CONVERSATIONS - Village inhabitants and story characters
// ============================================================================

export const ELDER_WISDOM: DialogueTree = {
  id: 'npc-elder-wisdom',
  name: 'Village Elder Wisdom',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Village Elder',
      text: 'Ah, young Isaac. The weight of Vale rests on your shoulders, yet you stand tall.',
      portrait: 'elder',
      choices: [
        { id: 'ask-history', text: 'What happened to our village?', nextNodeId: 'history' },
        { id: 'ask-advice', text: 'Do you have any advice for the battles ahead?', nextNodeId: 'advice' },
        { id: 'leave', text: 'I should get moving.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'history',
      speaker: 'Village Elder',
      text: 'The Overseer came with promises of order, but brought only chains. House by house, our people were imprisoned.',
      portrait: 'elder',
      nextNodeId: 'history-2',
    },
    {
      id: 'history-2',
      speaker: 'Village Elder',
      text: 'The Djinn fled into hiding. Without their power, we had no way to resist. Until you awakened your Psynergy.',
      portrait: 'elder',
      nextNodeId: 'greeting',
    },
    {
      id: 'advice',
      speaker: 'Village Elder',
      text: 'Remember: a Djinn Set grants passive power. But unleashing one can turn the tide of battle.',
      portrait: 'elder',
      nextNodeId: 'advice-2',
    },
    {
      id: 'advice-2',
      speaker: 'Village Elder',
      text: 'Collect all four elements and you may call upon the great Summons. That is how the ancient Adepts won their wars.',
      portrait: 'elder',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Village Elder',
      text: 'May the light of Sol guide your path, young Adept.',
      portrait: 'elder',
    },
  ],
};

export const HEALER_NPC: DialogueTree = {
  id: 'npc-healer',
  name: 'Village Healer',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Healer Mira',
      text: 'You look weary from battle. Let me tend to your wounds.',
      portrait: 'healer',
      choices: [
        { id: 'heal', text: 'Please, I could use some rest.', nextNodeId: 'heal-party' },
        { id: 'ask-tips', text: 'Any healing tips for combat?', nextNodeId: 'tips' },
        { id: 'leave', text: "I'm fine, thank you.", nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'heal-party',
      speaker: 'Healer Mira',
      text: '*closes eyes and channels Mercury Psynergy* There. Your party is fully restored.',
      portrait: 'healer',
      effects: { healParty: true },
    },
    {
      id: 'tips',
      speaker: 'Healer Mira',
      text: 'Mercury Djinn boost healing power. And remember - healing an ally is often better than dealing damage to an enemy.',
      portrait: 'healer',
      nextNodeId: 'tips-2',
    },
    {
      id: 'tips-2',
      speaker: 'Healer Mira',
      text: "A dead ally deals no damage at all. Keep your healers protected, and they'll keep everyone alive.",
      portrait: 'healer',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Healer Mira',
      text: 'Stay safe out there. The village needs you.',
      portrait: 'healer',
    },
  ],
};

export const BLACKSMITH_NPC: DialogueTree = {
  id: 'npc-blacksmith',
  name: 'Village Blacksmith',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Blacksmith Torren',
      text: '*wipes brow* Another warrior seeking steel? Good. We need fighters.',
      portrait: 'blacksmith',
      choices: [
        { id: 'shop', text: 'Show me what you have.', nextNodeId: 'show-wares' },
        { id: 'ask-equipment', text: 'What equipment should I prioritize?', nextNodeId: 'equipment-advice' },
        { id: 'leave', text: 'Just passing through.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'show-wares',
      speaker: 'Blacksmith Torren',
      text: 'Fresh from the forge. Take what you need.',
      portrait: 'blacksmith',
      effects: { openShop: true },
    },
    {
      id: 'equipment-advice',
      speaker: 'Blacksmith Torren',
      text: 'Venus Adepts like yourself? Heavy armor and a sturdy blade. Let the Earth guide your strikes.',
      portrait: 'blacksmith',
      nextNodeId: 'equipment-advice-2',
    },
    {
      id: 'equipment-advice-2',
      speaker: 'Blacksmith Torren',
      text: 'Mars warriors prefer lighter armor for mobility. Jupiter users need robes that channel their Psynergy. Mercury? Balanced gear works best.',
      portrait: 'blacksmith',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Blacksmith Torren',
      text: "Break their weapons, not yours. That's the blacksmith's wisdom.",
      portrait: 'blacksmith',
    },
  ],
};

export const SCARED_VILLAGER: DialogueTree = {
  id: 'npc-scared-villager',
  name: 'Frightened Villager',
  startNodeId: 'hiding',
  nodes: [
    {
      id: 'hiding',
      speaker: 'Frightened Villager',
      text: '*peeks out from behind barrels* A-are they gone? The soldiers?',
      portrait: 'villager',
      choices: [
        { id: 'reassure', text: "You're safe now. We drove them back.", nextNodeId: 'relief' },
        { id: 'ask-info', text: 'What did you see? Any information helps.', nextNodeId: 'info' },
      ],
    },
    {
      id: 'relief',
      speaker: 'Frightened Villager',
      text: '*exhales shakily* Thank the spirits. I thought... I thought they would take me like the others.',
      portrait: 'villager',
      nextNodeId: 'gratitude',
    },
    {
      id: 'info',
      speaker: 'Frightened Villager',
      text: 'The Overseer... he has powerful Adepts guarding the inner houses. They wield Mars and Jupiter Psynergy.',
      portrait: 'villager',
      nextNodeId: 'info-2',
    },
    {
      id: 'info-2',
      speaker: 'Frightened Villager',
      text: "But I heard whispers... some of the Overseer's soldiers aren't loyal. They were forced to serve, just like us.",
      portrait: 'villager',
      nextNodeId: 'gratitude',
    },
    {
      id: 'gratitude',
      speaker: 'Frightened Villager',
      text: 'Please, free the others. My family is still trapped in House 14...',
      portrait: 'villager',
    },
  ],
};

export const VETERAN_SOLDIER: DialogueTree = {
  id: 'npc-veteran-soldier',
  name: 'Veteran Soldier',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Veteran Marcus',
      text: "I've seen many battles, young Adept. But none with stakes this high.",
      portrait: 'soldier',
      choices: [
        { id: 'ask-tactics', text: 'Any battle tactics you can share?', nextNodeId: 'tactics' },
        { id: 'ask-enemies', text: 'Tell me about the enemies ahead.', nextNodeId: 'enemies' },
        { id: 'leave', text: 'Stay safe, soldier.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'tactics',
      speaker: 'Veteran Marcus',
      text: 'Speed wins fights. A fast unit can strike twice before a slow enemy acts once.',
      portrait: 'soldier',
      nextNodeId: 'tactics-2',
    },
    {
      id: 'tactics-2',
      speaker: 'Veteran Marcus',
      text: "But don't neglect defense. A dead warrior is a useless warrior. Balance your approach.",
      portrait: 'soldier',
      nextNodeId: 'tactics-3',
    },
    {
      id: 'tactics-3',
      speaker: 'Veteran Marcus',
      text: 'And elemental advantage... Mars burns Jupiter, Jupiter shocks Venus, Venus crushes Mercury, Mercury douses Mars. Remember that cycle.',
      portrait: 'soldier',
      nextNodeId: 'greeting',
    },
    {
      id: 'enemies',
      speaker: 'Veteran Marcus',
      text: 'Early houses have scouts - fast but fragile. Mid houses have soldiers with better armor. Late houses...',
      portrait: 'soldier',
      nextNodeId: 'enemies-2',
    },
    {
      id: 'enemies-2',
      speaker: 'Veteran Marcus',
      text: '*lowers voice* The Arcane Enforcers use devastating Psynergy. And the Overseer himself... they say he commands all four elements.',
      portrait: 'soldier',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Veteran Marcus',
      text: 'Fight with honor, Adept. And survive. Vale needs heroes who live.',
      portrait: 'soldier',
    },
  ],
};

export const MERCHANT_TRAVELER: DialogueTree = {
  id: 'npc-merchant-traveler',
  name: 'Traveling Merchant',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Merchant Thalia',
      text: 'Greetings, traveler! I bring rare goods from across Weyard. Interested?',
      portrait: 'merchant',
      choices: [
        { id: 'browse', text: 'Show me what you have.', nextNodeId: 'show-goods' },
        { id: 'ask-news', text: 'Any news from other villages?', nextNodeId: 'news' },
        { id: 'leave', text: 'Not today, thanks.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'show-goods',
      speaker: 'Merchant Thalia',
      text: 'Artifacts, equipment, and curiosities from every corner of the world!',
      portrait: 'merchant',
      effects: { openShop: true },
    },
    {
      id: 'news',
      speaker: 'Merchant Thalia',
      text: 'The other villages speak of Vale with hope. Word of your liberation spreads fast.',
      portrait: 'merchant',
      nextNodeId: 'news-2',
    },
    {
      id: 'news-2',
      speaker: 'Merchant Thalia',
      text: "Some say other villages may rise up too, inspired by your deeds. You're becoming quite famous, you know.",
      portrait: 'merchant',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Merchant Thalia',
      text: "Safe travels! And if you find any rare artifacts, I'm always buying!",
      portrait: 'merchant',
    },
  ],
};

export const CHILD_NPC: DialogueTree = {
  id: 'npc-hopeful-child',
  name: 'Hopeful Child',
  startNodeId: 'excited',
  nodes: [
    {
      id: 'excited',
      speaker: 'Young Pip',
      text: "Wow! You're the hero everyone's talking about! Can I see your Djinn?!",
      portrait: 'child',
      choices: [
        { id: 'show-djinn', text: '*calls Flint* Say hello, Flint.', nextNodeId: 'flint-appears' },
        { id: 'encourage', text: 'Maybe one day you\'ll have your own Djinn.', nextNodeId: 'dream' },
        { id: 'leave', text: 'Stay safe, kid.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'flint-appears',
      speaker: 'Flint',
      text: 'Hello, little one! *bounces playfully*',
      portrait: 'djinn-venus',
      nextNodeId: 'child-amazed',
    },
    {
      id: 'child-amazed',
      speaker: 'Young Pip',
      text: "It's so cute! When I grow up, I'm gonna be an Adept just like you and free ALL the villages!",
      portrait: 'child',
    },
    {
      id: 'dream',
      speaker: 'Young Pip',
      text: 'Really?! *eyes sparkle* I practice my Psynergy every day! Watch! *nothing happens*',
      portrait: 'child',
      nextNodeId: 'dream-2',
    },
    {
      id: 'dream-2',
      speaker: 'Young Pip',
      text: '...It usually works better than that. But I\'ll keep trying!',
      portrait: 'child',
    },
    {
      id: 'farewell',
      speaker: 'Young Pip',
      text: 'Beat up the bad guys for me! I believe in you!',
      portrait: 'child',
    },
  ],
};

export const MYSTERIOUS_STRANGER: DialogueTree = {
  id: 'npc-mysterious-stranger',
  name: 'Mysterious Stranger',
  startNodeId: 'ominous',
  nodes: [
    {
      id: 'ominous',
      speaker: '???',
      text: '*hooded figure watches from shadows* ...You carry the light of the ancients.',
      portrait: 'mysterious',
      choices: [
        { id: 'who', text: 'Who are you?', nextNodeId: 'identity' },
        { id: 'ancients', text: 'The ancients? What do you mean?', nextNodeId: 'prophecy' },
        { id: 'leave', text: '*back away slowly*', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'identity',
      speaker: '???',
      text: 'Names are... unimportant. What matters is what you will become.',
      portrait: 'mysterious',
      nextNodeId: 'cryptic',
    },
    {
      id: 'prophecy',
      speaker: '???',
      text: 'Long ago, Adepts wielded the power of Alchemy to shape the world. That power sleeps within you.',
      portrait: 'mysterious',
      nextNodeId: 'prophecy-2',
    },
    {
      id: 'prophecy-2',
      speaker: '???',
      text: 'The Lighthouses must be lit again. But first... Vale must be free. You walk the right path.',
      portrait: 'mysterious',
      nextNodeId: 'cryptic',
    },
    {
      id: 'cryptic',
      speaker: '???',
      text: 'We will meet again, Isaac of Vale. When the final seal breaks.',
      portrait: 'mysterious',
      nextNodeId: 'vanish',
    },
    {
      id: 'vanish',
      speaker: 'Isaac',
      text: '*the stranger vanishes into shadow* ...What was that about?',
      portrait: 'isaac',
    },
    {
      id: 'farewell',
      speaker: '???',
      text: '*melts into the darkness* ...Wise to be cautious. But courage suits you better.',
      portrait: 'mysterious',
    },
  ],
};

// ============================================================================
// ADDITIONAL RECRUITMENT DIALOGUES - Missing houses
// ============================================================================

export const HOUSE_06_POST_BATTLE: DialogueTree = {
  id: 'house-06-post',
  name: 'House 06: Victory',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Isaac',
      text: 'That Stone Guardian was tough. Our first real challenge.',
      portrait: 'isaac',
      nextNodeId: 'team-response',
    },
    {
      id: 'team-response',
      speaker: 'War Mage',
      text: 'Good thing we had fire on our side! Nothing beats Mars Psynergy for breaking through defenses.',
      portrait: 'garet',
    },
  ],
};

export const HOUSE_09_POST_BATTLE: DialogueTree = {
  id: 'house-09-post',
  name: 'House 09: Victory',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Mystic',
      text: 'Those healers were relentless. I had to outpace their recovery.',
      portrait: 'mystic',
      nextNodeId: 'isaac-response',
    },
    {
      id: 'isaac-response',
      speaker: 'Isaac',
      text: 'Focus fire is key against healers. Take them down before they can restore their allies.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_10_MILESTONE: DialogueTree = {
  id: 'house-10-milestone',
  name: 'House 10: Halfway Point',
  startNodeId: 'milestone',
  nodes: [
    {
      id: 'milestone',
      speaker: 'Isaac',
      text: 'Ten houses liberated. Half the village is free.',
      portrait: 'isaac',
      nextNodeId: 'ranger-observation',
    },
    {
      id: 'ranger-observation',
      speaker: 'Ranger',
      text: 'The Overseer must be getting nervous. Expect stronger resistance from here.',
      portrait: 'ranger',
      nextNodeId: 'war-mage-ready',
    },
    {
      id: 'war-mage-ready',
      speaker: 'War Mage',
      text: "Bring it on! We've got momentum now. Nothing can stop us!",
      portrait: 'garet',
    },
  ],
};

export const HOUSE_13_POST_BATTLE: DialogueTree = {
  id: 'house-13-post',
  name: 'House 13: Victory',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Isaac',
      text: 'The inner ring defenses are crumbling. We can see the end.',
      portrait: 'isaac',
      nextNodeId: 'mystic-caution',
    },
    {
      id: 'mystic-caution',
      speaker: 'Mystic',
      text: "Don't get overconfident. The Overseer saved his strongest for last.",
      portrait: 'mystic',
    },
  ],
};

export const HOUSE_16_POST_BATTLE: DialogueTree = {
  id: 'house-16-post',
  name: 'House 16: Victory',
  startNodeId: 'victory',
  nodes: [
    {
      id: 'victory',
      speaker: 'Sentinel',
      text: 'These Arcane Enforcers... they fight without honor. Just raw power.',
      portrait: 'sentinel',
      nextNodeId: 'blaze-response',
    },
    {
      id: 'blaze-response',
      speaker: 'Blaze',
      text: 'Then we match them with our own power. Fire answers fire!',
      portrait: 'blaze',
      nextNodeId: 'isaac-wisdom',
    },
    {
      id: 'isaac-wisdom',
      speaker: 'Isaac',
      text: 'Power alone wins battles. But purpose wins wars. We fight for Vale.',
      portrait: 'isaac',
    },
  ],
};

export const HOUSE_19_PRE_FINAL: DialogueTree = {
  id: 'house-19-pre-final',
  name: 'House 19: Before the End',
  startNodeId: 'gathering',
  nodes: [
    {
      id: 'gathering',
      speaker: 'Isaac',
      text: '*looks at the final house* This is it. The Overseer awaits.',
      portrait: 'isaac',
      nextNodeId: 'team-rally',
    },
    {
      id: 'team-rally',
      speaker: 'Felix',
      text: "We've come too far to fail now. Whatever happens in there, we face it together.",
      portrait: 'felix',
      nextNodeId: 'karis-support',
    },
    {
      id: 'karis-support',
      speaker: 'Karis',
      text: 'The winds carry the hopes of every villager. We will not let them down.',
      portrait: 'karis',
      nextNodeId: 'final-charge',
    },
    {
      id: 'final-charge',
      speaker: 'Isaac',
      text: 'For Vale. For freedom. Let\'s end this!',
      portrait: 'isaac',
    },
  ],
};

// ============================================================================
// BOSS TAUNTS - Mid-battle and phase transition dialogue
// ============================================================================

export const OVERSEER_BATTLE_TAUNTS: DialogueTree = {
  id: 'boss-overseer-taunts',
  name: 'Overseer Battle Taunts',
  startNodeId: 'taunt-1',
  nodes: [
    {
      id: 'taunt-1',
      speaker: 'Vale Overseer',
      text: 'You think freeing a few houses makes you heroes? Vale will kneel to me forever!',
      portrait: 'enemy-warlord',
    },
    {
      id: 'taunt-2',
      speaker: 'Vale Overseer',
      text: '*laughs coldly* I command all four elements. Your Psynergy is but a candle to my inferno!',
      portrait: 'enemy-warlord',
    },
    {
      id: 'taunt-3',
      speaker: 'Vale Overseer',
      text: 'Every Adept who opposed me lies broken. You will be no different.',
      portrait: 'enemy-warlord',
    },
    {
      id: 'phase-2',
      speaker: 'Vale Overseer',
      text: '*aura intensifies* Impressive... but now you face my TRUE power! MEGIDDO!',
      portrait: 'enemy-warlord',
    },
    {
      id: 'desperate',
      speaker: 'Vale Overseer',
      text: 'No! This cannot be! I am the master of Alchemy itself!',
      portrait: 'enemy-warlord',
    },
    {
      id: 'defeat',
      speaker: 'Vale Overseer',
      text: '*staggers* The light... I see it now. Perhaps Vale was never mine to rule...',
      portrait: 'enemy-warlord',
    },
  ],
};

export const MINIBOSS_STONE_GUARDIAN: DialogueTree = {
  id: 'boss-stone-guardian',
  name: 'Stone Guardian Taunts',
  startNodeId: 'taunt-1',
  nodes: [
    {
      id: 'taunt-1',
      speaker: 'Stone Guardian',
      text: '*earth trembles* I have stood for a thousand years. You will not pass.',
      portrait: 'enemy-golem',
    },
    {
      id: 'taunt-2',
      speaker: 'Stone Guardian',
      text: 'The mountain does not move for the wind. Neither shall I move for you.',
      portrait: 'enemy-golem',
    },
    {
      id: 'damaged',
      speaker: 'Stone Guardian',
      text: '*cracks form* You... chip away at ancient stone. But mountains endure.',
      portrait: 'enemy-golem',
    },
    {
      id: 'defeat',
      speaker: 'Stone Guardian',
      text: '*crumbles* At last... rest. Guard well what I could not...',
      portrait: 'enemy-golem',
    },
  ],
};

export const MINIBOSS_FLAME_WITCH: DialogueTree = {
  id: 'boss-flame-witch',
  name: 'Flame Witch Taunts',
  startNodeId: 'taunt-1',
  nodes: [
    {
      id: 'taunt-1',
      speaker: 'Pyralis',
      text: '*flames dance around her* How delicious... more kindling for my fire.',
      portrait: 'enemy-witch',
    },
    {
      id: 'taunt-2',
      speaker: 'Pyralis',
      text: 'The Overseer promised me power. Your ashes will make excellent payment.',
      portrait: 'enemy-witch',
    },
    {
      id: 'taunt-3',
      speaker: 'Pyralis',
      text: '*cackles* Mars fury knows no mercy! BURN!',
      portrait: 'enemy-witch',
    },
    {
      id: 'damaged',
      speaker: 'Pyralis',
      text: 'Tch! Lucky strike. But fire only grows stronger when challenged!',
      portrait: 'enemy-witch',
    },
    {
      id: 'defeat',
      speaker: 'Pyralis',
      text: '*flames sputter* The fire... goes cold. I should have... burned brighter...',
      portrait: 'enemy-witch',
    },
  ],
};

export const MINIBOSS_WIND_ASSASSIN: DialogueTree = {
  id: 'boss-wind-assassin',
  name: 'Wind Assassin Taunts',
  startNodeId: 'taunt-1',
  nodes: [
    {
      id: 'taunt-1',
      speaker: 'Zephyra',
      text: '*appears from nowhere* You cannot fight what you cannot see.',
      portrait: 'enemy-assassin',
    },
    {
      id: 'taunt-2',
      speaker: 'Zephyra',
      text: 'Swift as Jupiter, silent as death. Those are my teachings.',
      portrait: 'enemy-assassin',
    },
    {
      id: 'taunt-3',
      speaker: 'Zephyra',
      text: '*vanishes and reappears* I struck your healer twice before you even noticed.',
      portrait: 'enemy-assassin',
    },
    {
      id: 'damaged',
      speaker: 'Zephyra',
      text: '*winces* You actually landed a hit. Impressive reflexes.',
      portrait: 'enemy-assassin',
    },
    {
      id: 'defeat',
      speaker: 'Zephyra',
      text: 'Faster... I should have been faster... *dissolves into wind*',
      portrait: 'enemy-assassin',
    },
  ],
};

export const MINIBOSS_FROST_KNIGHT: DialogueTree = {
  id: 'boss-frost-knight',
  name: 'Frost Knight Taunts',
  startNodeId: 'taunt-1',
  nodes: [
    {
      id: 'taunt-1',
      speaker: 'Glacius',
      text: '*ice crystallizes on armor* I am the cold that ends all things.',
      portrait: 'enemy-knight',
    },
    {
      id: 'taunt-2',
      speaker: 'Glacius',
      text: 'Mercury Psynergy brings clarity. I see your defeat written in frost.',
      portrait: 'enemy-knight',
    },
    {
      id: 'taunt-3',
      speaker: 'Glacius',
      text: 'Your flames mean nothing. I will freeze the heat from your very souls.',
      portrait: 'enemy-knight',
    },
    {
      id: 'damaged',
      speaker: 'Glacius',
      text: '*ice cracks* You bring warmth to this frozen heart. It is... unwelcome.',
      portrait: 'enemy-knight',
    },
    {
      id: 'defeat',
      speaker: 'Glacius',
      text: 'The thaw comes... Perhaps warmth is not... so terrible... *ice shatters*',
      portrait: 'enemy-knight',
    },
  ],
};

// ============================================================================
// ADDITIONAL NPC VARIETY - More diverse villagers
// ============================================================================

export const ANXIOUS_SCHOLAR: DialogueTree = {
  id: 'npc-anxious-scholar',
  name: 'Anxious Scholar',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Scholar Pellias',
      text: '*adjusts spectacles nervously* Oh! A visitor! I was just—these books—the Overseer banned most of them, you see.',
      portrait: 'scholar',
      choices: [
        { id: 'ask-books', text: 'What kind of books?', nextNodeId: 'books' },
        { id: 'ask-alchemy', text: 'Do you know about Alchemy?', nextNodeId: 'alchemy' },
        { id: 'leave', text: "I'll let you get back to your reading.", nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'books',
      speaker: 'Scholar Pellias',
      text: 'History, mostly. The Overseer wanted us to forget what Vale once was. A center of learning! Of Psynergy research!',
      portrait: 'scholar',
      nextNodeId: 'books-2',
    },
    {
      id: 'books-2',
      speaker: 'Scholar Pellias',
      text: '*whispers* I saved what I could. Hidden compartments, coded margins. Knowledge survives, even in darkness.',
      portrait: 'scholar',
      nextNodeId: 'greeting',
    },
    {
      id: 'alchemy',
      speaker: 'Scholar Pellias',
      text: '*eyes light up* Alchemy! The foundational force of Weyard! Venus, Mars, Jupiter, Mercury—the four pillars of creation!',
      portrait: 'scholar',
      nextNodeId: 'alchemy-2',
    },
    {
      id: 'alchemy-2',
      speaker: 'Scholar Pellias',
      text: 'The ancients sealed it away because of its power. The Lighthouses, the Elemental Stars... all connected!',
      portrait: 'scholar',
      nextNodeId: 'alchemy-3',
    },
    {
      id: 'alchemy-3',
      speaker: 'Scholar Pellias',
      text: 'The Overseer seeks to control Alchemy himself. That is why he fears the Adepts. You represent what he cannot possess.',
      portrait: 'scholar',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Scholar Pellias',
      text: '*returns to books* Yes, yes, good luck out there. Knowledge is power—remember that!',
      portrait: 'scholar',
    },
  ],
};

export const BITTER_FARMER: DialogueTree = {
  id: 'npc-bitter-farmer',
  name: 'Bitter Farmer',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Farmer Gord',
      text: '*spits* Another "hero." Where were you when they burned my crops? Took my daughter?',
      portrait: 'farmer',
      choices: [
        { id: 'apologize', text: "I'm sorry. I came as soon as I could.", nextNodeId: 'soften' },
        { id: 'promise', text: "I'll make this right. I swear it.", nextNodeId: 'promise' },
        { id: 'leave', text: '*say nothing and leave*', nextNodeId: 'farewell-bitter' },
      ],
    },
    {
      id: 'soften',
      speaker: 'Farmer Gord',
      text: '*long pause* ...Aye. I know you didn\'t make this mess. The Overseer did.',
      portrait: 'farmer',
      nextNodeId: 'soften-2',
    },
    {
      id: 'soften-2',
      speaker: 'Farmer Gord',
      text: "Mara's in House 15. If you free that house... bring her home. Please.",
      portrait: 'farmer',
    },
    {
      id: 'promise',
      speaker: 'Farmer Gord',
      text: '*eyes narrow* Words are cheap. Actions aren\'t. Free House 15 and I\'ll believe you.',
      portrait: 'farmer',
      nextNodeId: 'promise-2',
    },
    {
      id: 'promise-2',
      speaker: 'Farmer Gord',
      text: "Until then, you're just another dreamer with a sword.",
      portrait: 'farmer',
    },
    {
      id: 'farewell-bitter',
      speaker: 'Farmer Gord',
      text: '*grunts* Yeah. Walk away. Everyone does.',
      portrait: 'farmer',
    },
  ],
};

export const OPTIMISTIC_BAKER: DialogueTree = {
  id: 'npc-optimistic-baker',
  name: 'Optimistic Baker',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Baker Mildred',
      text: '*dusts flour off hands* Fresh bread! Best in Vale! Well, the only in Vale right now, but still!',
      portrait: 'baker',
      choices: [
        { id: 'ask-bread', text: 'How do you stay so cheerful?', nextNodeId: 'cheerful' },
        { id: 'ask-village', text: 'How is the village holding up?', nextNodeId: 'village' },
        { id: 'leave', text: 'Keep up the good work.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'cheerful',
      speaker: 'Baker Mildred',
      text: '*laughs* Cheerful? Darling, I cried for three weeks when this started.',
      portrait: 'baker',
      nextNodeId: 'cheerful-2',
    },
    {
      id: 'cheerful-2',
      speaker: 'Baker Mildred',
      text: 'But bread still needs baking. People need to eat. If I stop, I let the Overseer win.',
      portrait: 'baker',
      nextNodeId: 'cheerful-3',
    },
    {
      id: 'cheerful-3',
      speaker: 'Baker Mildred',
      text: 'Besides, every loaf is an act of rebellion! *winks* The Overseer hates that we won\'t give up.',
      portrait: 'baker',
      nextNodeId: 'greeting',
    },
    {
      id: 'village',
      speaker: 'Baker Mildred',
      text: 'Better since you arrived! Hope is the best ingredient, and you\'ve given us plenty.',
      portrait: 'baker',
      nextNodeId: 'village-2',
    },
    {
      id: 'village-2',
      speaker: 'Baker Mildred',
      text: 'The freed families help where they can. We share what we have. Community survives where individuals might not.',
      portrait: 'baker',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Baker Mildred',
      text: 'Take this! *hands over bread* You can\'t save Vale on an empty stomach!',
      portrait: 'baker',
    },
  ],
};

export const TRAUMATIZED_GUARD: DialogueTree = {
  id: 'npc-traumatized-guard',
  name: 'Traumatized Former Guard',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Former Guard Dain',
      text: '*stares at hands* I wore their armor. Followed their orders. I\'m no better than them.',
      portrait: 'guard',
      choices: [
        { id: 'reassure', text: 'You deserted. That took courage.', nextNodeId: 'reassure' },
        { id: 'ask-intel', text: 'What do you know about the Overseer\'s forces?', nextNodeId: 'intel' },
        { id: 'leave', text: '*leave him to his thoughts*', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'reassure',
      speaker: 'Former Guard Dain',
      text: 'Courage? I ran. I watched them hurt people and I just... ran.',
      portrait: 'guard',
      nextNodeId: 'reassure-2',
    },
    {
      id: 'reassure-2',
      speaker: 'Former Guard Dain',
      text: '*slowly meets your eyes* But you\'re right. I couldn\'t be part of it anymore. That has to count for something.',
      portrait: 'guard',
      nextNodeId: 'reassure-3',
    },
    {
      id: 'reassure-3',
      speaker: 'Former Guard Dain',
      text: 'If you need backup... I can still fight. Let me make things right.',
      portrait: 'guard',
    },
    {
      id: 'intel',
      speaker: 'Former Guard Dain',
      text: '*focuses* The inner ring guards—they\'re not volunteers. Families held hostage. Break their chains, some might turn.',
      portrait: 'guard',
      nextNodeId: 'intel-2',
    },
    {
      id: 'intel-2',
      speaker: 'Former Guard Dain',
      text: 'The Overseer himself... he has a weakness. His power draws from the four Psynergy types. Overwhelm one, and he falters.',
      portrait: 'guard',
      nextNodeId: 'intel-3',
    },
    {
      id: 'intel-3',
      speaker: 'Former Guard Dain',
      text: 'Focus Venus attacks on him. Earth grounds his power. That\'s what I heard, anyway.',
      portrait: 'guard',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Former Guard Dain',
      text: '*returns to staring at nothing* ...I\'ll be here. When you need me.',
      portrait: 'guard',
    },
  ],
};

export const CHEERFUL_MUSICIAN: DialogueTree = {
  id: 'npc-cheerful-musician',
  name: 'Cheerful Musician',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Minstrel Lyra',
      text: '*strums lute* Ah, the hero approaches! Shall I compose a ballad of your deeds?',
      portrait: 'musician',
      choices: [
        { id: 'song', text: 'I\'d like to hear what you\'ve got.', nextNodeId: 'perform' },
        { id: 'purpose', text: 'How does music help in times like these?', nextNodeId: 'purpose' },
        { id: 'leave', text: 'Maybe another time.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'perform',
      speaker: 'Minstrel Lyra',
      text: '*clears throat* "From Vale\'s darkest hour, a hero arose! With Djinn at their side, they struck mighty blows!"',
      portrait: 'musician',
      nextNodeId: 'perform-2',
    },
    {
      id: 'perform-2',
      speaker: 'Minstrel Lyra',
      text: '"The Overseer trembled, his fortress shook! As freedom was written in Vale\'s newest book!"',
      portrait: 'musician',
      nextNodeId: 'perform-3',
    },
    {
      id: 'perform-3',
      speaker: 'Minstrel Lyra',
      text: '*flourishes* Still a work in progress! But the ending writes itself with every house you free!',
      portrait: 'musician',
    },
    {
      id: 'purpose',
      speaker: 'Minstrel Lyra',
      text: 'Swords fight bodies. Songs fight despair. Both are needed to win a war.',
      portrait: 'musician',
      nextNodeId: 'purpose-2',
    },
    {
      id: 'purpose-2',
      speaker: 'Minstrel Lyra',
      text: 'When the villagers hear music, they remember what peace felt like. That memory becomes motivation.',
      portrait: 'musician',
      nextNodeId: 'purpose-3',
    },
    {
      id: 'purpose-3',
      speaker: 'Minstrel Lyra',
      text: 'Besides, every tyrant hates being mocked in song. My lyrics are weapons too!',
      portrait: 'musician',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Minstrel Lyra',
      text: '*resumes playing* May fortune favor your adventures, hero! I\'ll be here, composing your legend!',
      portrait: 'musician',
    },
  ],
};

export const WORRIED_MOTHER: DialogueTree = {
  id: 'npc-worried-mother',
  name: 'Worried Mother',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Mother Elene',
      text: '*clutches shawl tightly* My children... both of them were taken. Houses 8 and 12.',
      portrait: 'mother',
      choices: [
        { id: 'promise', text: 'I\'ll bring them home. I promise.', nextNodeId: 'hope' },
        { id: 'ask-children', text: 'Tell me about them.', nextNodeId: 'children' },
        { id: 'leave', text: 'Stay strong.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'hope',
      speaker: 'Mother Elene',
      text: '*tears form* Every night I pray to Sol. Every night I believe tomorrow will be different.',
      portrait: 'mother',
      nextNodeId: 'hope-2',
    },
    {
      id: 'hope-2',
      speaker: 'Mother Elene',
      text: 'You... you give that belief meaning. Thank you, Adept. Thank you.',
      portrait: 'mother',
    },
    {
      id: 'children',
      speaker: 'Mother Elene',
      text: 'Tomas is twelve—bright as the sun, always getting into trouble. Lina is fifteen—wanted to be a healer someday.',
      portrait: 'mother',
      nextNodeId: 'children-2',
    },
    {
      id: 'children-2',
      speaker: 'Mother Elene',
      text: 'The soldiers said they\'d be "put to work." I don\'t want to think about what that means.',
      portrait: 'mother',
      nextNodeId: 'children-3',
    },
    {
      id: 'children-3',
      speaker: 'Mother Elene',
      text: 'Please... bring them back to me. I\'ll give you everything I have.',
      portrait: 'mother',
    },
    {
      id: 'farewell',
      speaker: 'Mother Elene',
      text: '*nods weakly* Strong... yes. For them, I must be strong.',
      portrait: 'mother',
    },
  ],
};

export const DEFIANT_TEENAGER: DialogueTree = {
  id: 'npc-defiant-teenager',
  name: 'Defiant Teenager',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Kira',
      text: '*crosses arms* So you\'re the famous hero. Took you long enough.',
      portrait: 'teenager',
      choices: [
        { id: 'patience', text: 'I got here as fast as I could.', nextNodeId: 'patience' },
        { id: 'challenge', text: 'What have you done to help?', nextNodeId: 'challenge' },
        { id: 'leave', text: 'I don\'t have time for attitude.', nextNodeId: 'farewell-rude' },
      ],
    },
    {
      id: 'patience',
      speaker: 'Kira',
      text: '*scoffs* ...Yeah. I know. It\'s not your fault. I\'m just... frustrated.',
      portrait: 'teenager',
      nextNodeId: 'patience-2',
    },
    {
      id: 'patience-2',
      speaker: 'Kira',
      text: 'I wanted to fight. Dad said I was too young. Now he\'s locked in House 16 and I can\'t do anything.',
      portrait: 'teenager',
      nextNodeId: 'respect',
    },
    {
      id: 'challenge',
      speaker: 'Kira',
      text: '*bristles* I ran supplies to the resistance! Gathered intel! Nearly got caught twice!',
      portrait: 'teenager',
      nextNodeId: 'challenge-2',
    },
    {
      id: 'challenge-2',
      speaker: 'Kira',
      text: '...But you\'re right. I haven\'t freed anyone. I can\'t fight like you can.',
      portrait: 'teenager',
      nextNodeId: 'respect',
    },
    {
      id: 'respect',
      speaker: 'Kira',
      text: '*sighs* Look... just get my dad back, okay? House 16. I\'ll... I\'ll help however I can.',
      portrait: 'teenager',
    },
    {
      id: 'farewell-rude',
      speaker: 'Kira',
      text: '*glares* Fine. Go be a hero. I\'ll just stay here being useless.',
      portrait: 'teenager',
    },
  ],
};

export const DRUNK_STORYTELLER: DialogueTree = {
  id: 'npc-drunk-storyteller',
  name: 'Drunk Storyteller',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Old Bartleby',
      text: '*hiccup* Heyyyy! It\'s the... the hero person! Come, sit! I\'ll tell you about the OLD Vale!',
      portrait: 'drunk',
      choices: [
        { id: 'listen', text: 'I\'ll hear your story.', nextNodeId: 'story' },
        { id: 'sober', text: 'Maybe when you\'re sober.', nextNodeId: 'sober' },
        { id: 'leave', text: 'Take care of yourself.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'story',
      speaker: 'Old Bartleby',
      text: '*gestures wildly* Vale used to shine! The Sol Sanctum! The Elemental Academy! Adepts everywhere!',
      portrait: 'drunk',
      nextNodeId: 'story-2',
    },
    {
      id: 'story-2',
      speaker: 'Old Bartleby',
      text: 'Then the seal... the Wise One... *hiccup* ...something about protecting the world from itself.',
      portrait: 'drunk',
      nextNodeId: 'story-3',
    },
    {
      id: 'story-3',
      speaker: 'Old Bartleby',
      text: '*suddenly lucid* The Overseer wants what was sealed. The power beneath Sol Sanctum. You must stop him.',
      portrait: 'drunk',
      nextNodeId: 'story-4',
    },
    {
      id: 'story-4',
      speaker: 'Old Bartleby',
      text: '*falls back into stupor* Anywayyyy... where was I? Oh! More drinks!',
      portrait: 'drunk',
    },
    {
      id: 'sober',
      speaker: 'Old Bartleby',
      text: '*laughs bitterly* Sober? In THIS village? HA! The ale is the only thing keeping me from going mad!',
      portrait: 'drunk',
      nextNodeId: 'sober-2',
    },
    {
      id: 'sober-2',
      speaker: 'Old Bartleby',
      text: 'But... *lowers voice* ...find me after you beat the Overseer. I\'ll tell you things then. Important things.',
      portrait: 'drunk',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Old Bartleby',
      text: '*raises mug* To heroes! And to alcohol! The true... the true saviors of... *trails off*',
      portrait: 'drunk',
    },
  ],
};

export const STERN_PRIESTESS: DialogueTree = {
  id: 'npc-stern-priestess',
  name: 'Stern Priestess',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'Priestess Selara',
      text: '*inclines head formally* The light of Sol guides your steps, young Adept. But guidance is not guarantee.',
      portrait: 'priestess',
      choices: [
        { id: 'blessing', text: 'May I receive a blessing?', nextNodeId: 'blessing' },
        { id: 'ask-faith', text: 'What does the faith teach about the Overseer?', nextNodeId: 'faith' },
        { id: 'leave', text: 'Thank you, Priestess.', nextNodeId: 'farewell' },
      ],
    },
    {
      id: 'blessing',
      speaker: 'Priestess Selara',
      text: '*closes eyes* Sol, patron of light and truth, shield this warrior from shadow and deceit.',
      portrait: 'priestess',
      nextNodeId: 'blessing-2',
    },
    {
      id: 'blessing-2',
      speaker: 'Priestess Selara',
      text: 'Grant strength to their arm, clarity to their mind, and mercy to their heart. So it is spoken.',
      portrait: 'priestess',
      nextNodeId: 'blessing-3',
    },
    {
      id: 'blessing-3',
      speaker: 'Priestess Selara',
      text: '*opens eyes* The blessing is given. What you do with it determines its worth.',
      portrait: 'priestess',
    },
    {
      id: 'faith',
      speaker: 'Priestess Selara',
      text: 'The Overseer claims divine mandate. He lies. Sol favors no tyrant.',
      portrait: 'priestess',
      nextNodeId: 'faith-2',
    },
    {
      id: 'faith-2',
      speaker: 'Priestess Selara',
      text: 'True power comes from balance—the four elements in harmony. The Overseer seeks to dominate them. That is corruption.',
      portrait: 'priestess',
      nextNodeId: 'faith-3',
    },
    {
      id: 'faith-3',
      speaker: 'Priestess Selara',
      text: 'You, Adept, are the answer to our prayers. But do not let pride corrupt you as it did him.',
      portrait: 'priestess',
      nextNodeId: 'greeting',
    },
    {
      id: 'farewell',
      speaker: 'Priestess Selara',
      text: 'Walk in light, Adept. And when darkness seems overwhelming, remember—even a single candle defies the void.',
      portrait: 'priestess',
    },
  ],
};

export const DIALOGUES: Record<string, DialogueTree> = {
  // VS1 Demo
  [VS1_SCENE_PRE]: VS1_PRE_SCENE,
  [VS1_SCENE_POST]: VS1_POST_SCENE,
  // Tutorials
  'tutorial:djinn-intro': DJINN_INTRO_DIALOGUE,
  // Post-battle celebrations
  ...POST_BATTLE_DIALOGUES,
  // Shopkeeper personalities
  'shopkeeper-weapons': SHOPKEEPER_DIALOGUE,
  'shopkeeper-grumpy': GRUMPY_SHOPKEEPER,
  'shopkeeper-enthusiastic': ENTHUSIASTIC_SHOPKEEPER,
  'shopkeeper-shrewd': SHREWD_MERCHANT,
  'shopkeeper-warrior': RETIRED_WARRIOR_SHOP,
  'shopkeeper-artifacts': MYSTERIOUS_ARTIFACT_DEALER,
  // Recruitment dialogues (Houses 1-20)
  ...RECRUITMENT_DIALOGUES,
  // Overworld house defenders (Houses 1-20)
  ...HOUSE_ENEMY_DIALOGUES,
  // NPC Conversations - Original
  'npc-elder-wisdom': ELDER_WISDOM,
  'npc-healer': HEALER_NPC,
  'npc-blacksmith': BLACKSMITH_NPC,
  'npc-scared-villager': SCARED_VILLAGER,
  'npc-veteran-soldier': VETERAN_SOLDIER,
  'npc-merchant-traveler': MERCHANT_TRAVELER,
  'npc-hopeful-child': CHILD_NPC,
  'npc-mysterious-stranger': MYSTERIOUS_STRANGER,
  // NPC Conversations - Additional variety
  'npc-anxious-scholar': ANXIOUS_SCHOLAR,
  'npc-bitter-farmer': BITTER_FARMER,
  'npc-optimistic-baker': OPTIMISTIC_BAKER,
  'npc-traumatized-guard': TRAUMATIZED_GUARD,
  'npc-cheerful-musician': CHEERFUL_MUSICIAN,
  'npc-worried-mother': WORRIED_MOTHER,
  'npc-defiant-teenager': DEFIANT_TEENAGER,
  'npc-drunk-storyteller': DRUNK_STORYTELLER,
  'npc-stern-priestess': STERN_PRIESTESS,
  // Boss taunts and battle dialogue
  'boss-overseer-taunts': OVERSEER_BATTLE_TAUNTS,
  'boss-stone-guardian': MINIBOSS_STONE_GUARDIAN,
  'boss-flame-witch': MINIBOSS_FLAME_WITCH,
  'boss-wind-assassin': MINIBOSS_WIND_ASSASSIN,
  'boss-frost-knight': MINIBOSS_FROST_KNIGHT,
  // Additional post-battle dialogues
  'house-06-post': HOUSE_06_POST_BATTLE,
  'house-09-post': HOUSE_09_POST_BATTLE,
  'house-10-milestone': HOUSE_10_MILESTONE,
  'house-13-post': HOUSE_13_POST_BATTLE,
  'house-16-post': HOUSE_16_POST_BATTLE,
  'house-19-pre-final': HOUSE_19_PRE_FINAL,
};
