import { Link, NavLink, Outlet } from 'react-router';

export function Header({ ctaHref = '#explore', ctaText = 'เริ่มสำรวจ ↓' }) {
  return (
    <header className="nav" id="top">
      <Link className="brand" to="/" aria-label="Coffee Guide home">
        <img src="/images/logo/LOGO.png" alt="" />
        <span>COFFEE<br />GUIDE</span>
      </Link>
      <nav className="nav-links" aria-label="เมนูหลัก">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/varieties">สายพันธุ์กาแฟ</NavLink>
        <NavLink to="/coffee-menu">เมนูกาแฟ</NavLink>
      </nav>
      <a className="nav-cta" href={ctaHref}>{ctaText}</a>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <Link className="brand" to="/">
          <img src="/images/logo/LOGO.png" alt="" />
          <span>COFFEE<br />GUIDE</span>
        </Link>
        <small>เรื่องราวดี ๆ เริ่มต้นได้ในกาแฟหนึ่งแก้ว</small>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/varieties">สายพันธุ์กาแฟ</Link>
          <Link to="/coffee-menu">เมนูกาแฟ</Link>
        </div>
      </div>
    </footer>
  );
}

export default function SiteLayout() {
  return <><Outlet /></>;
}
