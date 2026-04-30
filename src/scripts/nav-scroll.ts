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

function init() {
  initNavScroll();
  initBurger();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

export {};
