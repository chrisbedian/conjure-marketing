/**
 * Toggles .is-scrolled on the marketing nav after 32px of scroll.
 * The class triggers the floating-capsule → flush-band transformation
 * (transitions defined in Nav.astro's scoped styles).
 */

const SCROLL_THRESHOLD = 10;

function initNavScroll() {
  const nav = document.getElementById('marketingNav');
  if (!nav) return;

  const lines = document.querySelector<HTMLElement>('.layout-lines');

  const update = () => {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    nav.classList.toggle('is-scrolled', scrolled);
    lines?.classList.toggle('is-scrolled', scrolled);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavScroll, { once: true });
} else {
  initNavScroll();
}

export {};
