import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import Introduction from '../components/Introduction.jsx';
import { Footer, Header } from '../components/SiteLayout.jsx';
import Ticker from '../components/Ticker.jsx';
import useCoffeeData from '../hooks/useCoffeeData.js';
import assetUrl from '../utils/assetUrl.js';

const catalogSettings = {
  varieties: {
    key: 'Coffee_Varietals', title: 'สายพันธุ์กาแฟ', type: 'สายพันธุ์กาแฟ', marker: '01',
    eyebrow: 'Coffee Guide · 01 / Origins',
    intro: <>Every bean<br />has <em>a story.</em></>,
    description: 'เริ่มรู้จักกาแฟจากต้นทาง สำรวจสายพันธุ์ แหล่งปลูก และรสชาติที่แตกต่างกันในแต่ละแก้ว',
    headline: 'Meet the varieties', imageFolder: 'coffee', firstImage: 'C001.webp',
    ticker: ['Origin shapes flavor', 'Know your beans', 'Grown in Thailand'],
    helper: 'แต่ละรายการจะค่อย ๆ เข้ามาในเรื่องราวเมื่อคุณเลื่อน ภาพด้านข้างจะเปลี่ยนตามสายพันธุ์ที่กำลังอ่าน',
    search: 'ค้นหาชื่อ รสชาติ หรือจังหวัด...',
  },
  menu: {
    key: 'Coffee_Menu', title: 'เมนูกาแฟ', type: 'เมนูกาแฟ', marker: '02',
    eyebrow: 'Coffee Guide · 02 / In the cup',
    intro: <>Find your<br /><em>next favorite.</em></>,
    description: 'จากเอสเพรสโซเข้มข้นไปจนถึงแก้วเย็นสดชื่น สำรวจเมนูกาแฟและค้นหารสชาติที่เข้ากับวันของคุณ',
    headline: 'Something to sip', imageFolder: 'menu', firstImage: 'M001.webp',
    ticker: ['Something to sip', 'Made for curious sips', 'Your next favorite'],
    helper: 'เลื่อนดูทีละเมนู ภาพและรายละเอียดจะเปลี่ยนตามรายการที่อยู่ตรงกลางหน้าจอ',
    search: 'ค้นหาชื่อหรือรสชาติ...',
  },
};

