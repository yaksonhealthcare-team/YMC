import { TimeSlot } from '@/entities/schedule/model/schedule.types';
import { ReservationFormValues } from '@/entities/reservation/model/reservation.types';
import { DateCalendarProps } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

export interface DateBottomSheetProps extends DateCalendarProps<Dayjs> {
  onClose: () => void;
  onSelect: (date: Dayjs, time: TimeSlot) => void;
  values: ReservationFormValues;
}
