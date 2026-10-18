(() => {
  const kind = document.body.dataset.kind;
  const records = kind === 'menu'
    ? (window.COFFEE_DATA?.Coffee_Menu || [])
    : (window.COFFEE_DATA?.Coffee_Varietals || []);
  const grid = document.querySelector('#story-list');
  const search = document.querySelector('#search');
  const image = document.querySelector('#story-visual-img');
  const visualNumber = document.querySelector('#story-index');
  const visualTitle = document.querySelector('#story-visual-title');
  const visualEnglish = document.querySelector('#story-visual-en');
  const count = document.querySelector('#catalog-count');
  const introImage = document.querySelector('#intro-image');
  const introScroll = document.querySelector('.intro-scroll');
  const introCopy = document.querySelector('.intro-copy');
  const introVisual = document.querySelector('.intro-visual');
  const introProgress = document.querySelector('#intro-counter');
  const storySection = document.querySelector('.story-section');
  let currentRecords = records;
  let storyObserver = null;
  let frame = 0;
  let targetProgress = 0;
  let easedProgress = 0;
  let imageSwapTimer = 0;
  let pendingImageSrc = '';
  const idOf = item => kind === 'menu' ? item.menu_id : item.coffee_id;
  const assetOf = item => `images/${kind === 'menu' ? 'menu' : 'coffee'}/${item.image || `${idOf(item)}.webp`}`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function itemMarkup(item, index) {
    const absoluteIndex = index;
    const nextItem = currentRecords[absoluteIndex + 1];
    const tags = (item.tag || item.type || '').split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 3);
    const description = item.description || `รสชาติของเมนูนี้: ${item.flavor || 'ไม่ระบุ'}`;
    return `<article class="story-item" data-id="${esc(idOf(item))}">
      <div class="story-item-top"><span class="story-item-number">${String(absoluteIndex + 1).padStart(2, '0')} <span>/ ${String(currentRecords.length).padStart(2, '0')}</span></span><div class="story-tags">${tags.map(tag => `<span class="story-tag">${esc(tag)}</span>`).join('')}</div></div>
      <h3>${esc(item.name_th)}<em>${esc(item.name_en)}</em></h3>
      <p class="story-desc">${esc(description)}</p>
      <dl class="story-facts">${item.province ? `<div class="story-fact"><dt>แหล่งปลูก</dt><dd>${esc(item.province)}</dd></div>` : ''}<div class="story-fact"><dt>รสชาติ</dt><dd>${esc(item.flavor || 'ไม่ระบุ')}</dd></div><div class="story-fact"><dt>${kind === 'menu' ? 'ประเภท' : 'สายพันธุ์'}</dt><dd>${esc(item.type || (item.tag || '').split(',')[0] || 'Coffee')}</dd></div><div class="story-fact"><dt>แหล่งข้อมูล</dt><dd>${esc(item.source || 'ไม่ระบุ')}</dd></div></dl>
      <div class="story-ending"><span>จบข้อมูลรายการนี้</span><span>${nextItem ? `ถัดไป · ${esc(nextItem.name_th)} ↓` : 'จบรายการทั้งหมด ✦'}</span></div>
    </article>`;
  }

  function setActiveItem(item, index) {
    if (!item) return;
    const nextSrc = assetOf(item);
    if (image.getAttribute('src') !== nextSrc) {
      pendingImageSrc = nextSrc;
      window.clearTimeout(imageSwapTimer);
      image.classList.add('is-changing');
      imageSwapTimer = window.setTimeout(() => {
        if (pendingImageSrc !== nextSrc) return;
        image.onload = () => image.classList.remove('is-changing');
        image.onerror = () => image.classList.remove('is-changing');
        image.src = nextSrc;
        image.alt = item.name_en || item.name_th;
      }, 160);
    }
    visualNumber.textContent = `${String(index + 1).padStart(2, '0')} / ${String(currentRecords.length).padStart(2, '0')}`;
    visualTitle.textContent = item.name_th;
    visualEnglish.textContent = item.name_en;
    document.querySelectorAll('.story-item.is-active').forEach(node => node.classList.remove('is-active'));
    grid.querySelector(`[data-id="${CSS.escape(idOf(item))}"]`)?.classList.add('is-active');
  }

  function observeStories() {
    storyObserver?.disconnect();
    if (!('IntersectionObserver' in window)) {
      grid.querySelectorAll('.story-item').forEach(item => item.classList.add('is-visible'));
      return;
    }
    storyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        const itemIndex = currentRecords.findIndex(item => idOf(item) === entry.target.dataset.id);
        setActiveItem(currentRecords[itemIndex], itemIndex);
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    grid.querySelectorAll('.story-item').forEach(item => storyObserver.observe(item));
  }

  function render(list) {
    currentRecords = list;
    count.textContent = list.length
      ? `แสดงทั้งหมด ${list.length} ${kind === 'menu' ? 'เมนูกาแฟ' : 'สายพันธุ์กาแฟ'}`
      : 'ไม่พบข้อมูล';
    if (!list.length) {
      grid.innerHTML = '<p class="story-empty">ไม่พบข้อมูลที่ค้นหา</p>';
      storyObserver?.disconnect();
      return;
    }
    grid.innerHTML = list.map(itemMarkup).join('');
    setActiveItem(list[0], 0);
    observeStories();
  }

  function updateScroll() {
    frame = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const introRect = introScroll.getBoundingClientRect();
    const introTravel = Math.max(1, introScroll.offsetHeight - window.innerHeight);
    targetProgress = Math.max(0, Math.min(1, -introRect.top / introTravel));
    // Keep scroll-linked storytelling available in reduced-motion mode, but
    // remove interpolation lag so the response remains predictable.
    easedProgress = reduceMotion ? targetProgress : easedProgress + (targetProgress - easedProgress) * .2;
    const progress = easedProgress;
    introScroll.style.setProperty('--intro-progress', progress.toFixed(3));
    introCopy.style.transform = `translate3d(${-progress * 40}px, ${-progress * 110}px, 0)`;
    introCopy.style.opacity = String(Math.max(0, 1 - progress * 1.65));
    introVisual.style.transform = `translate3d(${-progress * 22}px, ${-progress * 50}px, 0)`;
    introImage.style.transform = `translate3d(${window.innerWidth > 850 ? -progress * window.innerWidth * .18 : 0}px,0,0) scale(${1 + progress * 2.4})`;
    introProgress.textContent = `${String(Math.round(progress * 100)).padStart(2, '0')}%`;
    const storyRect = storySection.getBoundingClientRect();
    const storyTravel = Math.max(1, storySection.offsetHeight - window.innerHeight);
    storySection.style.setProperty('--story-progress', Math.max(0, Math.min(1, -storyRect.top / storyTravel)).toFixed(3));
    if (!reduceMotion && Math.abs(targetProgress - easedProgress) > .001) frame = requestAnimationFrame(updateScroll);
  }

  function requestScrollUpdate() {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  }

  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    const filtered = records.filter(item => Object.values(item).join(' ').toLocaleLowerCase().includes(query));
    render(filtered);
  });
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  introImage.src = assetOf(records[0]);
  introImage.alt = records[0]?.name_en || 'Coffee';
  document.querySelector('#intro-total').textContent = records.length;
  render(records);
  updateScroll();
})();
