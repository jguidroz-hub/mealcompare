import { defineConfig } from 'vite';
import { resolve } from 'path';

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
        'content/doordash-scraper': resolve(__dirname, 'src/content/doordash-scraper.ts'),
        'popup/popup': resolve(__dirname, 'src/popup/popup.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        format: 'es',
      },
    },
    target: 'chrome120',
    minify: false, // Easier debugging during dev
  },
  resolve: {
    alias: {
      '@mealcompare/shared': resolve(__dirname, '../shared/src/index.ts'),
    },
  },
});
