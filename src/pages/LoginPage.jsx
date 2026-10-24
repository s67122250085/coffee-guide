import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../auth/AuthContext.jsx';
import { Footer, Header } from '../components/SiteLayout.jsx';
import { firebaseReady } from '../services/firebase.js';

function readableAuthError(cause) {
  switch (cause?.code) {
    case 'auth/configuration-not-found':
      return 'Firebase Authentication ยังไม่มีการตั้งค่าผู้ให้บริการ Google สำหรับโปรเจกต์นี้ เปิด Firebase Console > Authentication > Sign-in method แล้วเปิด Google และบันทึกการตั้งค่า';
    case 'auth/operation-not-allowed':
      return 'โปรเจกต์ยังไม่อนุญาตให้เข้าสู่ระบบด้วย Google เปิด Google provider ใน Firebase Console > Authentication > Sign-in method';
    case 'auth/unauthorized-domain':
      return 'โดเมนที่กำลังเปิดเว็บยังไม่ได้รับอนุญาต เปิด Firebase Console > Authentication > Settings > Authorized domains แล้วเพิ่ม localhost สำหรับพรีวิว หรือโดเมนเว็บที่ deploy';
    case 'auth/popup-closed-by-user':
      return 'ปิดหน้าต่างเข้าสู่ระบบก่อนดำเนินการเสร็จ';
    default:
      return `เข้าสู่ระบบไม่สำเร็จ: ${cause?.code || cause?.message || 'โปรดลองอีกครั้ง'}`;
  }
}

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const returnTo = searchParams.get('returnTo') || '/varieties';

  async function handleGoogleLogin() {
    setBusy(true);
    setError('');
    try {
      if (!user) await signInWithGoogle();
      navigate(returnTo, { replace: true });
    } catch (cause) {
      setError(readableAuthError(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="evaluation-page">
      <Header />
      <main className="evaluation-shell">
        <section className="evaluation-card login-card">
          <span className="eyebrow">COFFEE GUIDE · RESEARCH</span>
          <h1>เข้าสู่ระบบ<br /><em>ก่อนเริ่มสำรวจ</em></h1>
          <p>เข้าสู่ระบบเพื่อส่งแบบประเมินหลังจากสำรวจข้อมูลกาแฟแล้ว ผลประเมินจะผูกกับรหัสผู้ใช้โดยไม่บันทึกรหัสผ่านไว้ในระบบ</p>
          {!firebaseReady && <p className="evaluation-alert">ยังไม่ได้ตั้งค่า Firebase ในไฟล์สภาพแวดล้อมของโปรเจกต์</p>}
          {error && <p className="evaluation-alert" role="alert">{error}</p>}
          <button className="evaluation-primary google-button" onClick={handleGoogleLogin} disabled={!firebaseReady || busy || loading}>
            {busy ? 'กำลังเชื่อมต่อ…' : user ? 'ดำเนินการต่อด้วยบัญชี Google' : 'เข้าสู่ระบบด้วย Google'}
          </button>
          <small>การเข้าสู่ระบบใช้ Google ผ่าน Firebase Authentication</small>
          <Link className="evaluation-back" to={returnTo}>กลับไปยังหน้าสายพันธุ์/เมนู</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
