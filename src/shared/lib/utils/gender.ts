/**
 * 성별 코드 타입 ('M': 남성, 'F': 여성)
 */
export type Gender = 'M' | 'F';

/**
 * 성별 코드('M', 'F')를 해당하는 한글 레이블('남자', '여자')로 변환합니다.
 * @param gender - 변환할 성별 코드.
 * @returns 변환된 한글 레이블.
 */
export function getGenderDisplay(gender: Gender): string {
  return gender === 'M' ? '남자' : '여자';
}
