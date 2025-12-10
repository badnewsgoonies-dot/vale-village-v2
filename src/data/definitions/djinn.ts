import type { Djinn } from '../schemas/DjinnSchema';

export const FLINT: Djinn = {
  id: 'flint',
  name: 'Flint',
  element: 'Venus',
  tier: '1',
  description: 'A steadfast earth spirit that has watched over mountain villages for centuries.',
  voiceLines: [
    'The earth welcomes a new ally! I am Flint—steady as stone, loyal to the end.',
    'Feel the strength of the mountains flow through you. Together, we are unbreakable!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Stone Barrage scatters earth shards at all foes.',
    damage: 80,
  },
  grantedAbilities: {
    adept: {
      same: [
        'flint-stone-fist',
        'flint-granite-guard',
        'flint-stone-spike',
        'flint-terra-armor',
      ],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
      ],
    },
    sentinel: {
      same: [
        'flint-stone-fist',
        'flint-granite-guard',
        'flint-stone-spike',
        'flint-terra-armor',
      ],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
      ],
    },
    'war-mage': {
      same: [],
      counter: [
        'flint-lava-stone',
        'flint-magma-shield',
        'flint-molten-burst',
        'flint-volcanic-guard',
      ],
      neutral: ['flint-ground-shield', 'flint-rock-barrage'],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
        'flint-soothing-earth',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
        'flint-soothing-earth',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'flint-earth-pulse',
        'flint-ground-shield',
        'flint-rock-barrage',
        'flint-soothing-earth',
      ],
    },
  },
};

export const GRANITE: Djinn = {
  id: 'granite',
  name: 'Granite',
  element: 'Venus',
  tier: '2',
  description: 'An ancient spirit of bedrock, unyielding as the mountains themselves.',
  voiceLines: [
    'I have stood since the world was young. Now I stand with you, Adept.',
    'Like bedrock beneath your feet—I shall never falter, never yield.',
  ],
  summonEffect: {
    type: 'buff',
    description: 'Terra Wall raises nearby allies’ defenses.',
    statBonus: { def: 10 },
  },
  grantedAbilities: {
    adept: {
      same: [
        'granite-earth-wall',
        'granite-terra-break',
        'granite-stone-spike',
        'granite-earthquake',
      ],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
      ],
    },
    sentinel: {
      same: [
        'granite-earth-wall',
        'granite-terra-break',
        'granite-stone-spike',
        'granite-earthquake',
      ],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
      ],
    },
    'war-mage': {
      same: [],
      counter: [
        'granite-magma-barrier',
        'granite-volcanic-spike',
        'granite-magma-blast',
        'granite-volcanic-armor',
      ],
      neutral: ['granite-ground-wave', 'granite-rock-shield'],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
        'granite-terra-heal',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
        'granite-terra-heal',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'granite-ground-pulse',
        'granite-ground-wave',
        'granite-rock-shield',
        'granite-terra-heal',
      ],
    },
  },
};

export const BANE: Djinn = {
  id: 'bane',
  name: 'Bane',
  element: 'Venus',
  tier: '3',
  voiceLines: [
    'The earth TREMBLES at my awakening! I am Bane—the quake that shatters kingdoms!',
    'You have freed a force of nature itself. Use my power wisely... or not. Destruction is beautiful either way.',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Earthquake shakes the whole battlefield.',
    damage: 300,
  },
  grantedAbilities: {
    adept: {
      same: [
        'bane-earthquake',
        'bane-terra-guard',
        'bane-terra-breaker',
        'bane-earthquake-rage',
      ],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
      ],
    },
    sentinel: {
      same: [
        'bane-earthquake',
        'bane-terra-guard',
        'bane-terra-breaker',
        'bane-earthquake-rage',
      ],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
      ],
    },
    'war-mage': {
      same: [],
      counter: [
        'bane-lava-fist',
        'bane-molten-armor',
        'bane-molten-torrent',
        'bane-volcanic-rage',
      ],
      neutral: ['bane-rock-storm', 'bane-terra-pulse'],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
        'bane-earth-revival',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
        'bane-earth-revival',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'bane-rock-pulse',
        'bane-rock-storm',
        'bane-terra-pulse',
        'bane-earth-revival',
      ],
    },
  },
};

