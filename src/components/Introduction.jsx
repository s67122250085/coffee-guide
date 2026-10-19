import { useEffect, useRef } from 'react';

export default function Introduction({ eyebrow, title, description, count, image, alt, marker = '01', label = 'SCROLL TO EXPLORE' }) {
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const visualRef = useRef(null);
  const imageRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    let frame = 0;
    let target = 0;
    let current = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animate = () => {
      frame = 0;
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      target = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance));
      current = reduced.matches ? target : current + (target - current) * 0.22;
      section.style.setProperty('--intro-progress', current.toFixed(3));
      copyRef.current.style.transform = `translate3d(0, ${-current * 72}px, 0)`;
      copyRef.current.style.opacity = String(Math.max(0, 1 - current * 1.55));
      visualRef.current.style.transform = `translate3d(0, ${-current * 38}px, 0)`;
      const shift = window.innerWidth > 850 ? -current * window.innerWidth * 0.14 : 0;
      imageRef.current.style.transform = `translate3d(${shift}px, 0, 0) scale(${1 + current * 1.25})`;
      counterRef.current.textContent = `${String(Math.round(current * 100)).padStart(2, '0')}%`;
      if (!reduced.matches && Math.abs(target - current) > 0.001) frame = requestAnimationFrame(animate);
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(animate); };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    animate();
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="intro-scroll" ref={sectionRef} aria-label={eyebrow}>
      <div className="intro-sticky">
        <div className="shell intro-layout">
          <div className="intro-copy" ref={copyRef}>
            <div className="eyebrow">{eyebrow}</div>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="intro-count">
              <span className="count-mark">{marker}</span>
              <span>{count}<br />เลื่อนลงเพื่อเริ่มสำรวจ</span>
            </div>
          </div>
          <div className="intro-visual" ref={visualRef}>
            <img className="intro-image" ref={imageRef} src={image} alt={alt} />
          </div>
        </div>
        <div className="intro-scroll-label"><span>{label}</span><i /></div>
        <span className="intro-counter" ref={counterRef}>00%</span>
      </div>
    </section>
  );
}
