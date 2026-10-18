(() => {
  // Select the data set and page elements for either catalog page.
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
  const introTotal = document.querySelector('#intro-total');
  const storySection = document.querySelector('.story-section');
  let currentRecords = records;
  let storyObserver = null;
  let frame = 0;
  let imageSwapTimer = 0;
  let pendingImageSrc = '';
  // Keep page-specific field names in one place.
  const idOf = item => kind === 'menu' ? item.menu_id : item.coffee_id;
  const assetOf = item => {
    const folder = kind === 'menu' ? 'menu' : 'coffee';
    return `images/${folder}/${item.image || `${idOf(item)}.webp`}`;
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

  // Build one story card from a coffee variety or menu record.
  function itemMarkup(item, index) {
    const nextItem = currentRecords[index + 1];
    const tags = (item.tag || item.type || '')
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .slice(0, 3);
    const description = item.description
      || `รสชาติของเมนูนี้: ${item.flavor || 'ไม่ระบุ'}`;
    const originFact = item.province
      ? `<div class="story-fact"><dt>แหล่งปลูก</dt><dd>${esc(item.province)}</dd></div>`
      : '';
    const typeLabel = kind === 'menu' ? 'ประเภท' : 'สายพันธุ์';
    const typeValue = item.type || (item.tag || '').split(',')[0] || 'Coffee';
    const nextLabel = nextItem
      ? `ถัดไป · ${esc(nextItem.name_th)} ↓`
      : 'จบรายการทั้งหมด ✦';

    return `
      <article class="story-item" data-id="${esc(idOf(item))}">
        <div class="story-item-top">
          <span class="story-item-number">
            ${String(index + 1).padStart(2, '0')}
            <span>/ ${String(currentRecords.length).padStart(2, '0')}</span>
          </span>
          <div class="story-tags">
            ${tags.map(tag => `<span class="story-tag">${esc(tag)}</span>`).join('')}
          </div>
        </div>
        <h3>${esc(item.name_th)}<em>${esc(item.name_en)}</em></h3>
        <p class="story-desc">${esc(description)}</p>
        <dl class="story-facts">
          ${originFact}
          <div class="story-fact">
            <dt>รสชาติ</dt>
            <dd>${esc(item.flavor || 'ไม่ระบุ')}</dd>
          </div>
          <div class="story-fact">
            <dt>${typeLabel}</dt>
            <dd>${esc(typeValue)}</dd>
          </div>
          <div class="story-fact">
            <dt>แหล่งข้อมูล</dt>
            <dd>${esc(item.source || 'ไม่ระบุ')}</dd>
          </div>
        </dl>
        <div class="story-ending">
          <span>จบข้อมูลรายการนี้</span>
          <span>${nextLabel}</span>
        </div>
      </article>
    `;
  }

  // Update the sticky photo and identify the story currently in view.
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
    visualNumber.textContent = [
      String(index + 1).padStart(2, '0'),
      String(currentRecords.length).padStart(2, '0'),
    ].join(' / ');
    visualTitle.textContent = item.name_th;
    visualEnglish.textContent = item.name_en;
    document.querySelectorAll('.story-item.is-active').forEach(node => node.classList.remove('is-active'));
    const activeCard = grid.querySelector(`[data-id="${CSS.escape(idOf(item))}"]`);
    activeCard?.classList.add('is-active');
  }

  // Reveal cards as they approach the center of the viewport.
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
        const itemIndex = currentRecords.findIndex(
          item => idOf(item) === entry.target.dataset.id,
        );
        setActiveItem(currentRecords[itemIndex], itemIndex);
      });
    }, {
      rootMargin: '-42% 0px -42% 0px',
      threshold: 0,
    });
    grid.querySelectorAll('.story-item').forEach(item => storyObserver.observe(item));
  }

  // Refresh the count and story cards after loading or searching.
  function render(list) {
    currentRecords = list;
    const itemType = kind === 'menu' ? 'เมนูกาแฟ' : 'สายพันธุ์กาแฟ';
    count.textContent = list.length
      ? `แสดงทั้งหมด ${list.length} ${itemType}`
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
    // Keep the progress bar tied to the full story list.
    const storyRect = storySection.getBoundingClientRect();
    const storyTravel = Math.max(1, storySection.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -storyRect.top / storyTravel));
    storySection.style.setProperty('--story-progress', progress.toFixed(3));
  }

  function requestScrollUpdate() {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  }

  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    const filtered = records.filter(item =>
      Object.values(item).join(' ').toLocaleLowerCase().includes(query),
    );
    render(filtered);
  });
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  // Keep the catalog intro image and counter aligned with the first record.
  introImage.src = assetOf(records[0]);
  introImage.alt = records[0]?.name_en || 'Coffee';
  introTotal.textContent = records.length;
  render(records);
  updateScroll();
})();
