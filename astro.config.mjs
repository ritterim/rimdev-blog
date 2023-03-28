import { defineConfig } from 'astro/config';
import { site } from './src/data/config.json';

// https://astro.build/config
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: site.baseurl,
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
  integrations: [
    sitemap(),
    compress({
      logger: 0,
    }),
  ],
});
