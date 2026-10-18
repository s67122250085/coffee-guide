// Shared scroll-driven animation for the Home, Varieties, and Menu pages.
(() => {
  const intro = document.querySelector('.intro-scroll');
  if (!intro) return;

  const copy = intro.querySelector('.intro-copy');
  const visual = intro.querySelector('.intro-visual');
  const image = intro.querySelector('.intro-image');
  const counter = intro.querySelector('.intro-counter');
  const easing = 0.32;

  let targetProgress = 0;
  let currentProgress = 0;
  let frame = 0;

  function animateIntro() {
    frame = 0;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const introBounds = intro.getBoundingClientRect();
    const scrollDistance = Math.max(1, intro.offsetHeight - window.innerHeight);

    targetProgress = Math.max(0, Math.min(1, -introBounds.top / scrollDistance));
    currentProgress = reduceMotion
      ? targetProgress
      : currentProgress + (targetProgress - currentProgress) * easing;

    intro.style.setProperty('--intro-progress', currentProgress.toFixed(3));
    copy.style.transform = `translate3d(${-currentProgress * 40}px, ${-currentProgress * 110}px, 0)`;
    copy.style.opacity = String(Math.max(0, 1 - currentProgress * 1.65));
    visual.style.transform = `translate3d(${-currentProgress * 22}px, ${-currentProgress * 50}px, 0)`;

    const imageShift = window.innerWidth > 850 ? -currentProgress * window.innerWidth * 0.18 : 0;
    const imageScale = 1 + currentProgress * 2.4;
    image.style.transform = `translate3d(${imageShift}px, 0, 0) scale(${imageScale})`;
    counter.textContent = `${String(Math.round(currentProgress * 100)).padStart(2, '0')}%`;

    if (!reduceMotion && Math.abs(targetProgress - currentProgress) > 0.001) {
      frame = requestAnimationFrame(animateIntro);
    }
  }

  function requestAnimation() {
    if (!frame) frame = requestAnimationFrame(animateIntro);
  }

  window.addEventListener('scroll', requestAnimation, { passive: true });
  window.addEventListener('resize', requestAnimation);
  animateIntro();
})();
