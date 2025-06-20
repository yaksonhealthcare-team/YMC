/**
 * 이메일 주소 형식이 유효한지 검사합니다.
 * @param email - 검사할 이메일 주소 문자열
 * @returns 유효성 검사 결과 (true: 유효함, false: 유효하지 않음)
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export default validateEmail;
