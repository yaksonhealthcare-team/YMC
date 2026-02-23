import clsx from 'clsx';
import { MembershipStatusType } from '@/entities/membership/model/membership.types';
import { MembershipChipProps } from './MembershipChip.types';

export const MembershipChip = ({ type, value, status }: MembershipChipProps) => {
  const style = type === 'branch' ? getBranchChipStyle() : getStatusChipStyle(status);

  return (
    <div className={clsx('flex items-center justify-center px-1.5 py-0.5 rounded', style.wrap)}>
      <p className={clsx('font-m text-xs', style.text)}>{value}</p>
    </div>
  );
};

/**
 * 지점 스타일
 */
const getBranchChipStyle = () => {
  return {
    text: 'text-gray-500',
    wrap: 'bg-gray-100'
  };
};

/**
 * 사용 상태 스타일
 */
const getStatusChipStyle = (status?: MembershipStatusType) => {
  switch (status) {
    case 'T': // 사용가능
      return { text: 'text-primary', wrap: 'bg-tag-redBg' };
    case 'F': // 사용완료
      return { text: 'text-gray-400', wrap: 'bg-gray-100' };
    case 'E': // 만료됨
      return { text: 'text-gray-400', wrap: 'bg-gray-100' };
    default: {
      return { text: 'text-primary', wrap: 'bg-tag-redBg' };
    }
  }
};
