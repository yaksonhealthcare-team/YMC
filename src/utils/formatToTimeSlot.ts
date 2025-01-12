import { ScheduleTime, TimeSlot } from "../types/Schedule.ts"

export const mapTimesToTimeSlots = (times: ScheduleTime[]): TimeSlot[] => {
  return times.map((item) => {
    const code = item.times
    const hours = parseInt(code.substring(0, 2), 10)
    const minutes = code.substring(2)
    const isAM = hours < 12
    const time = `${isAM ? "오전" : "오후"} ${
      isAM ? hours : hours % 12 || 12
    }:${minutes}`
    return { time, code }
  })
}
