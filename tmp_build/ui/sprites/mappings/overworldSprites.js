"use strict";
/**
 * Overworld Sprite Mapping
 * Maps overworld entities (player, NPCs, scenery) to sprite IDs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCENERY_SPRITE_MAP = exports.PLAYER_UNIT_TO_SPRITE = exports.TILE_SPRITE_MAP = void 0;
exports.getPlayerSprite = getPlayerSprite;
exports.getNPCSprite = getNPCSprite;
exports.getScenerySprite = getScenerySprite;
exports.shouldMirrorSprite = shouldMirrorSprite;
exports.getTileSprite = getTileSprite;
/**
 * Maps tile types to sprite IDs (or fallback to CSS for now)
 * Note: Basic terrain tiles (grass, path, water) use CSS colors for now
 * Can be upgraded with proper tile sprites in future phase
 */
exports.TILE_SPRITE_MAP = {
    // Basic terrain - using CSS colors for now (null = use CSS)
    'grass': null,
    'path': null,
    'water': null,
    'wall': null,
    // Special tiles with sprites
    'door': 'door2', // From scenery/outdoor
    'chest': 'chest', // From scenery
    'trigger': null, // Hidden/transparent
    'npc': null, // NPCs rendered separately
};
/**
 * Maps player unit IDs to their base sprite names
 */
const PROTAGONIST_BASE_PATH = '/sprites/overworld/protagonists';
const MAJOR_NPC_BASE_PATH = '/sprites/overworld/majornpcs';
exports.PLAYER_UNIT_TO_SPRITE = {
    // Main party - matches unit definitions
    'adept': 'Isaac', // Isaac (Venus Adept)
    'war-mage': 'Garet', // Garet (Mars Warrior)
    'mystic': 'Mia', // Mia (Mercury Healer)
    'ranger': 'Ivan', // Ivan (Jupiter Mage)
    'sentinel': 'Felix', // Felix (Venus Adept)
    'stormcaller': 'Jenna', // Jenna (Mars Mage)
    // Test units
    'test-warrior-1': 'Isaac',
    'test-warrior-2': 'Garet',
    'test-warrior-3': 'Mia',
    'test-warrior-4': 'Ivan',
};
const ISAAC_POSE = {
    front: 'Isaac.gif',
    back: 'Isaac_Back.gif',
    side: 'Isaac_Right.gif',
    walkFront: 'Isaac_Walk.gif',
    walkBack: 'Isaac_Walk_Up.gif',
    walkSide: 'Isaac_Walk_Right.gif'
};
const PROTAGONIST_POSES = {
    Isaac: ISAAC_POSE,
    Garet: { front: 'Garet.gif', back: 'Garet_Back.gif', side: 'Garet_Right.gif' },
    Mia: { front: 'Mia.gif', back: 'Mia_Back.gif', side: 'Mia_Right.gif' },
    Ivan: { front: 'Ivan.gif', back: 'Ivan_Back.gif', side: 'Ivan_Right.gif' },
    Felix: {
        front: 'Felix.gif',
        back: 'Felix_Back.gif',
        side: 'Felix_E.gif',
        walkFront: 'Felix_Walk.gif'
    },
    Jenna: {
        front: 'Jenna.gif',
        back: 'Jenna_Back.gif',
        side: 'Jenna_Right.gif',
        walkFront: 'Jenna_Walk.gif'
    },
};
const DEFAULT_POSE = ISAAC_POSE;
function protagonistPath(file) {
    return `${PROTAGONIST_BASE_PATH}/${file}`;
}
function getPoseConfig(baseName) {
    return PROTAGONIST_POSES[baseName] ?? DEFAULT_POSE;
}
function getPlayerSprite(unitId, direction, isMoving = false) {
    const baseName = exports.PLAYER_UNIT_TO_SPRITE[unitId] || 'Isaac';
    const poseConfig = getPoseConfig(baseName);
    const poseFile = (() => {
        if (isMoving) {
            switch (direction) {
                case 'up':
                    return poseConfig.walkBack ?? poseConfig.back;
                case 'down':
                    return poseConfig.walkFront ?? poseConfig.front;
                case 'right':
                case 'left':
                    return poseConfig.walkSide ?? poseConfig.side;
                default:
                    return poseConfig.walkFront ?? poseConfig.front;
            }
        }
        else {
            switch (direction) {
                case 'up':
                    return poseConfig.back;
                case 'down':
                    return poseConfig.front;
                case 'right':
                case 'left':
                    return poseConfig.side;
                default:
                    return poseConfig.front;
            }
        }
    })();
    return protagonistPath(poseFile);
}
/**
 * Maps NPC types/roles to sprite IDs
 *
 * Available NPC categories:
 * - majornpcs/: Story NPCs (Saturos, Menardi, Kraden, etc.)
 * - minornpcs/: Villagers, guards, merchants (50+ variants)
 * - minornpcs_2/: Additional villager variety
 */
