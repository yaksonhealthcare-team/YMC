/**
 * 비밀번호 유효성을 검사합니다.
 * 조건: 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상이어야 합니다.
 * @param password - 검사할 비밀번호 문자열
 * @returns 유효성 검사 결과 (true: 유효함, false: 유효하지 않음)
 */
const validatePassword = (password: string): boolean => {
  if (password.length < 10) return false

  const containsLetter = /[a-zA-Z]/.test(password)
  const containsNumber = /[0-9]/.test(password)
  const containsSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const typeCount = [containsLetter, containsNumber, containsSpecial].filter(
    Boolean,
  ).length

  return typeCount >= 2
}

export default validatePassword
