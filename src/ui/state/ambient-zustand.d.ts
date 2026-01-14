/**
 * Ambient type declarations for zustand and vitest.
 * 
 * This file ensures TypeScript properly recognizes zustand's type exports
 * and provides ambient declarations for vitest when used in test contexts.
 */

// Ambient vitest declarations for tests
declare module 'vitest' {
  export const describe: any;
  export const it: any;
  export const test: any;
  export const expect: any;
  export const beforeEach: any;
  export const afterEach: any;
  export const vi: any;
}
