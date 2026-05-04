## Brand — locked. Cross-reference before any styling task.

This repo is governed by the Conjure brand kit at
`/Users/chrisbedian/Documents/Projects/conjure-brand`.

Before any task that touches color, typography, component chrome,
lockup, copy voice, or styling decisions:

1. Read `/Users/chrisbedian/Documents/Projects/conjure-brand/AGENTS.md`
   for the dense reference.
2. Cross-check tokens in
   `/Users/chrisbedian/Documents/Projects/conjure-brand/tokens.css`
   for canonical values.
3. If a value or pattern isn't covered there, stop and ask.
   Don't guess.

The brand is paper and ink. Ink on cream in light mode, cream on
warm dim in dark mode. Vermilion is the only chromatic moment,
reserved for AI events. No other accent colors. No purple, no
green, no chromatic family beyond vermilion.

### Hard rules — never guess at these

- Hex values for color tokens
- Font stack or weight choice (Cormorant for display ≥40px,
  Cabinet Grotesk for UI, JetBrains Mono for eyebrows and code)
- Wordmark case (always lowercase "conjure" rendered, capital C
  only for proper-noun copy)
- Lockup geometry (one of five locked pairings — don't invent new
  ones)
- Border radius (use the `--radius-*` scale, no magic numbers)
- Border weight, wash alpha, focus ring, shadow, selection
  background (use system tokens)
- Voice and copy ("ship," "launch," "elevated," exclamation
  points, "please" — all banned; full word lists in AGENTS.md)
- Favorite ochre — only on the favorite star

### When you find a gap

If `AGENTS.md` and `tokens.css` don't cover a styling decision you
need to make:

1. Stop.
2. Don't pick something that "looks right."
3. Ask the maintainer to update the brand kit, then proceed once
   the value is locked.

The brand kit is the source. This repo follows.

# Conjure Marketing

Astro splash + blog at `onconjure.com`. Marketing surface for **Conjure** — an AI-first design tool for design professionals. The product lives at `app.onconjure.com` (separate Render-hosted app). This site is a Clerk **satellite** to that app's primary, deployed on Vercel.

## Working Style

- Brutal honest truth — no sugarcoating
- Challenge the user when you think they're wrong
- Prioritize what's right over what's comfortable

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build for production
npm run preview  # Preview production build
```

Requires Node ≥ 22.12 (project uses Astro 6).

## Auth model — Clerk satellite

`onconjure.com` is a Clerk **satellite**. `app.onconjure.com` is the **primary**. Configured in `astro.config.mjs` with:

- `isSatellite: true`
- `domain: 'app.onconjure.com'`
- `signInUrl` / `signUpUrl` pointed at the primary

The real auth-handshake test is the `__session` cookie: after sign-in on the primary, its Domain attribute must be `.onconjure.com` (leading dot — parent-scoped) when viewed on this satellite. That can only be verified on the deployed Vercel URL or with `/etc/hosts` tunneling — not via localhost.

Env vars (set in Vercel project, not committed):

```
PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
PUBLIC_CLERK_IS_SATELLITE=true
PUBLIC_CLERK_DOMAIN=app.onconjure.com
PUBLIC_CLERK_SIGN_IN_URL=https://app.onconjure.com/sign-in
PUBLIC_CLERK_SIGN_UP_URL=https://app.onconjure.com/sign-up
```

Locally `astro dev` requires _some_ string for the publishable + secret keys (Clerk's env schema enforces presence). Placeholders work for layout/markup work; real Clerk dev keys make the SDK quiet in the console.

## Site structure

```
onconjure.com          → src/pages/index.astro    # Splash
onconjure.com/blog     → src/pages/blog/          # Content collection (currently empty)
onconjure.com/privacy  → src/pages/privacy.astro  # Stub
onconjure.com/terms    → src/pages/terms.astro    # Stub
```

Splash, privacy, terms are `prerender = true` (static). Blog uses Astro 6's content layer (glob loader in `src/content.config.ts`). Blog post pages are SSR-default; an empty collection is fine.

## Project structure

```
src/
├── pages/
│   ├── index.astro              # Splash (composes the marketing components)
│   ├── privacy.astro
│   ├── terms.astro
│   └── blog/
│       ├── index.astro          # List view (empty-state ready)
│       └── [...slug].astro      # Post renderer
├── components/
│   ├── marketing/
│   │   ├── Nav.astro            # Sticky cream-opaque nav (full width)
│   │   ├── LayoutLines.astro    # Fixed vertical hairlines, 1272px column
│   │   ├── Hero.astro           # Two-column upper + full-width loop below
│   │   ├── Thesis.astro         # Cream-soft band, brand-accent strikethrough
│   │   ├── Gestures.astro       # Header + 2-col grid of GestureTile
│   │   ├── GestureTile.astro    # Anthropic-style card with media
│   │   ├── CTA.astro            # Dark band, brand-accent top hairline, arrow CTA
│   │   └── Footer.astro         # Multi-row, mono credits
│   └── SiteNav.astro            # Used by blog (BaseLayout), not marketing
├── layouts/
│   └── BaseLayout.astro         # Blog only (imports global.css)
├── content/
│   └── blog/                    # .gitkeep — no posts yet
├── content.config.ts
├── styles/
│   ├── marketing.css            # Tokens + reset + buttons + nav + lines
│   └── global.css               # Blog-only (loaded via BaseLayout)
├── scripts/
│   ├── reveal.ts                # IntersectionObserver for .reveal sections
│   └── nav-scroll.ts            # Toggles .is-scrolled on nav past 10px
└── middleware.ts                # clerkMiddleware()
```

## Design system

### Colors

See `/Users/chrisbedian/Documents/Projects/conjure-brand/AGENTS.md`
and `tokens.css` for the canonical color system. Marketing is
cream-only — no dark mode. Body is `--ink-soft` on `--cream`. The
dark surface used in the Hero loop frame, CTA band, and Footer is
`--ink` (`#1A1A1F`) — kept here only because it's the value the
App-coordination flag below references.

