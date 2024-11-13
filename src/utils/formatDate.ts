/**
 * 날짜를 'M월 D일 (요일)' 형식으로 변환합니다.
 * 예) 2024-07-19 -> 7월 19일 (금)
 *
 * @param date - Date 객체 또는 ISO 8601 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열. 유효하지 않은 날짜인 경우 빈 문자열 반환
 *
 * @example
 * ```typescript
 * formatDate(new Date('2024-07-19'))  // '7월 19일 (금)'
 * formatDate('2024-07-19')            // '7월 19일 (금)'
 * formatDate(new Date('Invalid'))     // ''
 * ```
 */
const formatDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      return ""
    }

    const DAYS = ["일", "월", "화", "수", "목", "금", "토"]
    const month = dateObj.getMonth() + 1 // getMonth()는 0부터 시작
    const day = dateObj.getDate()
    const dayOfWeek = DAYS[dateObj.getDay()]

    return `${month}월 ${day}일 (${dayOfWeek})`
  } catch (error) {
    console.error("Date formatting error:", error)
    return ""
  }
}

export default formatDate
