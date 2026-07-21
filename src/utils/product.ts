import type { ISelectedAttributeItem } from '@type/products';

export const formatCurrency = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numeric)) {
    return '';
  }
  return Math.round(numeric).toLocaleString('ko-KR');
};

export const groupAttributeItemsByAttributeId = (
  rows?: any[],
): Record<number, ISelectedAttributeItem[]> => {
  if (!rows || rows.length === 0) {
    return {};
  }
  const result: Record<number, ISelectedAttributeItem[]> = {};
  for (const row of rows) {
    const bucket = result[row.attributeId] ?? [];
    if (!bucket.some(entry => entry.itemId === row.attributeItemId)) {
      bucket.push({ itemId: row.attributeItemId, quantity: 1 });
    }
    result[row.attributeId] = bucket;
  }
  return result;
};
