// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://codersinflow.com',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [react(), tailwind()],
  // Enable sitemap generation
  build: {
    sitemap: true,
    inlineStylesheets: 'always'
  },
  // Exclude reference directory from file watching
  vite: {
    resolve: {
      preserveSymlinks: true
    },
    server: {
      host: '127.0.0.1',
      watch: {
        ignored: ['**/reference/**']
      }
    }
  }
});