/**
 * 생년월일 문자열(YYYYMMDD)의 유효성을 검사합니다.
 * @param birthDate - 검사할 생년월일 문자열 (8자리 숫자).
 * @returns 유효성 검사 결과 객체.
 *          - isValid: boolean - 유효 여부.
 *          - errorMessage: string - 유효하지 않은 경우 오류 메시지, 유효하면 빈 문자열.
 */
export const validateBirthDate = (
  birthDate: string,
): { isValid: boolean; errorMessage: string } => {
  // 입력값 null 또는 undefined 검사
  if (birthDate === null || birthDate === undefined) {
    return { isValid: false, errorMessage: "생년월일을 입력해주세요" }
  }

  // 8자리 숫자만 허용 (중간 입력 상태는 허용)
  if (!/^\d{0,8}$/.test(birthDate)) {
    return { isValid: false, errorMessage: "숫자 8자리로 입력해주세요" }
  }

  // 8자리가 아니면 중간 입력 상태로 간주하고 유효 처리 (오류 메시지 없음)
  if (birthDate.length !== 8) {
    return { isValid: true, errorMessage: "" }
  }

  // 8자리인 경우 상세 유효성 검사
  const year = parseInt(birthDate.substring(0, 4), 10)
  const month = parseInt(birthDate.substring(4, 6), 10)
  const day = parseInt(birthDate.substring(6, 8), 10)

  const currentYear = new Date().getFullYear()

  // 연도 검증 (1900년 이후, 현재 연도 이하)
  if (year < 1900 || year > currentYear) {
    return {
      isValid: false,
      errorMessage: "유효한 연도를 입력해주세요 (1900 ~ 현재)",
    }
  }

  // 월 검증 (1-12)
  if (month < 1 || month > 12) {
    return {
      isValid: false,
      errorMessage: "유효한 월을 입력해주세요 (01 ~ 12)",
    }
  }

  // 일 검증 (1-31, 해당 월의 마지막 날짜 고려)
  const lastDayOfMonth = new Date(year, month, 0).getDate()
  if (day < 1 || day > lastDayOfMonth) {
    return {
      isValid: false,
      errorMessage: `유효한 일을 입력해주세요 (01 ~ ${lastDayOfMonth})`,
    }
  }

  // 모든 검증 통과
  return { isValid: true, errorMessage: "" }
}
