/**
 * 시간을 '오전/오후 H:MM' 형식으로 변환합니다.
 * 예) 11:00 -> 오전 11:00, 14:30 -> 오후 2:30
 * @param date - Date 객체 또는 ISO 8601 형식의 날짜 문자열
 * @returns 포맷된 시간 문자열 (예: "오전 11:00"). 유효하지 않은 날짜인 경우 빈 문자열 반환.
 *
 * @example
 * ```typescript
 * formatTime(new Date('2024-07-19 11:00'))  // '오전 11:00'
 * formatTime(new Date('2024-07-19 14:30'))  // '오후 2:30'
 * formatTime('2024-07-19T11:00:00')         // '오전 11:00'
 * formatTime(new Date('Invalid'))           // ''
 * ```
 */
const formatTime = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided to formatTime:', date);
      return '';
    }

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours < 12 ? '오전' : '오후';
    const hour12 = hours % 12 || 12;

    return `${ampm} ${hour12}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
};

export default formatTime;
