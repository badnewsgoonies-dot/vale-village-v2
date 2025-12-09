/**
 * Vitest setup file
 * Runs before all tests
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/preact';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Add custom matchers if needed
// expect.extend({});
