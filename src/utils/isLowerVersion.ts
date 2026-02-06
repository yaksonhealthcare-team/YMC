/**
 * a < b 이면 true
 * 예: isLowerVersion('1.1.0', '1.1.1') === true
 */
export const isLowerVersion = (a: string, b: string): boolean => {
  const toNums = (v: string) => v.split('.').map((n) => Number(n) || 0);

  const [a1, a2, a3] = toNums(a);
  const [b1, b2, b3] = toNums(b);

  if (a1 !== b1) return a1 < b1;
  if (a2 !== b2) return a2 < b2;

  return a3 < b3;
};
