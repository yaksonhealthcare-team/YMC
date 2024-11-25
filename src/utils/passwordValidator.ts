/**
 * 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상
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
