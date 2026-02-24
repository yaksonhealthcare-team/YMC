import CalendarIcon from '@/assets/icons/CalendarIcon.svg?react';
import formatDate from '@/shared/lib/utils/formatDate';
import formatTime from '@/shared/lib/utils/formatTime';

interface DateAndTimeProps {
  date: Date;
  className?: string;
}

const DateAndTime = ({ date, className }: DateAndTimeProps) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      <CalendarIcon className="w-3.5 h-3.5 text-gray-300" />
      <span className="font-r text-12px text-gray-500 ml-1.5">
        {formatDate(date)} | {formatTime(date)}
      </span>
    </div>
  );
};

export default DateAndTime;
