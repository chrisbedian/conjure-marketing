/**
 * Scroll-reveal + lazy-video controller for the marketing splash.
 *  - .reveal elements gain .is-visible when ~15% in view.
 *  - <video data-lazy> elements promote data-src → src and start playing
 *    when in view (with a 256px rootMargin to begin loading just before).
 * Both observers are one-shot.
 */

const REVEAL_THRESHOLD = 0.15;
const VIDEO_ROOT_MARGIN = '256px';

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

function promoteSources(video: HTMLVideoElement) {
  video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((src) => {
    const url = src.dataset.src;
    if (url) {
      src.setAttribute('src', url);
      src.removeAttribute('data-src');
    }
  });
}

function initLazyVideos() {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-lazy]');
  if (!videos.length) return;

  if (!('IntersectionObserver' in window)) {
    videos.forEach((v) => {
      promoteSources(v);
      v.load();
      v.play().catch(() => {});
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const video = entry.target as HTMLVideoElement;
        promoteSources(video);
        video.load();
        video.play().catch(() => {});
        observer.unobserve(video);
      });
    },
    { rootMargin: VIDEO_ROOT_MARGIN },
  );

  videos.forEach((v) => observer.observe(v));
}

function initVideoCrossfade() {
  document
    .querySelectorAll<HTMLVideoElement>('video[data-crossfade]')
    .forEach((video) => {
      const ready = () => video.classList.add('is-playing');
      if (video.readyState >= 2) {
        ready();
      } else {
        video.addEventListener('loadeddata', ready, { once: true });
      }
    });
}

function init() {
  initReveal();
  initLazyVideos();
  initVideoCrossfade();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

export {};
