const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const TODAY_STATUS = 'Day';

/**
 * 주어진 날짜와 현재 날짜 사이의 D-Day를 계산합니다.
 * 시간은 무시하고 날짜만 비교하여 계산됩니다.
 *
 * @param date - 목표 날짜 (Date 객체)
 * @returns 현재 날짜부터 목표 날짜까지 남은 일수 또는 상태 문자열.
 *          - 양수: 미래 날짜까지 남은 일수 (예: 3)
 *          - "Day": 당일
 *          - 음수: 이미 지난 일수 (예: -3)
 *
 * @example
 * ```typescript
 * const futureDate = new Date();
 * futureDate.setDate(futureDate.getDate() + 3);
 * calculateDday(futureDate); // 3
 *
 * const pastDate = new Date();
 * pastDate.setDate(pastDate.getDate() - 3);
 * calculateDday(pastDate); // -3
 *
 * calculateDday(new Date()); // "Day"
 * ```
 */
const calculateDday = (date: Date): number | string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('Invalid date provided to calculateDday:', date);
    return NaN; // 유효하지 않은 날짜는 NaN 반환 (또는 다른 에러 처리)
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // 오늘 날짜의 시작 시간으로 설정

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0); // 목표 날짜의 시작 시간으로 설정

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / MILLISECONDS_PER_DAY);

  if (diffDays === 0) return TODAY_STATUS;
  // 지난 날짜는 음수로, 미래 날짜는 양수로 반환
  return diffDays;
};

export default calculateDday;
