/**
 * Toggles .is-scrolled on the marketing nav after 32px of scroll.
 * The class triggers the floating-capsule → flush-band transformation
 * (transitions defined in Nav.astro's scoped styles).
 */

const SCROLL_THRESHOLD = 10;

function initNavScroll() {
  const nav = document.getElementById('marketingNav');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
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
