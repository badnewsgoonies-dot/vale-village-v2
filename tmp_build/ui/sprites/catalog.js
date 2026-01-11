"use strict";
/**
 * Sprite Catalog API
 *
 * The sprite system understands two identifier styles:
 *
 * 1. **Path IDs** – literal `/sprites/...` paths that must exist in `public/sprites/**`
 *    and therefore inside `sprite-list-generated.ts`. These IDs should be supplied by
 *    mapping helpers (e.g., overworld/battle mappings) whenever a call site knows the
 *    exact asset to render.
 *
 * 2. **Semantic IDs** – domain-centric slugs like `isaac-lblade-front` or `venus-djinn-front`.
 *    These are resolved through `getSpriteById`, which performs normalization and fuzzy
 *    matching against catalog entries. Semantic IDs allow older call sites and designer
 *    tooling to stay productive without hardcoding full paths.
 *
 * This module exposes pure lookup helpers that other sprite utilities can consume.
 * It intentionally has zero React or mapping-layer knowledge to avoid circular imports.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPRITE_LIST = void 0;
exports.getSpriteByPath = getSpriteByPath;
exports.getSpritesByCategory = getSpritesByCategory;
exports.getSpritesBySubcategory = getSpritesBySubcategory;
exports.searchSprites = searchSprites;
exports.getCategories = getCategories;
exports.getSubcategories = getSubcategories;
exports.getSpriteById = getSpriteById;
exports.getRandomSprite = getRandomSprite;
exports.getStats = getStats;
exports.validateSpritePath = validateSpritePath;
const sprite_list_generated_1 = require("./sprite-list-generated");
Object.defineProperty(exports, "SPRITE_LIST", { enumerable: true, get: function () { return sprite_list_generated_1.SPRITE_LIST; } });
function normalizeIdentifier(value) {
    const withSpaces = value.replace(/([a-z])([A-Z])/g, '$1 $2');
    return withSpaces
        .replace(/\.(gif|png)$/gi, '')
        .replace(/[_\-\s]+/g, ' ')
        .trim()
        .toLowerCase();
}
function getFilenameStem(spritePath) {
    const lastSlash = spritePath.lastIndexOf('/');
    const filename = lastSlash >= 0 ? spritePath.slice(lastSlash + 1) : spritePath;
    return filename.replace(/\.(gif|png)$/gi, '');
}
function tokenize(value) {
    return normalizeIdentifier(value)
        .split(' ')
        .filter(Boolean);
}
/**
 * Look up a sprite by literal `/sprites/...` path.
 * Use this for path IDs coming from mapping helpers.
 */
function getSpriteByPath(path) {
    return sprite_list_generated_1.SPRITE_LIST.find(s => s.path === path) ?? null;
}
/**
 * Get all sprites in a category
 */
function getSpritesByCategory(category) {
    return sprite_list_generated_1.SPRITE_LIST.filter(s => s.category === category);
}
/**
 * Get sprites by category and subcategory
 */
function getSpritesBySubcategory(category, subcategory) {
    return sprite_list_generated_1.SPRITE_LIST.filter(s => s.category === category && s.subcategory === subcategory);
}
/**
 * Search sprites by name (case-insensitive)
 */
function searchSprites(query) {
    const lowerQuery = query.toLowerCase();
    return sprite_list_generated_1.SPRITE_LIST.filter(s => s.name.toLowerCase().includes(lowerQuery));
}
/**
 * Get all unique categories
 */
function getCategories() {
    return [...new Set(sprite_list_generated_1.SPRITE_LIST.map(s => s.category))].sort();
}
/**
 * Get all subcategories for a category
 */
function getSubcategories(category) {
    const subs = sprite_list_generated_1.SPRITE_LIST
        .filter(s => s.category === category && s.subcategory !== null)
        .map(s => s.subcategory);
    return [...new Set(subs)].sort();
}
/**
 * Resolve a semantic sprite ID to the catalog entry.
 *
 * The lookup performs three passes:
 * 1. Exact normalized `name` match (handles IDs like `isaac lBlade Front`).
 * 2. Exact normalized filename stem match (handles `Isaac_Back.gif` style IDs).
 * 3. Keyword containment across both haystacks (last-resort fuzzy match).
 *
 * @example
 * getSpriteById('isaac-lblade-front') → finds "Isaac lBlade Front"
 * getSpriteById('Isaac_Back') → matches via filename stem
 */
function getSpriteById(id) {
    const normalizedId = normalizeIdentifier(id);
    const keywords = tokenize(id);
    // Try exact name match first
    const exactMatch = sprite_list_generated_1.SPRITE_LIST.find(s => normalizeIdentifier(s.name) === normalizedId);
    if (exactMatch)
        return exactMatch;
    // Try filename stem match (handles Isaac_Back, etc.)
    const stemMatch = sprite_list_generated_1.SPRITE_LIST.find(s => normalizeIdentifier(getFilenameStem(s.path)) === normalizedId);
    if (stemMatch)
        return stemMatch;
    // Try keyword matching (all keywords must be in name)
    if (keywords.length > 0) {
        const keywordMatch = sprite_list_generated_1.SPRITE_LIST.find(s => {
            const haystacks = [
                normalizeIdentifier(s.name),
                normalizeIdentifier(getFilenameStem(s.path)),
            ];
            return keywords.every(kw => haystacks.some(haystack => haystack.includes(kw)));
        });
        if (keywordMatch) {
            return keywordMatch;
        }
    }
    return null;
}
/**
 * Get random sprite from category
 */
function getRandomSprite(category) {
    const sprites = category
        ? getSpritesByCategory(category)
        : sprite_list_generated_1.SPRITE_LIST;
    const randomIndex = Math.floor(Math.random() * sprites.length);
    return sprites[randomIndex];
}
/**
 * Get statistics about sprite catalog
 */
function getStats() {
    const categories = getCategories();
    const categoryCounts = categories.map(cat => ({
        category: cat,
        count: getSpritesByCategory(cat).length,
    }));
    return {
        total: sprite_list_generated_1.SPRITE_LIST.length,
        categories: categoryCounts,
        largestCategory: categoryCounts.reduce((max, curr) => curr.count > max.count ? curr : max),
    };
}
/**
 * Validate that a sprite path exists in the catalog
 */
function validateSpritePath(path) {
    return sprite_list_generated_1.SPRITE_LIST.some(s => s.path === path);
}
