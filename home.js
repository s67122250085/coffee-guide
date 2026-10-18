(() => {
  // Update the counts shown in the Home page sections.
  const data = window.COFFEE_DATA || {};
  const varieties = data.Coffee_Varietals || [];
  const menus = data.Coffee_Menu || [];
  document.querySelector('#variety-total').textContent = varieties.length;
  document.querySelector('#menu-total').textContent = menus.length;
  document.querySelector('#home-variety-count').textContent = varieties.length;
  document.querySelector('#home-menu-count').textContent = menus.length;

  // Reveal the two navigation cards as they enter the viewport.
  const cards = document.querySelectorAll('.home-choice');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    cards.forEach(card => observer.observe(card));
  } else {
    cards.forEach(card => card.classList.add('is-visible'));
  }
})();
