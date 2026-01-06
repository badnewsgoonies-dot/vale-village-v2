# Bug Report - vale-village-v2

Generated: 2026-01-03T01:14:00-05:00

## High Severity

### Type Safety Issues (as any casts)
- **src/main.tsx:17** - Unsafe `as any` cast bypasses type checking
- **src/main.tsx:18** - Unsafe `as any` cast bypasses type checking
- **src/main.tsx:19** - Unsafe `as any` cast bypasses type checking
- **src/main.tsx:20** - Unsafe `as any` cast bypasses type checking
- **src/main.tsx:21** - Unsafe `as any` cast bypasses type checking
- **src/main.tsx:22** - Unsafe `as any` cast bypasses type checking
- **src/main.tsx:23** - Unsafe `as any` cast bypasses type checking
- **src/main.tsx:24** - Unsafe `as any` cast bypasses type checking

## Medium Severity

### TODO Comments (incomplete implementations)
- **src/ui/components/RewardsScreen.tsx:84** -           // TODO: Add proper error logging for missing unit
- **src/core/validation/saveFileValidation.ts:340** -  * TODO (Issue #20): Format validation error for user display
- **src/core/services/SaveService.ts:536** -       chapter: 1, // TODO: Add chapter to SaveV1Schema
- **src/core/save/SaveService.ts:104** -     // TODO: Create separate ReplayPort interface

### Debug Code (console.log statements)
- **src/main.tsx:39** - Debug statement left in code
- **src/ui/utils/text.ts:64** - Debug statement left in code
- **src/ui/state/teamSlice.ts:71** - Debug statement left in code
- **src/ui/state/teamSlice.ts:132** - Debug statement left in code
- **src/ui/state/storySlice.ts:54** - Debug statement left in code
- **src/ui/state/storySlice.ts:85** - Debug statement left in code

### Hardcoded Values

## Low Severity

- **src/ui/components/ShopEquipScreen.tsx:150** - Non-null assertion may cause runtime error
- **src/ui/components/ShopEquipScreen.tsx:170** - Non-null assertion may cause runtime error
- **src/core/services/AIService.ts:222** - Non-null assertion may cause runtime error
- **src/core/services/AIService.ts:266** - Non-null assertion may cause runtime error
- **src/core/services/AIService.ts:276** - Non-null assertion may cause runtime error
- **src/core/services/AIService.ts:286** - Non-null assertion may cause runtime error

### Empty Catch Blocks
- **src/ui/components/TouchOverlay.tsx:63** - Empty catch block swallows errors
