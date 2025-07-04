import { RadioButtonProps } from '@/_shared/components';

export interface ReservationMembershipCardProps {
  data: ReservationMembershipCardItem;
  checked?: RadioButtonProps['checked'];
  onChange?: RadioButtonProps['onChange'];
}

export interface ReservationMembershipCardItem {
  id: string;
  branchName: string;
  serviceName: string;
  startDate: string;
  expireDate: string;
  remainAmount: string;
  totalAmount: string;
  type?: 'pre-paid' | 'standard';
}
