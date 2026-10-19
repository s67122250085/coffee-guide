import { useCallback, useEffect, useState } from 'react';
import { loadCoffeeData, usingFirebase } from '../services/coffeeData.js';

export default function useCoffeeData() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    loadCoffeeData().then((result) => {
      if (!active) return;
      setData(result);
      setStatus('ready');
      setError('');
    }).catch((cause) => {
      if (!active) return;
      setError(cause?.message || 'โหลดข้อมูลไม่สำเร็จ');
      setStatus('error');
    });
    return () => { active = false; };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return { data, status, error, retry, isFirebase: usingFirebase() };
}
