import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateCoffeeData } from './validateCoffeeData.mjs';

const importPath = fileURLToPath(new URL('../../data/firebase-import.json', import.meta.url));
const validData = JSON.parse(await readFile(importPath, 'utf8'));

test('accepts the prepared Firebase dataset', () => {
  assert.deepEqual(validateCoffeeData(validData), { valid: true, errors: [] });
});

test('rejects a missing collection', () => {
  const invalid = { ...validData, coffee_menu: null };
  const result = validateCoffeeData(invalid);
  assert.equal(result.valid, false);
  assert.match(result.errors[0], /coffee_menu/);
});

test('rejects a mismatched Firebase key and record ID', () => {
  const invalid = structuredClone(validData);
  invalid.coffee_menu.M001.menu_id = 'M099';
  const result = validateCoffeeData(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes('menu_id ต้องตรงกับ key')));
});

test('rejects records missing required fields', () => {
  const invalid = structuredClone(validData);
  delete invalid.coffee_varieties.C001.name_th;
  const result = validateCoffeeData(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes('ไม่มีข้อมูล name_th')));
});
