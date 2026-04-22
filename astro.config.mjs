// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://onconjure.com',
  output: 'server',
  adapter: vercel(),
  integrations: [
    clerk({
      isSatellite: true,
      domain: 'app.onconjure.com',
      signInUrl: 'https://app.onconjure.com/sign-in',
      signUpUrl: 'https://app.onconjure.com/sign-up',
    }),
  ],
});
