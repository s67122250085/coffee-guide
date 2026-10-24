import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { get, ref, set } from 'firebase/database';
import { useAuth } from '../auth/AuthContext.jsx';
import { Footer, Header } from '../components/SiteLayout.jsx';
import { evaluationGroups, evaluationQuestions, satisfactionScale } from '../data/assessment.js';
import { database } from '../services/firebase.js';

function meanForGroup(group, ratings) {
  const scores = group.questions.map((question) => Number(ratings[question.id]));
  return Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2));
}

export default function AssessmentPage() {
  const { phase } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [existingEvaluation, setExistingEvaluation] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ratings, setRatings] = useState({});
  const [consented, setConsented] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const returnTo = searchParams.get('returnTo') || '/varieties';
  const isValidPhase = phase === 'survey';
  const complete = useMemo(() => evaluationQuestions.every((question) => ratings[question.id] !== undefined), [ratings]);

  useEffect(() => {
    let live = true;
    async function load() {
      if (loading) return;
      if (!user) {
        setChecking(false);
        return;
      }
      if (!database) {
        setError('ยังไม่ได้เชื่อมต่อ Firebase Realtime Database');
        setChecking(false);
        return;
      }
      setChecking(true);
      try {
        const snapshot = await get(ref(database, `assessments/${user.uid}/evaluation`));
        if (live) setExistingEvaluation(snapshot.exists());
      } catch (cause) {
        if (live) setError(`อ่านสถานะการประเมินไม่สำเร็จ: ${cause?.message || 'โปรดลองอีกครั้ง'}`);
      } finally {
        if (live) setChecking(false);
      }
    }
    load();
    return () => { live = false; };
  }, [user, loading]);

  useEffect(() => {
    if (loading || checking) return;
    if (!isValidPhase) {
      navigate(returnTo, { replace: true });
      return;
    }
    if (!user) {
      const surveyPath = `/assessment/survey?returnTo=${encodeURIComponent(returnTo)}`;
      navigate(`/login?returnTo=${encodeURIComponent(surveyPath)}`, { replace: true });
      return;
    }
    if (existingEvaluation) navigate(returnTo, { replace: true });
  }, [loading, checking, isValidPhase, user, existingEvaluation, navigate, returnTo]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user || !database || !complete || !consented || existingEvaluation) return;
    setBusy(true);
    setError('');
    try {
      const satisfactionGroup = evaluationGroups.find((group) => group.id === 'satisfaction');
      const impactGroup = evaluationGroups.find((group) => group.id === 'perceivedImpact');
      const submission = {
        ratings,
        satisfactionAverage: meanForGroup(satisfactionGroup, ratings),
        perceivedImpactAverage: meanForGroup(impactGroup, ratings),
        submittedAt: Date.now(),
      };
      await set(ref(database, `assessments/${user.uid}/evaluation`), submission);
      navigate(returnTo, { replace: true });
    } catch (cause) {
      setError(`บันทึกแบบประเมินไม่สำเร็จ: ${cause?.message || 'โปรดลองอีกครั้ง'}`);
    } finally {
      setBusy(false);
    }
  }

  if (loading || checking || !isValidPhase || existingEvaluation) {
    return <div className="evaluation-page"><Header /><main className="evaluation-shell"><p className="data-message">กำลังตรวจสอบสถานะ…</p></main><Footer /></div>;
  }

  let questionNumber = 0;
  return (
    <div className="evaluation-page">
      <Header />
      <main className="evaluation-shell">
        <section className="evaluation-card">
          <span className="eyebrow">COFFEE GUIDE · USER FEEDBACK</span>
          <div className="assessment-progress"><span className="is-current">แบบประเมินหลังสำรวจข้อมูล</span></div>
          <h1>แบ่งปันความเห็น<br /><em>หลังสำรวจ Coffee Guide</em></h1>
          <p className="assessment-intro">โปรดให้คะแนนความพึงพอใจและผลที่คุณได้รับจากเว็บไซต์ โดยเลือก 1 (น้อยที่สุด) ถึง 5 (มากที่สุด)</p>
          {error && <p className="evaluation-alert" role="alert">{error}</p>}
          <form onSubmit={handleSubmit}>
            {evaluationGroups.map((group) => (
              <div className="evaluation-group" key={group.id}>
                <h2>{group.title}</h2>
                {group.questions.map((question) => {
                  questionNumber += 1;
                  return (
                    <fieldset className="assessment-question" key={question.id}>
                      <legend><span>{String(questionNumber).padStart(2, '0')}</span>{question.label}</legend>
                      <div className="rating-options">
                        {satisfactionScale.map((scale) => (
                          <label className="rating-option" key={scale.value}>
                            <input type="radio" name={question.id} value={scale.value} checked={Number(ratings[question.id]) === scale.value} onChange={() => setRatings((current) => ({ ...current, [question.id]: scale.value }))} />
                            <span>{scale.value}</span><small>{scale.label}</small>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            ))}
            <label className="assessment-consent">
              <input type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} />
              <span>ยินยอมให้ใช้ผลแบบประเมินเพื่อศึกษาความพึงพอใจและผลที่ผู้ใช้รับรู้ โดยรายงานเป็นภาพรวมและไม่เปิดเผยชื่อหรืออีเมล</span>
            </label>
            <button className="evaluation-primary" type="submit" disabled={!complete || !consented || busy}>
              {busy ? 'กำลังบันทึก…' : 'ส่งแบบประเมินและกลับเว็บไซต์'}
            </button>
          </form>
          <Link className="evaluation-back" to={returnTo}>กลับไปดูข้อมูลกาแฟ</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
