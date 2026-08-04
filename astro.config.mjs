import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [preact()],
});
