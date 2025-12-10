import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@data': resolve(__dirname, 'src/data'),
      '@state': resolve(__dirname, 'src/state')
    }
  },
  build: {
    target: 'ES2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('/src/ui/')) {
            return 'ui-components';
          }
          if (id.includes('/src/core/')) {
            return 'core-services';
          }
          if (id.includes('/src/data/definitions/')) {
            return 'data-definitions';
          }
          return undefined;
        }
      }
    }
  }
});