export const FORGE: Djinn = {
  id: 'forge',
  name: 'Forge',
  element: 'Mars',
  tier: '1',
  description: 'A blazing spirit born from volcanic fires, fierce and passionate.',
  voiceLines: [
    'Ha! Finally, someone with fire in their heart! I like you already, Adept!',
    'Forge is my name—and together we shall FORGE a path through any who oppose us!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Firebolt barrage burns every foe.',
    damage: 120,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [
        'forge-stone-slam',
        'forge-granite-shield',
        'forge-stone-melt',
        'forge-granite-burn',
      ],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-flame-heal',
      ],
    },
    sentinel: {
      same: [],
      counter: [
        'forge-stone-slam',
        'forge-granite-shield',
        'forge-stone-melt',
        'forge-granite-burn',
      ],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-flame-heal',
      ],
    },
    'war-mage': {
      same: [
        'forge-flame-strike',
        'forge-inferno-blaze',
        'forge-flame-burst',
        'forge-inferno-shield',
      ],
      counter: [],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-flame-heal',
      ],
    },
    mystic: {
      same: [],
      counter: ['forge-stone-melt', 'forge-granite-burn'],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-warmth',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-warmth',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'forge-ember-wave',
        'forge-ember-shield',
        'forge-heat-wave',
        'forge-warmth',
      ],
    },
  },
};

export const CORONA: Djinn = {
  id: 'corona',
  name: 'Corona',
  element: 'Mars',
  tier: '2',
  description: 'A radiant fire spirit born from the heart of a dying star. Corona channels solar energy to both burn enemies and revitalize allies.',
  voiceLines: [
    'I am Corona—born of starlight, wielder of solar flame. Your heart burns bright, Adept!',
    'The sun itself lent me its power. Now that power is yours to command!',
  ],
  summonEffect: {
    type: 'buff',
    description: 'Flame field heals the party.',
    statBonus: { mag: 8 },
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [
        'corona-earthbreaker',
        'corona-mountain-wall',
        'corona-earth-melt',
        'corona-stone-scorch',
      ],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
      ],
    },
    sentinel: {
      same: [],
      counter: [
        'corona-earthbreaker',
        'corona-mountain-wall',
        'corona-earth-melt',
        'corona-stone-scorch',
      ],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
      ],
    },
    'war-mage': {
      same: [
        'corona-scorch',
        'corona-ember-veil',
        'corona-solar-blast',
        'corona-flame-barrier',
      ],
      counter: [],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
      ],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
      ],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
      ],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [
        'corona-solar-spin',
        'corona-solar-guard',
        'corona-heat-pulse',
        'corona-solar-heal',
      ],
    },
  },
};

export const FURY: Djinn = {
  id: 'fury',
  name: 'Fury',
  element: 'Mars',
  tier: '3',
  voiceLines: [
    'FURY AWAKENS! *flames roar* Finally, an Adept worthy of my WRATH!',
    'I am the inferno that consumes all! Point me at your enemies and WATCH THEM BURN!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Blazing torrent devastates enemies.',
    damage: 220,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [
        'fury-stone-barrage',
        'fury-terra-gate',
        'fury-molten-torrent',
        'fury-terra-burn',
      ],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-flame-revival',
      ],
    },
    sentinel: {
      same: [],
      counter: [
        'fury-stone-barrage',
        'fury-terra-gate',
        'fury-molten-torrent',
        'fury-terra-burn',
      ],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-flame-revival',
      ],
    },
    'war-mage': {
      same: [
        'fury-heat-rush',
        'fury-flare-guard',
        'fury-inferno-rage',
        'fury-flame-titan',
      ],
      counter: [],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-flame-revival',
      ],
    },
    mystic: {
      same: [],
      counter: [
        'fury-molten-torrent',
        'fury-terra-burn',
        'fury-burn-venom',
      ],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-inferno-blessing',
      ],
    },
    ranger: {
      same: [
        'fury-inferno-rage',
        'fury-flame-titan',
        'fury-fire-apocalypse',
      ],
      counter: [],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-inferno-blessing',
      ],
    },
    stormcaller: {
      same: [
        'fury-inferno-rage',
        'fury-flame-titan',
        'fury-fire-apocalypse',
      ],
      counter: [],
      neutral: [
        'fury-wind-flare',
        'fury-heat-storm',
        'fury-flare-pulse',
        'fury-inferno-blessing',
      ],
    },
  },
};

