import { ReservationFormValues, TimeSlot } from '@/_domain/reservation';
import { DateCalendarProps } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

export interface DateBottomSheetProps extends DateCalendarProps<Dayjs> {
  onClose: () => void;
  onSelect: (date: Dayjs, time: TimeSlot) => void;
  values: ReservationFormValues;
}
