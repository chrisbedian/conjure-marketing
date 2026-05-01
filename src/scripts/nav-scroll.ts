/**
 * Marketing-nav scripts:
 *   1. Toggles .is-scrolled on the nav after 10px of scroll.
 *   2. Wires the burger button (<=1135px) to toggle the drawer:
 *      - aria-expanded on the burger drives the X animation
 *      - drawer's `hidden` attribute drives visibility
 *      - body scroll locks while the drawer is open
 *      - drawer auto-closes if the viewport widens past 1135px
 *      - clicking a drawer link/CTA closes the drawer (so nav state
 *        is consistent across hash navigations + same-tab routes)
 *   3. Runs the nav entrance fade once via the Web Animations API.
 *      WAAPI is bound to the element instance, so View Transitions
 *      persist movement can't re-trigger it the way CSS keyframes do.
 *   4. Skips the View Transitions cross-fade on every swap so the
 *      page snaps in instead of fading. transition:persist still works
 *      because the DOM swap is independent of the visual animation.
 */

const SCROLL_THRESHOLD = 10;
const BURGER_BREAKPOINT = 1135;

function initNavScroll() {
  const nav = document.getElementById('marketingNav');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initBurger() {
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('navDrawer');
  if (!burger || !drawer) return;

  const setOpen = (open: boolean) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  // Close on any drawer-link/CTA click so navigating doesn't leave state stuck.
  drawer.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  // Close if the viewport widens past the burger breakpoint.
  const closeOnResize = () => {
    if (window.innerWidth > BURGER_BREAKPOINT &&
        burger.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
    }
  };
  window.addEventListener('resize', closeOnResize, { passive: true });

  // Close on Escape.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
    }
  });
}

function initNavEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const nav = document.getElementById('marketingNav');
  if (!nav) return;

  const entries: Array<[string, number]> = [
    ['.nav-logo',  0],
    ['.nav-links', 80],
    ['.nav-cta',   80],
  ];

  for (const [selector, delay] of entries) {
    const el = nav.querySelector<HTMLElement>(selector);
    if (!el) continue;
    el.animate(
      [
        { opacity: 0, transform: 'translateY(-6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration: 600,
        delay,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        fill: 'both',
      },
    );
  }
}

function init() {
  initNavScroll();
  initBurger();
  initNavEntrance();
}

/* Skip the View Transitions cross-fade entirely on every swap. The DOM
   swap still happens (so transition:persist still works), we just don't
   animate the snapshot pseudo-elements.
   skipTransition() rejects the lifecycle promises (finished/ready/
   updateCallbackDone) with AbortError — pre-attach catch handlers so
   they don't surface as uncaught rejections. */
document.addEventListener('astro:before-swap', (e) => {
  // @ts-expect-error — Astro adds .viewTransition on the event
  const vt = e.viewTransition;
  if (!vt) return;
  vt.finished?.catch?.(() => {});
  vt.ready?.catch?.(() => {});
  vt.updateCallbackDone?.catch?.(() => {});
  vt.skipTransition?.();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

export {};
