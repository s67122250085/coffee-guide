import { get, ref } from 'firebase/database';
import localCoffeeData from '../../data/coffee.json';
import { database, firebaseReady } from './firebase.js';

function normalizeCollection(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

export async function loadCoffeeData() {
  if (!firebaseReady) return localCoffeeData;
  const [varieties, menu] = await Promise.all([
    get(ref(database, 'Coffee_Varietals')),
    get(ref(database, 'Coffee_Menu')),
  ]);
  if (!varieties.exists() || !menu.exists()) {
    throw new Error('ยังไม่พบข้อมูลสายพันธุ์หรือเมนูใน Firebase Realtime Database');
  }
  return {
    Coffee_Varietals: normalizeCollection(varieties.val()),
    Coffee_Menu: normalizeCollection(menu.val()),
  };
}

export function usingFirebase() {
  return firebaseReady;
}
