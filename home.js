(() => {
  const data = window.COFFEE_DATA || {};
  const varieties = data.Coffee_Varietals || [];
  const menus = data.Coffee_Menu || [];
  document.querySelector('#variety-total').textContent = varieties.length;
  document.querySelector('#menu-total').textContent = menus.length;
  document.querySelector('#home-variety-count').textContent = varieties.length;
  document.querySelector('#home-menu-count').textContent = menus.length;

  const intro = document.querySelector('.intro-scroll');
  const copy = document.querySelector('.intro-copy');
  const visual = document.querySelector('.intro-visual');
  const image = document.querySelector('#home-image');
  const counter = document.querySelector('#home-counter');
  let target = 0;
  let current = 0;
  let frame = 0;

  function animateScroll() {
    frame = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bounds = intro.getBoundingClientRect();
    const travel = Math.max(1, intro.offsetHeight - window.innerHeight);
    target = Math.max(0, Math.min(1, -bounds.top / travel));
    // This scene is scroll-driven (never autoplayed). Reduced-motion users
    // still get the requested effect, without interpolation lag.
    current = reduceMotion ? target : current + (target - current) * .2;
    intro.style.setProperty('--intro-progress', current.toFixed(3));
    copy.style.transform = `translate3d(${-current * 40}px,${-current * 110}px,0)`;
    copy.style.opacity = String(Math.max(0, 1 - current * 1.65));
    visual.style.transform = `translate3d(${-current * 22}px,${-current * 50}px,0)`;
    image.style.transform = `translate3d(${window.innerWidth > 850 ? -current * window.innerWidth * .18 : 0}px,0,0) scale(${1 + current * 2.4})`;
    counter.textContent = `${String(Math.round(current * 100)).padStart(2, '0')}%`;
    if (!reduceMotion && Math.abs(target - current) > .001) frame = requestAnimationFrame(animateScroll);
  }
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(animateScroll);
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!frame) frame = requestAnimationFrame(animateScroll);
  });
  animateScroll();

  const cards = document.querySelectorAll('.home-choice');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .18 });
    cards.forEach(card => observer.observe(card));
  } else {
    cards.forEach(card => card.classList.add('is-visible'));
  }
})();
