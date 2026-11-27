import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ashutoshdey21.github.io',
  integrations: [sitemap()],
});
