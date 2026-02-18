import { defineConfig } from 'vite';
import { resolve } from 'path';

// Chrome MV3 content scripts don't support ES module imports.
// We build each entry as a separate bundle using multiple Vite builds.
// The background worker and popup DO support ES modules.
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        'content/doordash': resolve(__dirname, 'src/content/doordash.ts'),
        'content/ubereats': resolve(__dirname, 'src/content/ubereats.ts'),
        'content/grubhub': resolve(__dirname, 'src/content/grubhub.ts'),
        'content/toast-scraper': resolve(__dirname, 'src/content/toast-scraper.ts'),
        'content/overlay': resolve(__dirname, 'src/content/overlay.ts'),
        'popup/popup': resolve(__dirname, 'src/popup/popup.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es',
        // Prevent chunk splitting — inline shared code into each entry
        manualChunks: () => undefined,
      },
    },
    target: 'chrome120',
    minify: false,
    // Inline all imports for content scripts
    commonjsOptions: {
      include: [],
    },
  },
  resolve: {
    alias: {
      '@mealcompare/shared': resolve(__dirname, '../shared/src/index.ts'),
    },
  },
});