export default function CatalogPage({ kind }) {
  const settings = catalogSettings[kind];
  const { data, status, error, retry, isFirebase, source } = useCoffeeData();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(() => new Set());
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const records = data?.[settings.key] || [];
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return needle ? records.filter((item) => Object.values(item).join(' ').toLocaleLowerCase().includes(needle)) : records;
  }, [records, query]);
  const active = filtered[activeIndex] || filtered[0];
  const introRecord = records[0];
  const imagePath = (item) => assetUrl(`/images/${settings.imageFolder}/${item?.image || settings.firstImage}`);

  useEffect(() => {
    setActiveIndex(0);
    setRevealed(new Set());
  }, [query, status]);

  useEffect(() => {
    if (!filtered.length) return undefined;
    const nodes = [...document.querySelectorAll('.story-item[data-index]')];
    if (!('IntersectionObserver' in window)) {
      setRevealed(new Set(filtered.map((_, index) => index)));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number(entry.target.dataset.index);
        setRevealed((previous) => new Set(previous).add(index));
        setActiveIndex(index);
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [filtered, status]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      setProgress(Math.max(0, Math.min(1, -bounds.top / Math.max(1, section.offsetHeight - window.innerHeight))));
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      cancelAnimationFrame(frame);
    };
  }, [status, filtered]);

  const title = settings.title;
  return (
    <div data-kind={kind}>
      <Header ctaHref="#catalog" ctaText="เลื่อนเพื่อสำรวจ ↓" />
      <main>
        <Introduction eyebrow={settings.eyebrow} title={settings.intro} description={settings.description}
          count={<>{title} <b>{records.length}</b> เรื่องราว</>} marker={settings.marker}
          image={introRecord ? imagePath(introRecord) : `/images/${settings.imageFolder}/${settings.firstImage}`}
          alt={introRecord?.name_en || title} label="SCROLL TO EXPLORE" />
        <Ticker phrases={settings.ticker} />
        <section id="catalog" className="shell" ref={sectionRef} style={{ '--story-progress': progress }}>
          <div className="catalog-intro">
            <div><div className="eyebrow">A closer look</div><h2>{settings.headline}</h2></div>
            <p>{settings.helper}</p>
          </div>
          <div className="catalog-tools">
            <span className="catalog-count" aria-live="polite">
              {status === 'ready' ? `แสดงทั้งหมด ${filtered.length} ${settings.type}` : isFirebase ? 'กำลังเชื่อมข้อมูล Firebase' : `กำลังโหลด${settings.type}`}
            </span>
            <input className="search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={settings.search} aria-label={`ค้นหา${settings.type}`} />
          </div>
          {status === 'loading' && <div className="data-message" role="status">กำลังโหลดข้อมูลกาแฟ…</div>}
          {status === 'error' && <div className="data-message" role="alert">โหลดข้อมูลไม่สำเร็จ: {error} <button onClick={retry}>ลองอีกครั้ง</button></div>}
          {status === 'ready' && source === 'local' && error && <div className="data-message" role="status">กำลังแสดงข้อมูลสำรองในเครื่อง เนื่องจาก Firebase ยังอ่านข้อมูลไม่ได้: {error} <button onClick={retry}>ลองอีกครั้ง</button></div>}
          {status === 'ready' && !filtered.length && <div className="data-message">{query ? 'ไม่พบข้อมูลที่ค้นหา' : `ยังไม่มีข้อมูล${settings.type}ในระบบ`}</div>}
          {status === 'ready' && filtered.length > 0 && (
            <div className="story-section">
              <aside className="story-visual" aria-live="polite">
                <img className="story-visual-img" src={imagePath(active)} alt={active?.name_en || active?.name_th || title} />
                <div className="story-visual-meta">
                  <div className="story-index">{String(activeIndex + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}</div>
                  <h2 className="story-visual-title">{active?.name_th}</h2>
                  <div className="story-visual-en">{active?.name_en}</div>
                </div>
                <div className="story-progress"><i /></div>
              </aside>
              <div className="story-list">
                {filtered.map((item, index) => <StoryCard key={item.coffee_id || item.menu_id || `${item.name_en}-${index}`} item={item} index={index} total={filtered.length} kind={kind} active={index === activeIndex} visible={revealed.has(index)} />)}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function StoryCard({ item, index, total, kind, active, visible }) {
  const tags = (item.tag || item.type || '').split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 3);
  const typeLabel = kind === 'menu' ? 'ประเภท' : 'สายพันธุ์';
  const typeValue = item.type || (item.tag || '').split(',')[0] || 'Coffee';
  return (
    <article className={`story-item${active ? ' is-active' : ''}${visible ? ' is-visible' : ''}`} data-index={index}>
      <div className="story-item-top">
        <span className="story-item-number">{String(index + 1).padStart(2, '0')} <span>/ {String(total).padStart(2, '0')}</span></span>
        <div className="story-tags">{tags.map((tag) => <span className="story-tag" key={tag}>{tag}</span>)}</div>
      </div>
      <h3>{item.name_th}<em>{item.name_en}</em></h3>
      <p className="story-desc">{item.description || `รสชาติของเมนูนี้: ${item.flavor || 'ไม่ระบุ'}`}</p>
      <dl className="story-facts">
        {item.province && <div className="story-fact"><dt>แหล่งปลูก</dt><dd>{item.province}</dd></div>}
        <div className="story-fact"><dt>รสชาติ</dt><dd>{item.flavor || 'ไม่ระบุ'}</dd></div>
        <div className="story-fact"><dt>{typeLabel}</dt><dd>{typeValue}</dd></div>
        <div className="story-fact"><dt>แหล่งข้อมูล</dt><dd>{item.source || 'ไม่ระบุ'}</dd></div>
      </dl>
      <div className="story-ending"><span>จบข้อมูลรายการนี้</span><span>{index + 1 < total ? `รายการที่ ${String(index + 2).padStart(2, '0')} ต่อไป ↓` : 'จบรายการทั้งหมด ✦'}</span></div>
    </article>
  );
}
