// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  devToolbar: { enabled: false },
  vite: {
    // Pre-bundle these at dev-server start. Otherwise Vite can re-bundle them mid-session and
    // reject the résumé preview's lazy import with "504 Outdated Optimize Dep".
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/Flip', 'pdfjs-dist'],
    },
  },
});
