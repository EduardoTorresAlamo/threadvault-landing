// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://vault.eduardo-torres.com',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      // `/` is Spanish, `/en/` is English.
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
