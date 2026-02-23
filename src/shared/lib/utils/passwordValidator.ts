/**
 * 비밀번호 유효성을 검사합니다.
 * 조건: 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상이어야 합니다.
 * @param password - 검사할 비밀번호 문자열
 * @returns 유효성 검사 결과 (true: 유효함, false: 유효하지 않음)
 */
const validatePassword = (password: string): boolean => {
  // 길이 검사: 10자 이상 20자 이하
  if (password.length < 10 || password.length > 20) return false;

  // 필수 포함 요소 검사
  const containsUppercase = /[A-Z]/.test(password);
  const containsLowercase = /[a-z]/.test(password);
  const containsNumber = /[0-9]/.test(password);
  const containsSpecial = /[@$!%*?&#]/.test(password); // 지정된 특수문자만 허용

  // 모든 조건 만족 여부 반환
  return containsUppercase && containsLowercase && containsNumber && containsSpecial;
};

export default validatePassword;