export const FIZZ: Djinn = {
  id: 'fizz',
  name: 'Fizz',
  element: 'Mercury',
  tier: '1',
  description: 'A playful water spirit that dances through streams and rain.',
  voiceLines: [
    '*giggles* Fizz is free! Fizz will help you! Fizz likes making splashy-splash!',
    'Ooh, you have kind eyes! Fizz knows good people. Let\'s go on adventures together!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Shards of ice sweep across enemies.',
    damage: 100,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
    'war-mage': {
      same: [],
      counter: ['fizz-gale-freeze', 'fizz-storm-chill'],
      neutral: ['fizz-aqua-pulse'],
    },
    mystic: {
      same: ['fizz-healing-wave', 'fizz-wave-shield'],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: ['fizz-aqua-pulse'],
    },
  },
};

export const TONIC: Djinn = {
  id: 'tonic',
  name: 'Tonic',
  element: 'Mercury',
  tier: '2',
  description: 'A gentle water spirit dwelling in ancient healing springs. Tonic carries restorative essence that can mend wounds and cure ailments.',
  voiceLines: [
    'Be at peace, weary traveler. I am Tonic—let my waters soothe your wounds.',
    'The healing springs have blessed me. That blessing now extends to you and yours.',
  ],
  summonEffect: {
    type: 'heal',
    description: 'Healing mist restores allies.',
    healAmount: 80,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
    'war-mage': {
      same: [],
      counter: ['tonic-wind-freeze', 'tonic-gale-barrier'],
      neutral: ['tonic-soothing-wave'],
    },
    mystic: {
      same: ['tonic-frost-bite', 'tonic-aqua-veil'],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: ['tonic-soothing-wave'],
    },
  },
};

export const CRYSTAL: Djinn = {
  id: 'crystal',
  name: 'Crystal',
  element: 'Mercury',
  tier: '3',
  voiceLines: [
    'I am Crystal—pure as glacial ice, sharp as frozen starlight. Your enemies shall know true cold.',
    'My prisms refract the magic of the cosmos. Together, we shall illuminate the path to victory!',
  ],
  summonEffect: {
    type: 'buff',
    description: 'Crystal prism boosts allies’ magical power.',
    statBonus: { mag: 12 },
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
    'war-mage': {
      same: [],
      counter: ['crystal-storm-crystal', 'crystal-gale-glaze'],
      neutral: ['crystal-mist-veil'],
    },
    mystic: {
      same: ['crystal-crystal-ray', 'crystal-aqua-armor'],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: ['crystal-mist-veil'],
    },
  },
};

export const BREEZE: Djinn = {
  id: 'breeze',
  name: 'Breeze',
  element: 'Jupiter',
  tier: '1',
  description: 'A swift wind spirit that carries whispers across the skies.',
  voiceLines: [
    '*whoosh* Breeze reporting for duty! I carry secrets on the wind—now I carry YOUR victories!',
    'Swift as thought, free as the sky! With me, you\'ll dance circles around your foes!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Gale shards sweep every enemy.',
    damage: 110,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['breeze-eddy-pulse'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['breeze-eddy-pulse'],
    },
    'war-mage': {
      same: [],
      counter: ['breeze-ice-burst', 'breeze-aero-shield'],
      neutral: ['breeze-eddy-pulse'],
    },
    mystic: {
      same: [],
      counter: ['breeze-ice-burst', 'breeze-aero-shield'],
      neutral: ['breeze-eddy-pulse'],
    },
    ranger: {
      same: ['breeze-gale-force', 'breeze-wind-veil'],
      counter: [],
      neutral: ['breeze-eddy-pulse'],
    },
    stormcaller: {
      same: ['breeze-gale-force', 'breeze-wind-veil'],
      counter: [],
      neutral: ['breeze-eddy-pulse'],
    },
  },
};

export const SQUALL: Djinn = {
  id: 'squall',
  name: 'Squall',
  element: 'Jupiter',
  tier: '2',
  voiceLines: [
    'The storm answers your call! I am Squall—rider of thunderclouds, herald of tempests!',
    'When skies darken and winds howl, that is my song. Now I sing for YOU!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Storm burst rains down on foes.',
    damage: 160,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: ['squall-wave-blast', 'squall-frost-surge'],
      neutral: ['squall-cloud-strike'],
    },
    sentinel: {
      same: [],
      counter: ['squall-wave-blast', 'squall-frost-surge'],
      neutral: ['squall-cloud-strike'],
    },
    'war-mage': {
      same: [],
      counter: ['squall-wave-blast', 'squall-frost-surge'],
      neutral: ['squall-cloud-strike'],
    },
    mystic: {
      same: [],
      counter: ['squall-wave-blast', 'squall-frost-surge'],
      neutral: ['squall-cloud-strike'],
    },
    ranger: {
      same: ['squall-storm-burst', 'squall-hurricane-guard'],
      counter: [],
      neutral: ['squall-cloud-strike'],
    },
    stormcaller: {
      same: ['squall-storm-burst', 'squall-hurricane-guard'],
      counter: [],
      neutral: ['squall-cloud-strike'],
    },
  },
};

