import { TimeSlot } from '@/_domain/reservation';

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
