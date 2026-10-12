// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // Pages stay static; only the editor (/keystatic) and its API run on Vercel's servers.
  integrations: [react(), keystatic()],
  adapter: vercel(),
  devToolbar: { enabled: false },
  vite: {
    // Pre-bundle these at dev-server start. Otherwise Vite can re-bundle them mid-session and
    // reject the résumé preview's lazy import with "504 Outdated Optimize Dep".
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/Flip', 'pdfjs-dist'],
    },
  },
});
