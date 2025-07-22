import { ScheduleDateScheme, TimeSlot } from '@/_domain/reservation';
import dayjs, { Dayjs } from 'dayjs';

export const formatReservationDate = (date: Dayjs | null | string, timeSlot: TimeSlot | null) => {
  if (!date || !timeSlot?.time) return '';

  const dayjsDate = dayjs(date);
  const dateStr = dayjsDate.format('YYYY.MM.DD');
  const time = timeSlot.time;

  // "HH:mm" 형식일 때만 dayjs로 파싱
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    const [hour, minute] = time.split(':').map((v) => parseInt(v, 10));
    // date 객체에 시간 분 세팅
    const dt = dayjsDate.hour(hour).minute(minute);
    // 한국어 AM/PM 포함하여 포맷
    return dt.locale('ko').format('YYYY.MM.DD A h:mm');
  }

  return `${dateStr} ${time}`;
};

/**
 * 주어진 times 배열을 파싱 가능한 포맷으로 변환하여
 * { time: "HH:mm", code: "HHmm" } 구조로 매핑합니다.
 * 파싱에 실패하면 원본 문자열 그대로 반환합니다.
 */
export const formatSchedule = (times?: ScheduleDateScheme[] | null): TimeSlot[] => {
  if (!times) return [];

  const parseFormats = ['HHmm', 'HH:mm', 'A h:mm'];

  return times.map(({ dates: raw }) => {
    const dt = dayjs(raw, parseFormats, true);
    if (dt.isValid()) {
      return {
        time: dt.format('HH:mm'),
        code: dt.format('HHmm')
      };
    } else {
      return {
        time: raw,
        code: raw
      };
    }
  });
};

/**
 * "HHmm" 형태의 시간 문자열을 한국어 AM/PM 표시 "오전/오후 h:mm" 형태로 변환합니다.
 *  - "0000" → "오전 12:00"
 *  - "0905" → "오전 9:05"
 *  - "1200" → "오후 12:00"
 *  - "1900" → "오후 7:00"
 *
 * @param time HHmm 포맷 문자열 (예: "1330", "0905")
 * @returns 한국어 AM/PM 표시 시간 (예: "오후 1:30", "오전 9:05")
 */
export const formatScheduleTime = (time: string): string => {
  const dt = dayjs(time, 'HHmm', true);
  return dt.isValid() ? dt.format('A h:mm') : time;
};

/**
 * 한국어 AM/PM 표시 "오전/오후 h:mm" 형태의 문자열을 "HH:mm" 포맷으로 되돌립니다.
 *  - "오전 12:00" → "00:00"
 *  - "오전 9:05"  → "09:05"
 *  - "오후 12:00" → "12:00"
 *  - "오후 7:30"  → "19:30"
 *
 * @param displayTime 한국어 AM/PM 표시 시간 (예: "오후 1:30", "오전 9:05")
 * @returns HHmm 포맷 문자열 (예: "13:30", "09:05"). 포맷이 맞지 않으면 입력값 그대로 반환합니다.
 */
export const parseScheduleTime = (displayTime: string): string => {
  const match = displayTime.match(/^(오전|오후)\s*(\d{1,2}):(\d{2})$/);
  if (!match) return displayTime;

  const [, ampm, h, m] = match;
  let hour = parseInt(h, 10);
  const minute = parseInt(m, 10);

  if (ampm === '오전' && hour === 12) hour = 0;
  else if (ampm === '오후' && hour < 12) hour += 12;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};
