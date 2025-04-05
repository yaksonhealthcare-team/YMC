import { ScheduleTime, TimeSlot } from "../types/Schedule.ts"

export const mapTimesToTimeSlots = (times: ScheduleTime[]): TimeSlot[] => {
  console.log("원본 시간 데이터:", times)

  return times.map((item) => {
    try {
      const timeString = item.times
      console.log("시간 문자열:", timeString)

      // 시간 형식이 "HHMM"인 경우 (예: "1330")
      if (/^\d{4}$/.test(timeString)) {
        const hours = parseInt(timeString.substring(0, 2), 10)
        const minutes = timeString.substring(2)
        const formattedTime = `${hours}:${minutes}`
        console.log("파싱된 시간:", formattedTime)

        return {
          time: formattedTime,
          code: timeString,
        }
      }
      // 시간 형식이 "HH:MM"인 경우 (예: "10:30")
      else if (/^\d{2}:\d{2}$/.test(timeString)) {
        return {
          time: timeString,
          code: timeString.replace(":", ""),
        }
      }
      // 다른 형식의 경우 그대로 반환하되 로그 남김
      else {
        console.warn("알 수 없는 시간 형식:", timeString)

        // "오전 9:30"같은 형식인지 확인
        const koreanTimePattern = /(오전|오후)\s+(\d{1,2}):(\d{2})/
        const match = timeString.match(koreanTimePattern)

        if (match) {
          const ampm = match[1]
          let hours = parseInt(match[2], 10)
          const minutes = match[3]

          // 오후인 경우 12시간 더하기 (오후 12시 제외)
          if (ampm === "오후" && hours < 12) {
            hours += 12
          }
          // 오전 12시는 00시로 변환
          if (ampm === "오전" && hours === 12) {
            hours = 0
          }

          const timeCode = `${hours.toString().padStart(2, "0")}${minutes}`
          const timeValue = `${hours}:${minutes}`

          return {
            time: timeValue,
            code: timeCode,
          }
        }

        return {
          time: timeString,
          code: timeString,
        }
      }
    } catch (error) {
      console.error("시간 파싱 오류:", error, item)
      // 오류 발생 시 원본 값 그대로 반환
      return {
        time: String(item.times),
        code: String(item.times),
      }
    }
  })
}
