"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STARTER_KITS = void 0;
exports.getStarterKit = getStarterKit;
exports.getAvailableStarterKits = getAvailableStarterKits;
exports.STARTER_KITS = {
    Venus: {
        element: 'Venus',
        name: "Earth Warrior Kit",
        cost: 350,
        equipment: {
            weapon: 'wooden-sword', // Basic sword
            armor: 'leather-vest', // Medium armor
            helm: 'leather-cap', // Medium helm
            boots: 'leather-boots', // Medium boots
            accessory: 'guardian-ring', // Defensive ring
        },
    },
    Mars: {
        element: 'Mars',
        name: "Fire Mage Kit",
        cost: 350,
        equipment: {
            weapon: 'wooden-axe', // Mars axe
            armor: 'leather-vest', // Medium armor
            helm: 'bronze-helm', // Heavy helm
            boots: 'leather-boots', // Medium boots
            accessory: 'war-gloves', // Mars-specific gloves
        },
    },
    Mercury: {
        element: 'Mercury',
        name: "Water Mystic Kit",
        cost: 350,
        equipment: {
            weapon: 'wooden-staff', // Mage staff
            armor: 'cotton-shirt', // Light mage armor
            helm: 'cloth-cap', // Light mage helm
            boots: 'leather-boots', // Medium boots
            accessory: 'spirit-gloves', // Mage gloves
        },
    },
    Jupiter: {
        element: 'Jupiter',
        name: "Wind Warrior Kit",
        cost: 350,
        equipment: {
            weapon: 'wooden-staff', // Staff for Stormcaller, also works for Ranger
            armor: 'leather-vest', // Medium armor
            helm: 'cloth-cap', // Light helm
            boots: 'leather-boots', // Medium boots
            accessory: 'lucky-medal', // Jupiter-specific medal
        },
    },
    Neutral: {
        element: 'Neutral',
        name: "Neutral Kit",
        cost: 350,
        equipment: {
            weapon: 'wooden-sword', // Generic weapon
            armor: 'leather-vest', // Generic armor
            helm: 'leather-cap', // Generic helm
            boots: 'leather-boots', // Generic boots
            accessory: 'power-ring', // Generic accessory
        },
    },
};
/**
 * Get starter kit for a unit based on their element
 * REFACTORED: Returns kit by element, not unit ID
 */
function getStarterKit(unit) {
    return exports.STARTER_KITS[unit.element];
}
/**
 * Get available starter kits for a list of units
 * REFACTORED: Returns kits by element (deduplicates same-element units)
 */
function getAvailableStarterKits(units) {
    // Deduplicate by element
    const uniqueElements = Array.from(new Set(units.map(u => u.element)));
    return uniqueElements
        .map((element) => exports.STARTER_KITS[element])
        .filter((kit) => Boolean(kit));
}
