/**
 * 주어진 텍스트를 클립보드에 복사합니다.
 * @param text - 복사할 텍스트
 * @returns 복사 성공 여부 (true: 성공, false: 실패)
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    return false
  }
}
