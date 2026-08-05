// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  security: {
    checkOrigin: false,
  },
  integrations: [preact()],

  // Workspace mutations are persisted by the API while interactive views
  // update their own state. Do not let Markdown writes trigger a full Astro
  // dev-server refresh during drag and drop.
  vite: {
    server: {
      watch: {
        ignored: ['**/src/content/tasks/**', '**/src/content/projects/**'],
      },
    },
  },

  adapter: node({
    mode: 'standalone'
  })
});
