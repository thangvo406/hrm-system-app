export const formatCurrency = (
  value: number | string | undefined,
  includeCurrency = true,
): string => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numeric)) {
    return '';
  }
  return includeCurrency
    ? `${Math.round(numeric).toLocaleString('ko-KR')}원`
    : Math.round(numeric).toLocaleString('ko-KR');
};

type AttributeRow = {
  readonly attributeId: number;
  readonly attributeItemId: number;
};

export const groupAttributeItemsByAttributeId = (
  rows: AttributeRow[] | undefined,
): Record<number, number[]> => {
  if (!rows || rows.length === 0) {
    return {};
  }
  const result: Record<number, number[]> = {};
  for (const row of rows) {
    const bucket = result[row.attributeId] ?? [];
    if (!bucket.includes(row.attributeItemId)) {
      bucket.push(row.attributeItemId);
    }
    result[row.attributeId] = bucket;
  }
  return result;
};
