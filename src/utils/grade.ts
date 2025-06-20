/**
 * 등급 코드(H, M, L)를 해당하는 한글 레이블로 변환합니다.
 * @param grade - 변환할 등급 코드 ('H', 'M', 'L')
 * @returns 변환된 한글 레이블 ('만족', '보통', '불만족'). 유효하지 않은 코드의 경우 빈 문자열 반환.
 */
export const getGradeLabel = (grade: string): string => {
  switch (grade) {
    case 'H':
      return '만족';
    case 'M':
      return '보통';
    case 'L':
      return '불만족';
    default:
      console.warn(`Invalid grade code: ${grade}`);
      return '';
  }
};
