import { ReservationDetailSchema } from '@/_domain/reservation';
import CalendarIcon from '@/assets/icons/CalendarIcon.svg?react';
import { Divider } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo } from 'react';

interface ReservationSummaryProps {
  reservation: ReservationDetailSchema;
}

const ReservationSummary = ({ reservation }: ReservationSummaryProps) => {
  // 계산 값들을 useMemo로 최적화
  const { isPrepaid, hasStatus, hasProgramName, hasRequest, isUpcoming, dDayText, formattedDate, formattedTime } =
    useMemo(() => {
      const date = dayjs(reservation.r_date);
      const hasStatus = !!reservation.r_status;
      const hasProgramName = !!reservation.s_name;
      const isPrepaid = hasProgramName && reservation.mp_gubun === 'F';
      const hasDuration = !!reservation.r_take_time;
      const hasRequest = !!reservation.r_memo;
      const today = dayjs().startOf('day'); // 오늘 날짜의 시작 (00:00:00)

      // 방문 예정일 경우 D-day 계산
      const isUpcoming = reservation.r_status_code === '001'; // 예약완료 상태
      const daysDiff = isUpcoming ? date.startOf('day').diff(today, 'day') : 0;

      // D-day 텍스트 계산
      const dDayText = daysDiff === 0 ? 'D-day' : daysDiff > 0 ? `D-${daysDiff}` : `D+${Math.abs(daysDiff)}`;

      // 날짜와 시간 포맷팅
      const formattedDate = date.isValid() ? date.format('YYYY년 MM월 DD일 (ddd)') : '날짜 정보 없음';

      const formattedTime = date.isValid() ? date.format('a hh:mm') : '시간 정보 없음';

      return {
        isPrepaid,
        hasStatus,
        hasProgramName,
        hasDuration,
        hasRequest,
        isUpcoming,
        dDayText,
        formattedDate,
        formattedTime
      };
    }, [reservation]);

  return (
    <div className="p-[20px] rounded-[20px] shadow-card bg-white">
      <div className="flex gap-[8px] items-center">
        <p className="text-[18px] font-b text-gray-700">
          {hasStatus ? reservation.r_status : '상태 정보 없음'}
          {isUpcoming && <span className="text-primary font-b text-[14px] ml-2">{dDayText}</span>}
        </p>
      </div>
      <div className="mt-3 flex items-center">
        <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
        <span className="font-r text-12px text-gray-500 ml-1.5">
          {formattedDate} | {formattedTime}
        </span>
      </div>

      <Divider className="my-[20px] border-gray-100" />

      <div>
        <p className="text-gray-500 font-sb text-[14px]">관리 프로그램</p>
        <p className={`font-r text-[14px] mt-[6px] ${!hasProgramName ? 'text-gray-500' : 'text-gray-700'}`}>
          {hasProgramName ? `${isPrepaid ? '(정액권) ' : ''}${reservation.s_name}` : '프로그램 정보가 없습니다'}
        </p>
      </div>

      {/* 소요시간 임시 주석 */}
      {/* <div className="mt-[16px]">
        <p className="text-gray-500 font-sb text-[14px]">소요시간</p>
        <p className={`font-r text-[14px] mt-[6px] ${!hasDuration ? 'text-gray-500' : 'text-gray-700'}`}>
          {hasDuration ? `${reservation.duration}분` : '소요시간 정보가 없습니다'}
        </p>
      </div> */}

      <div className="mt-[16px]">
        <p className="text-gray-500 font-sb text-[14px]">요청사항</p>
        <p className={`font-r text-[14px] mt-[6px] ${!hasRequest ? 'text-gray-500' : 'text-gray-700'}`}>
          {hasRequest ? reservation.r_memo : '요청사항이 없습니다'}
        </p>
      </div>
    </div>
  );
};

export default ReservationSummary;
