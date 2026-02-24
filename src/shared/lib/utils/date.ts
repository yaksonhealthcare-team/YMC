import dayjs from 'dayjs';
import 'dayjs/locale/ko';

/**
 * dayjs 라이브러리를 사용하여 날짜와 시간을 다양한 형식으로 포맷팅하는 유틸리티 함수 모음입니다.
 * 모든 함수는 한국어(ko) 로케일을 기본으로 사용합니다.
 */

/**
 * 날짜를 지정된 패턴으로 포맷팅합니다.
 * @param date - 포맷팅할 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @param pattern - dayjs 포맷 패턴 문자열 (기본값: "YYYY.MM.DD").
 * @returns 포맷팅된 날짜 문자열. 입력이 유효하지 않으면 빈 문자열 반환.
 */
export const formatDate = (date: Date | string | null | undefined, pattern: string = 'YYYY.MM.DD'): string => {
  if (!date || !dayjs(date).isValid()) return '';
  try {
    return dayjs(date).format(pattern);
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return '';
  }
};

/**
 * 날짜를 "YYYY년 MM월 DD일 (ddd)" 형식으로 포맷팅합니다. (예: "2024년 1월 1일 (월)")
 * @param date - 포맷팅할 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @returns 요일이 포함된 포맷팅된 날짜 문자열. 입력이 유효하지 않으면 빈 문자열 반환.
 */
export const formatDateWithDay = (date: Date | string | null | undefined): string => {
  return formatDate(date, 'YYYY년 MM월 DD일 (ddd)');
};

export const getFormattedTimestamp = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
  const dd = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return `${yyyy}${MM}${dd}_${HH}${mm}${ss}`;
};
