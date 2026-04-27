/**
 * Toggles .is-scrolled on the marketing nav after 32px of scroll.
 * The class triggers a 1px bottom border + backdrop blur (transitions defined
 * in Nav.astro's scoped styles).
 */

const SCROLL_THRESHOLD = 32;

function initNavScroll() {
  const nav = document.getElementById('m-nav');
  if (!nav) return;

  let ticking = false;
  const update = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavScroll, { once: true });
} else {
  initNavScroll();
}

export {};
