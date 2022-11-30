import { defineConfig } from 'astro/config';
import { site } from './src/data/config.json';

// https://astro.build/config
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: site.baseurl,
  integrations: [sitemap(), compress()],
});
