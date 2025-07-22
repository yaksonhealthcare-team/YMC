import { ReservationFormValues, TimeSlot } from '@/_domain/reservation';
import { CalendarProps } from '@/_shared';
import { Dayjs } from 'dayjs';

export interface DateBottomSheetProps extends CalendarProps {
  onClose: () => void;
  onSelect: (date: Dayjs, time: TimeSlot) => void;
  values: ReservationFormValues;
}
