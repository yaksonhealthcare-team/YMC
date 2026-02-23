import { MyMembership } from '@/entities/membership/model/Membership';
import { Radio } from '@mui/material';
import clsx from 'clsx';

interface MembershipRadioCardProps {
  membership: MyMembership;
  checked: boolean;
  value: string;
}

export const MembershipRadioCard = ({ membership, checked, value }: MembershipRadioCardProps) => {
  const formatDateWithDots = (date: string) => {
    return date.split(' ')[0].replace(/-/g, '.');
  };

  // 지점 회원권인 경우 지점명을 표시하는 로직 추가
  const displayType = () => {
    if (membership.s_type === '지점 회원권' && membership.branchs && membership.branchs.length === 1) {
      // 지점이 하나만 있는 경우 해당 지점명 표시
      return `${membership.branchs[0].b_name}`;
    }
    return membership.s_type;
  };

  return (
    <label
      className={clsx(
        'w-full p-5 bg-white rounded-xl border justify-between inline-flex cursor-pointer',
        checked ? 'border-primary' : 'border-gray-100'
      )}
    >
      <div className="flex-1">
        <div className="flex-col justify-start items-start gap-4">
          <div className="self-stretch flex-col justify-start items-start gap-3">
            <div className="px-[6px] py-[2px] bg-gray-100 rounded-[4px] justify-center items-center inline-flex mb-3">
              <div className="text-center text-gray-500 text-12px font-m">{displayType()}</div>
            </div>
            <div className="self-stretch flex-col justify-start items-start gap-2">
              <h3 className="text-gray-700 text-16px font-sb">{membership.service_name || '회원권명'}</h3>

              <div className="flex items-center gap-[6px] mt-[8px]">
                <span className="text-gray-600 text-12px">
                  {`${membership.remain_amount}회 / ${membership.buy_amount}회`}
                </span>
                <div className="w-[2px] h-[12px] bg-gray-200" />
                <span className="text-gray-600 text-12px">
                  {`${formatDateWithDots(membership.pay_date)} - ${formatDateWithDots(membership.expiration_date)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full">
        <Radio
          checked={checked}
          value={value}
          sx={{
            opacity: 0,
            position: 'absolute',
            width: '20px',
            height: '20px'
          }}
        />
        <div className={clsx('w-5 h-5 relative')}>
          {checked ? (
            <>
              <div className="w-5 h-5 left-0 top-0 absolute bg-primary rounded-full" />
              <div className="w-2 h-2 left-[6px] top-[6px] absolute bg-white rounded-full" />
            </>
          ) : (
            <div className="w-5 h-5 left-0 top-0 absolute rounded-full border-2 border-gray-200" />
          )}
        </div>
      </div>
    </label>
  );
};
