"use strict";
/**
 * Consumable items (single-use)
 * Minimal shape for compatibility with inventory display and shops.
 * Icons reference existing sprites in /public/sprites/icons/items/single-use/*
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEMS = void 0;
exports.ITEMS = {
    // Mercury-themed consumables
    'mercury-mist-elixir': {
        id: 'mercury-mist-elixir',
        name: 'Mercury Mist Elixir',
        description: 'Restores a small amount of PP and heals minor HP using chilled waters.',
        icon: '/sprites/icons/items/single-use/healing/Mist_Potion.gif',
        hpRestore: 80,
        ppRestore: 10,
        cost: 120,
    },
    'mercury-vial': {
        id: 'mercury-vial',
        name: 'Glacial Vial',
        description: 'A vial of freezing brine. Lowers enemy speed for one battle.',
        icon: '/sprites/icons/items/single-use/healing/Vial.gif',
        effect: { target: 'enemy', debuff: { spd: -3 }, duration: 1 },
        cost: 90,
    },
    'mercury-water-of-life': {
        id: 'mercury-water-of-life',
        name: 'Water of Life (Mercury)',
        description: 'Heals HP for a single ally significantly.',
        icon: '/sprites/icons/items/single-use/healing/Water_of_Life.gif',
        hpRestore: 250,
        cost: 420,
    },
    // Jupiter-themed consumables
    'jupiter-zephyr-scroll': {
        id: 'jupiter-zephyr-scroll',
        name: 'Zephyr Scroll',
        description: 'Grants a temporary speed buff to a single ally.',
        icon: '/sprites/icons/items/single-use/other/Corn.gif',
        effect: { target: 'ally', buff: { spd: 6 }, duration: 3 },
        cost: 140,
    },
    'jupiter-lightning-flask': {
        id: 'jupiter-lightning-flask',
        name: 'Lightning Flask',
        description: 'Deals small Jupiter-element magic damage to one enemy.',
        icon: '/sprites/icons/items/single-use/important/Psy_Crystal.gif',
        damage: { element: 'Jupiter', amount: 120 },
        cost: 200,
    },
    'jupiter-hermes-water': {
        id: 'jupiter-hermes-water',
        name: "Hermes' Water (Jupiter)",
        description: 'Restores action points / grants a small PP refund.',
        icon: '/sprites/icons/items/single-use/healing/Hermes_Water.gif',
        ppRestore: 15,
        cost: 260,
    },
    // General consumables (using existing asset icons)
    'elixir': {
        id: 'elixir',
        name: 'Elixir',
        description: 'Fully restores HP and PP for one ally.',
        icon: '/sprites/icons/items/single-use/healing/Elixir.gif',
        hpRestore: 9999,
        ppRestore: 9999,
        cost: 2000,
    },
    'potion': {
        id: 'potion',
        name: 'Potion',
        description: 'Restores HP to one ally.',
        icon: '/sprites/icons/items/single-use/healing/Potion.gif',
        hpRestore: 120,
        cost: 50,
    },
    'antidote': {
        id: 'antidote',
        name: 'Antidote',
        description: 'Cures poison and other minor ailments.',
        icon: '/sprites/icons/items/single-use/healing/Antidote.gif',
        removesStatus: ['poison'],
        cost: 35,
    },
    'curio-charm': {
        id: 'curio-charm',
        name: 'Curio Charm',
        description: 'A small trinket sold by travelling merchants; increases sell price for curios when equipped.',
        icon: '/sprites/icons/items/single-use/important/Anchor_Charm.gif',
        effect: { type: 'sell_bonus', percent: 10 },
        cost: 75,
    },
};