### Typography

- **Plus Jakarta Sans** for headlines, body, button text. Variable weight via Google Fonts `display=swap`.
- **JetBrains Mono** for system labels: section labels (`00 / Direct`, `01 / Thesis`, etc.), metadata strips, footer credit, status pills. `letter-spacing: 0`, weight 500. Mono is _not_ used for body, headlines, subheads, or button text.

### Layout

- Marketing pages don't use a shared layout component — they import `marketing.css` directly so styles don't bleed into the blog (which uses its own `BaseLayout` + `global.css`).
- **Section identifier system**: each content section opens with an in-flow `.section-label` (mono, 11px, ink-quiet) above the headline. No absolute-positioned chapter markers.
- **Hairline structure**: `.m-divider` inside `.m-section-left` runs the full layout-line column. Each section after the hero opens with one. Hero brackets its loop with two.
- **Left-anchored body** (Thesis, Gestures, CTA): `.m-section-left` wrapper has padding-inline that mirrors the layout-line geometry — `32px` default, `calc((100vw - 1272px) / 2 + 16px)` at and above 1304px, `24px` mobile. `.m-section-left__inner` caps text at 720px. Hero stays centered; the contrast between centered peak and left-anchored body is the structural rhythm.
- Layout-vertical-lines (`LayoutLines.astro`) frame a 1272px column. Lines hide under 640px viewport. Nav's bottom `.nav-h-line` stays visible at every viewport.

### Animation

- **Nothing instant.** Hovers/state changes 120ms minimum (typically 180–240ms with `--ease-in-out`). Section reveals 600–800ms with `--ease-out`.
- Motion lives on product loops, scroll reveals, and button states. No motion on text hover.
- All keyframes in `prefers-reduced-motion: reduce` collapse to instant or static.

### Surfaces / cream texture

- `body::before` paper-grain noise at 2.5% opacity (1.5% reduced-motion) via SVG `<feTurbulence>`. `mix-blend-mode: multiply` darkens cream surfaces without lightening dark ones.

## Mini gesture loop (Hero right column)

A pure CSS+SVG mini animation that demonstrates **drop a reference, the AI restyles your design** in 9 seconds. No video asset.

Story: cursor drags a tiny landscape photo from upper right onto a wireframe website card → drops it → selection ring blooms → cascade beats fire in sequence (image illustration → real photograph, eyebrow bar → "TRAVEL", headline bars → "Three days in the Sierras.", button gray → gradient + "Plan the route", link bar → "Read the guide") → holds the finished card → resets.

- **5 cascade beats**, staggered every 6%, each ~6% wide. Cascade finishes by 66%, finished card holds 66–92%.
- **Real photo** embedded via SVG `<image href="https://images.unsplash.com/...">`. Photographer attribution in markup comment. Swap by changing the URL. Photo by Vincentiu Solomon (`photo-1469474968028-56623f02e42e`); `preserveAspectRatio="xMidYMin slice"` (cover, top-anchored).
- **Real type inside SVG**: `<text>` with classes that pull `var(--font-sans)` / `var(--font-mono)`. Crisp at 360–420px display.
- **Cursor lock**: `.hero__mini { cursor: default; }` + `* { cursor: inherit; }` so hovering text doesn't show the I-beam.
- **Keep responsive behavior**: max-width 420 on desktop, full-column flush-left at <=899 (single-column layout). Don't break that pattern.

## Out of scope (don't expand without explicit ask)

These are tracked as separate tickets / future work:

- **Real splash content beyond what's there** (ticket 11812510042). Current copy is intentionally minimal.
- **Blog posts** — collection is scaffolded; content comes when ready.
- **Changelog migration** (ticket 11812343533).
- **Pricing, docs, terms, privacy** beyond the existing stubs.
- **Visual polish beyond the editorial / Anthropic-inspired direction** the site is in. The page is restrained on purpose.

## Known gotchas

- **Astro scoped `<style>` blocks + Vite HMR can desync** for fixed-position chrome (nav, layout lines). The cid-attribute selectors get stranded mid-update and the element renders unstyled. **Fix**: keep all `position: fixed` / `position: sticky` styles in global `marketing.css`, not in scoped component blocks. Section-level styles (Hero, Thesis, etc.) can stay scoped — block-level layout survives a missed cid; fixed chrome doesn't.
- **Always-flush nav is 64px tall**. Hero `padding-top: 96px` (both desktop and mobile) — _do not_ drop mobile padding to 64 or the section-label sits flush against the nav with zero breathing room.
- **The mini loop's button-center coords** (cursor target, swatch drop, AI dot) live in keyframes. Anytime button position changes (y or x), update the keyframes too.

## App-coordination flag

Marketing's dark surface is `#1A1A1F`, not pure black. The app at `app.onconjure.com` must move to the same value. **Don't ship marketing's dark migration to prod ahead of the app's matching migration** — the click-through from the dark CTA band into the app reads as a jump cut from `#1A1A1F` to `#050507`. Bundle them in one release.
