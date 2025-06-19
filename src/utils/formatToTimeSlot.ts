import { ScheduleTime, TimeSlot } from '../types/Schedule.ts';

/**
 * API에서 받은 시간 데이터 배열(ScheduleTime[])을
 * 프론트엔드에서 사용하는 TimeSlot 객체 배열로 변환합니다.
 * 다양한 시간 형식("HHMM", "HH:MM", "오전/오후 H:MM")을 처리합니다.
 *
 * @param times - 변환할 ScheduleTime 객체 배열.
 * @returns 변환된 TimeSlot 객체 배열. 각 TimeSlot은 time(표시용)과 code(값)를 포함합니다.
 *          오류 발생 시 원본값을 최대한 유지합니다.
 */
export const mapTimesToTimeSlots = (times: ScheduleTime[] | null | undefined): TimeSlot[] => {
  if (!times) {
    return [];
  }
  return times.map((item) => {
    // 입력 item 또는 item.times가 유효하지 않은 경우 기본값 반환
    if (!item || item.times === null || item.times === undefined) {
      console.warn('Invalid item or times value in mapTimesToTimeSlots:', item);
      return { time: '', code: '' };
    }

    try {
      // times 값이 숫자인 경우 문자열로 변환
      const timeString = String(item.times);

      // 시간 형식이 "HHMM"인 경우 (예: "1330")
      if (/^\d{4}$/.test(timeString)) {
        const hours = parseInt(timeString.substring(0, 2), 10);
        const minutes = timeString.substring(2);
        // 유효한 시간인지 검사 (00:00 ~ 23:59)
        if (hours >= 0 && hours <= 23 && parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) <= 59) {
          const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}`; // 시간도 2자리로 포맷팅
          return {
            time: formattedTime,
            code: timeString
          };
        } else {
          console.warn('Invalid HHMM time format:', timeString);
          return { time: timeString, code: timeString }; // 유효하지 않으면 원본 반환
        }
      }
      // 시간 형식이 "HH:MM"인 경우 (예: "10:30")
      else if (/^\d{1,2}:\d{2}$/.test(timeString)) {
        const parts = timeString.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        // 유효한 시간인지 검사 (0:00 ~ 23:59)
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          return {
            time: formattedTime,
            code: formattedTime.replace(':', '') // HHMM 형식 코드로 변환
          };
        } else {
          console.warn('Invalid HH:MM time format:', timeString);
          return { time: timeString, code: timeString.replace(':', '') }; // 유효하지 않으면 원본 기반 반환
        }
      }
      // "오전/오후 H:MM" 형식인지 확인
      else {
        const koreanTimePattern = /(오전|오후)\s*(\d{1,2}):(\d{2})/;
        const match = timeString.match(koreanTimePattern);

        if (match) {
          const ampm = match[1];
          let hours = parseInt(match[2], 10);
          const minutes = parseInt(match[3], 10);

          // 유효한 시간/분인지 검사
          if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
            // 오후인 경우 12시간 더하기 (오후 12시 제외)
            if (ampm === '오후' && hours < 12) {
              hours += 12;
            }
            // 오전 12시는 00시로 변환
            if (ampm === '오전' && hours === 12) {
              hours = 0;
            }

            const timeCode = `${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}`;
            const timeValue = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

            return {
              time: timeValue,
              code: timeCode
            };
          } else {
            console.warn('Invalid Korean AM/PM time format:', timeString);
            return { time: timeString, code: timeString }; // 유효하지 않으면 원본 반환
          }
        } else {
          // 인식할 수 없는 다른 형식의 경우
          console.warn('Unrecognized time format:', timeString);
          return { time: timeString, code: timeString }; // 원본 반환
        }
      }
    } catch (error) {
      console.error('Error processing time slot:', item.times, error);
      // 오류 발생 시 원본 값 최대한 유지
      return {
        time: String(item.times),
        code: String(item.times)
      };
    }
  });
};
