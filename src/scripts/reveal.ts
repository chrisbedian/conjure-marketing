/**
 * Scroll-reveal controller for the marketing splash.
 * .reveal elements gain .is-visible when ~15% in view. One-shot observer.
 */

const REVEAL_THRESHOLD = 0.15;

function revealAll(targets: NodeListOf<HTMLElement>) {
  targets.forEach((el) => el.classList.add('is-visible'));
}

function initReveal() {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    revealAll(targets);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: REVEAL_THRESHOLD },
  );

  targets.forEach((el) => observer.observe(el));
}

/* astro:page-load fires on initial load AND after every ClientRouter
   navigation, so observers re-attach to the new page's .reveal elements. */
document.addEventListener('astro:page-load', initReveal);

export {};
