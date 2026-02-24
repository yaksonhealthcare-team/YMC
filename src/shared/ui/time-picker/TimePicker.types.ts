import { TimeSlot } from '@/entities/schedule/model/schedule.types';

export interface TimePickerProps {
  times: string[];
  selectedTime: TimeSlot | null;
  isLoading?: boolean;
  onClick: (time: string) => void;
}

export interface TimeButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelected?: boolean;
}
