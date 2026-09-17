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
