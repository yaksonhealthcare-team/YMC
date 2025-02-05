import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import "dayjs/locale/ko"

dayjs.extend(customParseFormat)
dayjs.locale("ko")

export const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "-"

  const d = dayjs(date)
  if (!d.isValid()) return "-"

  return d.format("YYYY.MM.DD")
}

export const formatDateRange = (
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
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