export const STORM: Djinn = {
  id: 'storm',
  name: 'Storm',
  element: 'Jupiter',
  tier: '3',
  voiceLines: [
    'I AM THE STORM! *lightning crackles* Chaos itself bows to my will—and now, to YOURS!',
    'Hurricanes. Typhoons. Tornadoes. These are but whispers of my true power. Are you ready?',
  ],
  summonEffect: {
    type: 'special',
    description: 'Tempest swirl inflicts chaos and lightning.',
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: ['storm-cold-hail', 'storm-icy-barrier'],
      neutral: ['storm-breeze-pulse'],
    },
    sentinel: {
      same: [],
      counter: ['storm-cold-hail', 'storm-icy-barrier'],
      neutral: ['storm-breeze-pulse'],
    },
    'war-mage': {
      same: [],
      counter: ['storm-cold-hail', 'storm-icy-barrier'],
      neutral: ['storm-breeze-pulse'],
    },
    mystic: {
      same: [],
      counter: ['storm-cold-hail', 'storm-icy-barrier'],
      neutral: ['storm-breeze-pulse'],
    },
    ranger: {
      same: ['storm-chain-gale', 'storm-tempest-shield'],
      counter: [],
      neutral: ['storm-breeze-pulse'],
    },
    stormcaller: {
      same: ['storm-chain-gale', 'storm-tempest-shield'],
      counter: [],
      neutral: ['storm-breeze-pulse'],
    },
  },
};

// ============================================================================
// NEW MERCURY DJINN (2 new to balance element coverage)
// ============================================================================

export const SURGE: Djinn = {
  id: 'surge',
  name: 'Surge',
  element: 'Mercury',
  tier: '2',
  voiceLines: [
    'The tides rise at my command! I am Surge—and our enemies shall be swept away!',
    'Like the ocean, I am patient... but also RELENTLESS. Let us crash upon our foes!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Tidal wave crashes through all enemies.',
    damage: 180,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['surge-aqua-pulse', 'surge-wave-guard'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['surge-aqua-pulse', 'surge-wave-guard'],
    },
    'war-mage': {
      same: [],
      counter: ['surge-steam-blast', 'surge-boiling-wave'],
      neutral: ['surge-aqua-pulse'],
    },
    mystic: {
      same: ['surge-healing-tide', 'surge-aqua-barrier', 'surge-tidal-heal', 'surge-ocean-blessing'],
      counter: [],
      neutral: ['surge-aqua-pulse', 'surge-wave-guard'],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: ['surge-aqua-pulse', 'surge-wave-guard'],
    },
    stormcaller: {
      same: [],
      counter: ['surge-storm-surge', 'surge-thunder-wave'],
      neutral: ['surge-aqua-pulse'],
    },
  },
};

export const CHILL: Djinn = {
  id: 'chill',
  name: 'Chill',
  element: 'Mercury',
  tier: '3',
  voiceLines: [
    'Absolute zero... the stillness before creation. I am Chill—time itself freezes at my touch.',
    'In the deepest cold, even fire dies. Your enemies will know the embrace of eternal winter.',
  ],
  summonEffect: {
    type: 'special',
    description: 'Absolute zero freezes time itself, stunning all foes.',
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['chill-frost-pulse', 'chill-ice-wall'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['chill-frost-pulse', 'chill-ice-wall'],
    },
    'war-mage': {
      same: [],
      counter: ['chill-frozen-flame', 'chill-glacial-fire'],
      neutral: ['chill-frost-pulse'],
    },
    mystic: {
      same: ['chill-absolute-heal', 'chill-frost-revival', 'chill-glacial-blessing', 'chill-frozen-sanctuary'],
      counter: [],
      neutral: ['chill-frost-pulse', 'chill-ice-wall'],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: ['chill-frost-pulse', 'chill-ice-wall'],
    },
    stormcaller: {
      same: [],
      counter: ['chill-blizzard-bolt', 'chill-ice-storm'],
      neutral: ['chill-frost-pulse'],
    },
  },
};

// ============================================================================
// NEW JUPITER DJINN (3 new to balance element coverage)
// ============================================================================

