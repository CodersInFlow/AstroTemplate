// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://codersinflow.com',
  integrations: [react(), tailwind()],
  // Enable sitemap generation
  build: {
    sitemap: true
  },
  // Exclude reference directory from file watching
  vite: {
    server: {
      watch: {
        ignored: ['**/reference/**']
      }
    }
  }
});