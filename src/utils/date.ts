import dayjs from "dayjs"
import "dayjs/locale/ko"

dayjs.locale("ko") // 전역 로케일 설정

/**
 * dayjs 라이브러리를 사용하여 날짜와 시간을 다양한 형식으로 포맷팅하는 유틸리티 함수 모음입니다.
 * 모든 함수는 한국어(ko) 로케일을 기본으로 사용합니다.
 */

/**
 * 날짜를 지정된 패턴으로 포맷팅합니다.
 * @param date - 포맷팅할 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @param pattern - dayjs 포맷 패턴 문자열 (기본값: "YYYY.MM.DD").
 * @returns 포맷팅된 날짜 문자열. 입력이 유효하지 않으면 빈 문자열 반환.
 */
export const formatDate = (
  date: Date | string | null | undefined,
  pattern: string = "YYYY.MM.DD",
): string => {
  if (!date || !dayjs(date).isValid()) return ""
  try {
    return dayjs(date).format(pattern)
  } catch (error) {
    console.error("Error formatting date:", date, error)
    return ""
  }
}

/**
 * 날짜와 시간을 "YYYY.MM.DD a hh:mm" 형식으로 포맷팅합니다. (예: "2024.01.01 오후 01:00")
 * @param date - 포맷팅할 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @returns 포맷팅된 날짜와 시간 문자열. 입력이 유효하지 않으면 빈 문자열 반환.
 */
export const formatDateTime = (
  date: Date | string | null | undefined,
): string => {
  return formatDate(date, "YYYY.MM.DD a hh:mm")
}

/**
 * 시간 문자열("HH:mm")을 "a hh:mm" 형식으로 포맷팅합니다. (예: "오후 01:00")
 * @param time - 포맷팅할 시간 문자열 (형식: "HH:mm").
 * @returns 포맷팅된 시간 문자열. 입력 형식이 잘못된 경우 빈 문자열 반환.
 */
export const formatTime = (time: string | null | undefined): string => {
  if (!time) {
    return ""
  }
  // dayjs는 "HH:mm" 형식 파싱을 지원
  const parsedTime = dayjs(time, "HH:mm")
  if (!parsedTime.isValid()) {
    console.warn("Invalid time format for formatTime:", time)
    return ""
  }

  try {
    return parsedTime.format("a hh:mm")
  } catch (error) {
    console.error("Error formatting time:", time, error)
    return ""
  }
}

/**
 * Date 객체를 API 요청에 적합한 "YYYY-MM-DD" 형식의 문자열로 변환합니다.
 * @param date - 변환할 Date 객체 또는 null.
 * @returns "YYYY-MM-DD" 형식의 날짜 문자열. 입력이 null이거나 유효하지 않으면 빈 문자열 반환.
 */
export const formatDateForAPI = (date: Date | null | undefined): string => {
  if (!date || !dayjs(date).isValid()) return ""
  try {
    return dayjs(date).format("YYYY-MM-DD")
  } catch (error) {
    console.error("Error formatting date for API:", date, error)
    return ""
  }
}

/**
 * 날짜를 "YYYY년 MM월 DD일 (ddd)" 형식으로 포맷팅합니다. (예: "2024년 1월 1일 (월)")
 * @param date - 포맷팅할 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @returns 요일이 포함된 포맷팅된 날짜 문자열. 입력이 유효하지 않으면 빈 문자열 반환.
 */
export const formatDateWithDay = (
  date: Date | string | null | undefined,
): string => {
  return formatDate(date, "YYYY년 MM월 DD일 (ddd)")
}

/**
 * 시작 날짜와 종료 날짜를 "YYYY.MM.DD - YYYY.MM.DD" 형식의 문자열로 포맷팅합니다.
 * 한쪽 날짜라도 유효하지 않으면 "-"를 반환합니다.
 * @param startDate - 시작 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @param endDate - 종료 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @returns 포맷팅된 날짜 범위 문자열 또는 "-".
 */
export const formatDateRange = (
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
): string => {
  const start = formatDate(startDate)
  const end = formatDate(endDate)

  if (!start || !end) return "-"
  return `${start} - ${end}`
}

/**
 * 현재 시간이 주어진 예약 시간과 지속 시간 내에 포함되는지 확인합니다.
 * dayjs를 사용하여 시간 비교 로직을 구현합니다.
 * @param reservationDate - 예약 시작 시간 (Date 객체 또는 ISO 문자열).
 * @param duration - 예약 지속 시간 (분 단위).
 * @returns 현재 시간이 예약 시간 내에 있으면 true, 아니면 false.
 */
export const isVisitTime = (
  reservationDate: Date | string | null | undefined,
  duration: number | null | undefined,
): boolean => {
  if (
    !reservationDate ||
    !dayjs(reservationDate).isValid() ||
    duration === null ||
    duration === undefined ||
    duration < 0
  ) {
    console.warn("Invalid input for isVisitTime:", reservationDate, duration)
    return false
  }

  try {
    const now = dayjs()
    const startTime = dayjs(reservationDate)
    const endTime = startTime.add(duration, "minute")

    // isSameOrAfter, isSameOrBefore 플러그인 사용 가능 여부 확인 필요
    // 기본 dayjs 객체로 비교
    return now.isAfter(startTime) && now.isBefore(endTime)
  } catch (error) {
    console.error("Error in isVisitTime calculation:", error)
    return false
  }
}
