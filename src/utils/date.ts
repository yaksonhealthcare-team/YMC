import { format } from "date-fns"
import { ko } from "date-fns/locale"

/**
 * 날짜 포맷팅 유틸리티 함수들
 */

/**
 * 날짜를 기본 형식으로 포맷팅 (2024-01-01 -> 2024.01.01)
 */
export const formatDate = (
  date: Date | string | null,
  pattern: string = "yyyy.MM.dd",
): string => {
  if (!date) return ""
  return format(new Date(date), pattern, { locale: ko })
}

/**
 * 날짜와 시간을 포맷팅 (2024-01-01 13:00 -> 2024.01.01 오후 01:00)
 */
export const formatDateTime = (date: Date | string | null): string => {
  if (!date) return ""
  return format(new Date(date), "yyyy.MM.dd a hh:mm", { locale: ko })
}

/**
 * 시간만 포맷팅 (13:00 -> 오후 01:00)
 */
export const formatTime = (time: string): string => {
  return format(new Date(`2000-01-01 ${time}`), "a hh:mm", { locale: ko })
}

/**
 * API 요청용 날짜 포맷 (2024.01.01 -> 2024-01-01)
 */
export const formatDateForAPI = (date: Date | null): string => {
  if (!date) return ""
  return format(date, "yyyy-MM-dd")
}

/**
 * 요일 포함 날짜 포맷팅 (2024-01-01 -> 2024년 1월 1일 (월))
 */
export const formatDateWithDay = (date: Date | string | null): string => {
  if (!date) return ""
  return format(new Date(date), "yyyy년 MM월 dd일 (E)", { locale: ko })
}

export const formatDateRange = (
  startDate: string | Date | null,
  endDate: string | Date | null,
) => {
  const start = formatDate(startDate)
  const end = formatDate(endDate)

  if (start === "-" || end === "-") return "-"
  return `${start} - ${end}`
}

export const isVisitTime = (
  reservationDate: Date,
  duration: number,
): boolean => {
  const now = new Date()
  const startTime = new Date(reservationDate)
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000)

  return now >= startTime && now <= endTime
}
