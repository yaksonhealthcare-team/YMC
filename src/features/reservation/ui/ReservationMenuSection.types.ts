import { UserMembershipSchema } from '@/entities/membership/model/membership.types';

export interface ReservationMenuSectionProps {
  memberships: UserMembershipSchema[];
  consultCount: ReservationConsultCount;
}
export interface ReservationConsultCount {
  currentCount: number;
  maxCount: number;
}
