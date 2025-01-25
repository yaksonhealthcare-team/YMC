import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import "dayjs/locale/ko"

dayjs.extend(customParseFormat)
dayjs.locale("ko")

export const formatDate = (date: string) => {
  return dayjs(date, "YYYY-MM-DD HH:mm").format("YYYY년 M월 D일 (ddd)")
}
