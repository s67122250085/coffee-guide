const collections = [
  {
    node: 'coffee_varieties',
    idField: 'coffee_id',
    idPattern: /^C\d{3,}$/,
    required: ['coffee_id', 'name_th', 'name_en', 'type', 'description', 'province', 'flavor', 'source', 'image', 'tag'],
  },
  {
    node: 'coffee_menu',
    idField: 'menu_id',
    idPattern: /^M\d{3,}$/,
    required: ['menu_id', 'name_th', 'name_en', 'flavor', 'source', 'image', 'tag'],
  },
];

export function validateCoffeeData(data) {
  const errors = [];

  for (const schema of collections) {
    const collection = data?.[schema.node];
    if (!collection || typeof collection !== 'object' || Array.isArray(collection)) {
      errors.push(`โหนด ${schema.node} ต้องเป็น object`);
      continue;
    }

    const records = Object.entries(collection);
    if (records.length === 0) errors.push(`โหนด ${schema.node} ไม่มีรายการ`);

    for (const [key, record] of records) {
      if (!schema.idPattern.test(key)) errors.push(`${schema.node}/${key}: รูปแบบรหัสไม่ถูกต้อง`);
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        errors.push(`${schema.node}/${key}: รายการต้องเป็น object`);
        continue;
      }
      if (record[schema.idField] !== key) errors.push(`${schema.node}/${key}: ${schema.idField} ต้องตรงกับ key`);

      for (const field of schema.required) {
        if (typeof record[field] !== 'string' || !record[field].trim()) {
          errors.push(`${schema.node}/${key}: ไม่มีข้อมูล ${field}`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
