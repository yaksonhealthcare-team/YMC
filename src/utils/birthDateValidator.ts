export const validateBirthDate = (birthDate: string): { isValid: boolean; errorMessage: string } => {
  // 8자리 숫자만 허용
  if (!/^\d{0,8}$/.test(birthDate)) {
    return { isValid: false, errorMessage: "숫자만 입력해주세요" }
  }

  // 완성된 생년월일인 경우 (8자리)
  if (birthDate.length === 8) {
    const year = parseInt(birthDate.substring(0, 4))
    const month = parseInt(birthDate.substring(4, 6))
    const day = parseInt(birthDate.substring(6, 8))

    const currentYear = new Date().getFullYear()

    // 연도 검증 (1900년 이후, 현재 연도 이전)
    if (year < 1900 || year > currentYear) {
      return { isValid: false, errorMessage: "올바른 연도를 입력해주세요" }
    }

    // 월 검증 (1-12)
    if (month < 1 || month > 12) {
      return { isValid: false, errorMessage: "올바른 월을 입력해주세요" }
    }

    // 일 검증 (1-31, 월별 일수 고려)
    const lastDay = new Date(year, month, 0).getDate()
    if (day < 1 || day > lastDay) {
      return { isValid: false, errorMessage: "올바른 일을 입력해주세요" }
    }

    return { isValid: true, errorMessage: "" }
  }

  return { isValid: true, errorMessage: "" }
} 