export const GUST: Djinn = {
  id: 'gust',
  name: 'Gust',
  element: 'Jupiter',
  tier: '1',
  voiceLines: [
    'Fleet of foot and light as air—I am Gust! None shall catch us, friend!',
    'The wind at your back, the breeze in your blade! Speed is our greatest weapon!',
  ],
  summonEffect: {
    type: 'buff',
    description: 'Swift winds enhance party speed.',
    statBonus: { spd: 8 },
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['gust-breeze-pulse', 'gust-wind-shield'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['gust-breeze-pulse', 'gust-wind-shield'],
    },
    'war-mage': {
      same: [],
      counter: ['gust-flame-wind', 'gust-ember-gale'],
      neutral: ['gust-breeze-pulse'],
    },
    mystic: {
      same: [],
      counter: ['gust-mist-wind', 'gust-cool-breeze'],
      neutral: ['gust-breeze-pulse'],
    },
    ranger: {
      same: ['gust-swift-strike', 'gust-wind-slash', 'gust-tornado-blade'],
      counter: [],
      neutral: ['gust-breeze-pulse', 'gust-wind-shield'],
    },
    stormcaller: {
      same: ['gust-swift-strike', 'gust-wind-slash', 'gust-tornado-blade'],
      counter: [],
      neutral: ['gust-breeze-pulse', 'gust-wind-shield'],
    },
  },
};

export const BOLT: Djinn = {
  id: 'bolt',
  name: 'Bolt',
  element: 'Jupiter',
  tier: '2',
  voiceLines: [
    '*CRACK* I am Bolt! The lightning answers to you now—strike swift, strike TRUE!',
    'Thunder heralds my arrival, lightning marks my path. Our enemies won\'t see us coming!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Chain lightning arcs through all enemies.',
    damage: 200,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['bolt-spark-pulse', 'bolt-static-shield'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['bolt-spark-pulse', 'bolt-static-shield'],
    },
    'war-mage': {
      same: [],
      counter: ['bolt-plasma-strike', 'bolt-fire-lightning'],
      neutral: ['bolt-spark-pulse'],
    },
    mystic: {
      same: [],
      counter: ['bolt-healing-spark', 'bolt-revive-shock'],
      neutral: ['bolt-spark-pulse'],
    },
    ranger: {
      same: ['bolt-thunder-slash', 'bolt-lightning-strike', 'bolt-storm-blade'],
      counter: [],
      neutral: ['bolt-spark-pulse', 'bolt-static-shield'],
    },
    stormcaller: {
      same: ['bolt-chain-thunder', 'bolt-lightning-storm', 'bolt-thunderclap', 'bolt-arc-nova'],
      counter: [],
      neutral: ['bolt-spark-pulse', 'bolt-static-shield'],
    },
  },
};

export const TEMPEST: Djinn = {
  id: 'tempest',
  name: 'Tempest',
  element: 'Jupiter',
  tier: '3',
  voiceLines: [
    'THE ULTIMATE STORM HAS AWAKENED! I am Tempest—wind and lightning incarnate!',
    'Kingdoms have fallen before my fury! *thunder roars* And you... YOU have TAMED me. Impressive, Adept.',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Ultimate storm devastates the battlefield with lightning and wind.',
    damage: 350,
  },
  grantedAbilities: {
    adept: {
      same: [],
      counter: [],
      neutral: ['tempest-gale-pulse', 'tempest-wind-wall'],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: ['tempest-gale-pulse', 'tempest-wind-wall'],
    },
    'war-mage': {
      same: [],
      counter: ['tempest-fire-tornado', 'tempest-inferno-cyclone'],
      neutral: ['tempest-gale-pulse'],
    },
    mystic: {
      same: [],
      counter: ['tempest-healing-winds', 'tempest-mist-revival'],
      neutral: ['tempest-gale-pulse'],
    },
    ranger: {
      same: ['tempest-hurricane-blade', 'tempest-cyclone-slash', 'tempest-tornado-strike'],
      counter: [],
      neutral: ['tempest-gale-pulse', 'tempest-wind-wall'],
    },
    stormcaller: {
      same: ['tempest-apocalypse', 'tempest-judgement-bolt', 'tempest-divine-storm', 'tempest-ultimate-thunder'],
      counter: [],
      neutral: ['tempest-gale-pulse', 'tempest-wind-wall'],
    },
  },
  availableIn: ['tower'],
};

