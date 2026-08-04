// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [preact()],

  // Task mutations are persisted by the API while the interactive board
  // updates its own state. Do not let those Markdown writes trigger a full
  // Astro dev-server refresh during drag and drop.
  vite: {
    server: {
      watch: {
        ignored: ['**/src/content/tasks/**'],
      },
    },
  },

  adapter: node({
    mode: 'standalone'
  })
});
