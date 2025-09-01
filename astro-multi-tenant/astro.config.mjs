// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { devWrapperPlugin } from './src/shared/plugins/vite-plugin-dev-wrapper.js';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    react(),
    tailwind({
      // We'll handle multiple configs dynamically
      applyBaseStyles: false
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 4321
  },
  vite: {
    ssr: {
      noExternal: ['@tiptap/*']
    },
    server: {
      hmr: {
        host: '127.0.0.1'
      }
    },
    plugins: [
      // Auto-wrap components with DevWrapper in development
      process.env.NODE_ENV !== 'production' && devWrapperPlugin()
    ].filter(Boolean)
  }
});