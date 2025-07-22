import { UserMembershipSchema } from '@/_domain/membership';

export interface ReservationMenuSectionProps {
  memberships: UserMembershipSchema[];
  consultCount: ReservationConsultCount;
}
export interface ReservationConsultCount {
  currentCount: number;
  maxCount: number;
}