// VS1 Demo Djinn (simplified for demo)
export const ROCKLING: Djinn = {
  id: 'rockling',
  name: 'Rockling',
  element: 'Venus',
  tier: '1',
  voiceLines: [
    '*rumble* Rockling here! Small but mighty! Let\'s smash some baddies together!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Earth spike pierces a single foe.',
    damage: 46,
  },
  grantedAbilities: {
    adept: {
      same: ['earth-spike'],
      counter: [],
      neutral: [],
    },
    sentinel: {
      same: ['earth-spike'],
      counter: [],
      neutral: [],
    },
    'war-mage': {
      same: [],
      counter: [],
      neutral: ['earth-spike'],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [],
    },
  },
};

export const EMBER: Djinn = {
  id: 'ember',
  name: 'Ember',
  element: 'Mars',
  tier: '1',
  voiceLines: [
    '*crackle* Ember at your service! My flames may be small, but they burn HOT!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Fire burst engulfs a single foe.',
    damage: 46,
  },
  grantedAbilities: {
    adept: {
      same: ['fire-burst'],
      counter: [],
      neutral: [],
    },
    sentinel: {
      same: [],
      counter: [],
      neutral: [],
    },
    'war-mage': {
      same: ['fire-burst'],
      counter: [],
      neutral: [],
    },
    mystic: {
      same: [],
      counter: [],
      neutral: [],
    },
    ranger: {
      same: [],
      counter: [],
      neutral: [],
    },
    stormcaller: {
      same: [],
      counter: [],
      neutral: [],
    },
  },
};

export const NOVA: Djinn = {
  id: 'nova',
  name: 'Nova',
  element: 'Mars',
  tier: '3',
  voiceLines: [
    'A STAR IS BORN! I am Nova—the brilliance of a thousand suns compressed into pure destruction!',
    'Witness my radiance! *blinding light* When I explode, even darkness fears the light!',
  ],
  summonEffect: {
    type: 'damage',
    description: 'Nova erupts with starfire, scorching every foe.',
    damage: 320,
  },
  grantedAbilities: {
    'war-mage': {
      same: ['flame-wall', 'inferno-slash', 'phoenix-flames'],
      counter: ['granite-magma-barrier', 'granite-volcanic-spike'],
      neutral: ['flint-ground-shield'],
    },
    blaze: {
      same: ['flame-blade', 'inferno-strike', 'phoenix-aura'],
      counter: ['granite-volcanic-armor'],
      neutral: ['flint-rock-barrage'],
    },
    tyrell: {
      same: ['flame-jab', 'inferno-assault', 'flame-tornado'],
      counter: ['flint-earth-pulse'],
      neutral: ['granite-ground-wave'],
    },
    adept: {
      same: ['granite-earth-wall'],
      counter: [],
      neutral: ['flint-ground-shield'],
    },
    sentinel: {
      same: ['granite-earth-wall', 'granite-terra-break'],
      counter: ['flame-wall'],
      neutral: ['flint-ground-shield'],
    },
    mystic: {
      same: ['fizz-healing-wave', 'fizz-aqua-heal'],
      counter: ['flame-wall'],
      neutral: ['fizz-wave-shield'],
    },
    ranger: {
      same: ['breeze-gale-force', 'breeze-wind-veil'],
      counter: ['flame-wall'],
      neutral: ['breeze-eddy-pulse'],
    },
    stormcaller: {
      same: ['breeze-gale-force', 'breeze-wind-veil'],
      counter: ['flame-wall'],
      neutral: ['breeze-eddy-pulse'],
    },
  },
  availableIn: ['tower'],
};

export const DJINN: Record<string, Djinn> = {
  // Venus (4)
  flint: FLINT,
  granite: GRANITE,
  bane: BANE,
  rockling: ROCKLING, // VS1 Demo

  // Mars (5)
  forge: FORGE,
  corona: CORONA,
  fury: FURY,
  ember: EMBER, // VS1 Demo
  nova: NOVA, // VS1 Demo

  // Mercury (5 - balanced with Mars)
  fizz: FIZZ,
  tonic: TONIC,
  crystal: CRYSTAL,
  surge: SURGE, // NEW
  chill: CHILL, // NEW

  // Jupiter (6 - balanced with Venus+Mars)
  breeze: BREEZE,
  squall: SQUALL,
  storm: STORM,
  gust: GUST, // NEW
  bolt: BOLT, // NEW
  tempest: TEMPEST, // NEW (tower-exclusive)
};
