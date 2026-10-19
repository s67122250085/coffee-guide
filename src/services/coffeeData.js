import { get, ref } from 'firebase/database';
import localCoffeeData from '../../data/coffee.json';
import { database, firebaseReady } from './firebase.js';
import { validateCoffeeData } from './validateCoffeeData.mjs';

function normalizeCollection(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

export async function loadCoffeeData() {
  if (!firebaseReady) return { data: localCoffeeData, source: 'local', warning: '' };
  try {
    const [varieties, menu] = await Promise.all([
      get(ref(database, 'coffee_varieties')),
      get(ref(database, 'coffee_menu')),
    ]);
    const varietyRecords = normalizeCollection(varieties.val());
    const menuRecords = normalizeCollection(menu.val());
    const varietiesAreMisfiled = varietyRecords.length === 0
      && menuRecords.some((item) => item?.coffee_id && !item?.menu_id);
    if (varietiesAreMisfiled) {
      throw new Error('โครงสร้าง Firebase ยังไม่ตรง: ข้อมูลสายพันธุ์อยู่ใน coffee_menu และยังไม่มีข้อมูลเมนู');
    }
    if (!varieties.exists() || !menu.exists()) {
      throw new Error('ยังไม่พบข้อมูลสายพันธุ์หรือเมนูครบทั้งสองรายการใน Firebase');
    }
    const validation = validateCoffeeData({
      coffee_varieties: varieties.val(),
      coffee_menu: menu.val(),
    });
    if (!validation.valid) {
      throw new Error(`ข้อมูล Firebase ไม่ครบหรือรูปแบบไม่ถูกต้อง: ${validation.errors[0]}`);
    }
    return {
      data: { Coffee_Varietals: varietyRecords, Coffee_Menu: menuRecords },
      source: 'firebase',
      warning: '',
    };
  } catch (error) {
    return {
      data: localCoffeeData,
      source: 'local',
      warning: error?.message || 'เชื่อมต่อ Firebase ไม่สำเร็จ',
    };
  }
}

export function usingFirebase() {
  return firebaseReady;
}
