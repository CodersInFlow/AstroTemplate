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
    mode: 'standalone',
    // Add runtime configuration to prevent lockups
    runtimeMode: 'experimental',
    // Increase max listeners to prevent memory leaks
    maxListeners: 50
  }),
  integrations: [react(), tailwind()],
  // Enable sitemap generation
  build: {
    sitemap: true,
    inlineStylesheets: 'always'
  },
  // Server configuration with better timeout handling
  server: {
    host: '127.0.0.1',
    port: 4321,
    // Add request timeout
    timeout: 30000
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
      },
      // Add connection limits to prevent exhaustion
      hmr: {
        timeout: 60000
      }
    },
    // Optimize SSR performance
    ssr: {
      noExternal: ['happy-dom']
    }
  }
});