const NPC_ROLE_TO_FILE = {
    elder: 'Elder.gif',
    merchant: 'Weaponshop_Owner.gif',
    shopkeeper: 'Weaponshop_Keeper.gif',
    villagerMale: 'Mr_Jerra.gif',
    villagerFemale: 'Mrs_Jerra.gif',
    guard: 'Thief1.gif',
    enemy: 'Thief1.gif',
    default: 'Innkeeper.gif',
};
const SPECIFIC_NPC_TO_FILE = {
    'elder-vale': NPC_ROLE_TO_FILE.elder,
    'shopkeeper-weapons': NPC_ROLE_TO_FILE.shopkeeper,
    'tower-attendant': NPC_ROLE_TO_FILE.elder,
    'djinn-guide': NPC_ROLE_TO_FILE.elder,
    'flint-intro': '/sprites/overworld/djinn/Venus_Djinn.gif',
};
function npcPath(file) {
    return `${MAJOR_NPC_BASE_PATH}/${file}`;
}
/**
 * Get NPC sprite ID with fallback
 * Handles actual NPC IDs from map data (elder-vale, shopkeeper-weapons, villager-1, etc.)
 */
function getNPCSprite(npcId) {
    const specificFile = SPECIFIC_NPC_TO_FILE[npcId];
    if (specificFile) {
        if (specificFile.startsWith('/'))
            return specificFile;
        return npcPath(specificFile);
    }
    if (/house-\d+-enemy/.test(npcId)) {
        return npcPath(NPC_ROLE_TO_FILE.enemy);
    }
    if (npcId.includes('elder')) {
        return npcPath(NPC_ROLE_TO_FILE.elder);
    }
    if (npcId.includes('shopkeeper') || npcId.includes('merchant')) {
        return npcPath(NPC_ROLE_TO_FILE.merchant);
    }
    if (npcId.includes('blacksmith')) {
        return npcPath(NPC_ROLE_TO_FILE.shopkeeper);
    }
    if (npcId.includes('guard')) {
        return npcPath(NPC_ROLE_TO_FILE.guard);
    }
    // Handle villagers with variety (villager-1, villager-2, etc.)
    if (npcId.includes('villager')) {
        const match = npcId.match(/villager-(\d+)/);
        if (match && match[1]) {
            const num = parseInt(match[1], 10);
            const villagerFile = num % 2 === 0
                ? NPC_ROLE_TO_FILE.villagerFemale
                : NPC_ROLE_TO_FILE.villagerMale;
            return npcPath(villagerFile);
        }
        return npcPath(NPC_ROLE_TO_FILE.villagerMale);
    }
    return npcPath(NPC_ROLE_TO_FILE.default);
}
/**
 * Maps scenery object types to sprite IDs
 */
exports.SCENERY_SPRITE_MAP = {
    'chest': 'chest',
    'chest-open': 'chest_open',
    'door': 'door2',
    'sign': 'sign',
    'sign-weapon-shop': 'WepShop_Sign',
    'sign-potion-shop': 'PotionShop_Sign',
    'barrel': 'barrel1',
    'crate': 'box4',
    'stump': 'stump1',
    'stone': 'stone3',
    'fence': 'Fence_HorizSeg',
};
/**
 * Get scenery sprite ID with fallback
 */
function getScenerySprite(sceneryType) {
    return exports.SCENERY_SPRITE_MAP[sceneryType] || null;
}
/**
 * Helper: Check if a direction requires sprite mirroring
 */
function shouldMirrorSprite(direction) {
    return direction === 'left';
}
/**
 * Get tile sprite ID (null means use CSS color fallback)
 */
function getTileSprite(tileType) {
    return exports.TILE_SPRITE_MAP[tileType] || null;
}
