import { format } from "date-fns"
import { ko } from "date-fns/locale"

/**
 * date-fns 라이브러리를 사용하여 날짜와 시간을 다양한 형식으로 포맷팅하는 유틸리티 함수 모음입니다.
 * 모든 함수는 한국어(ko) 로케일을 기본으로 사용합니다.
 */

/**
 * 날짜를 지정된 패턴으로 포맷팅합니다.
 * @param date - 포맷팅할 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @param pattern - date-fns 포맷 패턴 문자열 (기본값: "yyyy.MM.dd").
 * @returns 포맷팅된 날짜 문자열. 입력이 유효하지 않으면 빈 문자열 반환.
 */
export const formatDate = (
  date: Date | string | null | undefined,
  pattern: string = "yyyy.MM.dd",
): string => {
  if (!date) return ""
  try {
    return format(new Date(date), pattern, { locale: ko })
  } catch (error) {
    console.error("Error formatting date:", date, error)
    return ""
  }
}

/**
 * 날짜와 시간을 "yyyy.MM.dd a hh:mm" 형식으로 포맷팅합니다. (예: "2024.01.01 오후 01:00")
 * @param date - 포맷팅할 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @returns 포맷팅된 날짜와 시간 문자열. 입력이 유효하지 않으면 빈 문자열 반환.
 */
export const formatDateTime = (
  date: Date | string | null | undefined,
): string => {
  return formatDate(date, "yyyy.MM.dd a hh:mm")
}

/**
 * 시간 문자열("HH:mm")을 "a hh:mm" 형식으로 포맷팅합니다. (예: "오후 01:00")
 * @param time - 포맷팅할 시간 문자열 (형식: "HH:mm").
 * @returns 포맷팅된 시간 문자열. 입력 형식이 잘못된 경우 유효하지 않은 값이 반환될 수 있음.
 */
export const formatTime = (time: string | null | undefined): string => {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    console.warn("Invalid time format for formatTime:", time)
    return ""
  }
  try {
    // 임시 날짜를 사용하여 시간 포맷팅
    return format(new Date(`2000-01-01T${time}:00`), "a hh:mm", { locale: ko })
  } catch (error) {
    console.error("Error formatting time:", time, error)
    return ""
  }
}

/**
 * Date 객체를 API 요청에 적합한 "yyyy-MM-dd" 형식의 문자열로 변환합니다.
 * @param date - 변환할 Date 객체 또는 null.
 * @returns "yyyy-MM-dd" 형식의 날짜 문자열. 입력이 null이면 빈 문자열 반환.
 */
export const formatDateForAPI = (date: Date | null | undefined): string => {
  if (!date) return ""
  try {
    return format(date, "yyyy-MM-dd")
  } catch (error) {
    console.error("Error formatting date for API:", date, error)
    return ""
  }
}

/**
 * 날짜를 "yyyy년 MM월 dd일 (E)" 형식으로 포맷팅합니다. (예: "2024년 1월 1일 (월)")
 * @param date - 포맷팅할 날짜 (Date 객체, ISO 문자열, 또는 null).
 * @returns 요일이 포함된 포맷팅된 날짜 문자열. 입력이 유효하지 않으면 빈 문자열 반환.
 */
export const formatDateWithDay = (
  date: Date | string | null | undefined,
): string => {
  return formatDate(date, "yyyy년 MM월 dd일 (E)")
}

/**
 * 시작 날짜와 종료 날짜를 "yyyy.MM.dd - yyyy.MM.dd" 형식의 문자열로 포맷팅합니다.
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
 * @param reservationDate - 예약 시작 시간 (Date 객체).
 * @param duration - 예약 지속 시간 (분 단위).
 * @returns 현재 시간이 예약 시간 내에 있으면 true, 아니면 false.
 */
export const isVisitTime = (
  reservationDate: Date | null | undefined,
  duration: number | null | undefined,
): boolean => {
  if (
    !reservationDate ||
    duration === null ||
    duration === undefined ||
    duration < 0
  ) {
    console.warn("Invalid input for isVisitTime:", reservationDate, duration)
    return false
  }

  try {
    const now = new Date()
    const startTime = new Date(reservationDate)
    // 종료 시간 계산 시 밀리초 단위로 변환
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000)

    return now >= startTime && now <= endTime
  } catch (error) {
    console.error("Error in isVisitTime calculation:", error)
    return false
  }
}
