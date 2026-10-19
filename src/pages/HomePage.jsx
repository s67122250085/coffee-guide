import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Footer, Header } from '../components/SiteLayout.jsx';
import Introduction from '../components/Introduction.jsx';
import Ticker from '../components/Ticker.jsx';
import useCoffeeData from '../hooks/useCoffeeData.js';

export default function HomePage() {
  const { data, status, error, retry } = useCoffeeData();
  const varieties = data?.Coffee_Varietals || [];
  const menu = data?.Coffee_Menu || [];
  return (
    <div className="home-page">
      <Header ctaHref="#explore" />
      <main>
        <Introduction
          eyebrow="A guide for the curious"
          title={<>Good coffee<br />starts with<br /><em>a story.</em></>}
          description="จากต้นทางของเมล็ดกาแฟ ไปจนถึงแก้วโปรดใบถัดไป เริ่มค้นพบเรื่องราวของกาแฟในแบบของคุณ"
          count={<><b>{varieties.length}</b> สายพันธุ์ · <b>{menu.length}</b> เมนูกาแฟ</>}
          marker="CG"
          image="/images/menu/M004.webp"
          alt="Iced Cappuccino"
          label="SCROLL TO CHOOSE YOUR PATH"
        />
        <Ticker phrases={['Explore coffee', 'Find your next favorite', 'Made for curious sips']} />
        <section className="shell home-choices" id="explore">
          <div className="catalog-intro">
            <div><div className="eyebrow">Choose your path</div><h2>Where to begin?</h2></div>
            <p>เลือกเรื่องที่อยากรู้ แล้วค่อย ๆ สำรวจไปทีละแก้ว</p>
          </div>
          {status === 'loading' && <div className="data-message" role="status">กำลังโหลดข้อมูลกาแฟ…</div>}
          {status === 'error' && <div className="data-message" role="alert">โหลดข้อมูลไม่สำเร็จ: {error} <button onClick={retry}>ลองอีกครั้ง</button></div>}
          <div className="home-choice-grid">
            <ChoiceCard to="/varieties" className="home-choice-beans" image="/images/coffee/C006.webp" alt="Geisha coffee variety" eyebrow="01 · Origins" title={<>Meet the<br />varieties.</>} count={varieties.length} countLabel="coffee varieties" />
            <ChoiceCard to="/coffee-menu" className="home-choice-menu" image="/images/menu/M004.webp" alt="Iced cappuccino" eyebrow="02 · In the cup" title={<>Something<br />to sip.</>} count={menu.length} countLabel="coffee menus" />
          </div>
        </section>
        <section className="home-note">
          <div className="shell home-note-inner">
            <span className="eyebrow">Coffee Guide</span>
            <p>เรียนรู้ทีละเรื่อง<br /><em>แล้วเลือกแก้วที่ใช่</em></p>
            <Link to="/varieties">เริ่มจากสายพันธุ์ ↗</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ChoiceCard({ to, className, image, alt, eyebrow, title, count, countLabel }) {
  const cardRef = useRef(null);
  useEffect(() => {
    const node = cardRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      node?.classList.add('is-visible');
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <Link ref={cardRef} className={`home-choice ${className}`} to={to}>
      <img src={image} alt={alt} />
      <span className="home-choice-shade" />
      <span className="home-choice-content">
        <span className="eyebrow">{eyebrow}</span>
        <strong>{title}</strong>
        <span className="home-choice-bottom"><span><b>{count}</b> {countLabel}</span><span className="choice-arrow">↗</span></span>
      </span>
    </Link>
  );
}
