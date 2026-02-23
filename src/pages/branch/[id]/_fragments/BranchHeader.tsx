import PinIcon from '@/assets/icons/PinIcon.svg?react';
import ShareIcon from '@/assets/icons/ShareIcon.svg?react';
import StoreIcon from '@/assets/icons/StoreIcon.svg?react';
import ProfileCard from '@/components/ProfileCard';
import DynamicHomeHeaderBackground from '@/pages/home/_fragments/DynamicHomeHeaderBackground';
import { BranchDetail as BranchDetailType } from '@/entities/branch/model/Branch';
import { memo, ReactNode } from 'react';
import StaffSection from './StaffSection';

interface BranchHeaderProps {
  branch: BranchDetailType;
  onShare: () => void;
  onBack: () => void;
}

const IconLabel = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <div className="flex flex-row items-center gap-1">
    {icon}
    <span className="text-gray-500 text-14px">{label}</span>
  </div>
);

const BranchStaffInfo = memo(({ branch }: { branch: BranchDetailType }) => {
  if (!branch.staffs.length && !branch.director) return null;

  return (
    <div className={'flex flex-col gap-4 -mb-4 py-4'}>
      <div className={'w-full h-[1px] bg-gray-200 rounded-sm'} />
      {branch.staffs.length > 0 && (
        <StaffSection
          directorCount={branch.staffs.filter((staff) => staff.grade === '원장').length}
          staffCount={branch.staffs.filter((staff) => staff.grade === '테라피스트').length}
        />
      )}
      {branch.director && <ProfileCard type={'primary'} {...branch.director} />}
    </div>
  );
});

const BranchHeaderContent = memo(({ branch }: { branch: BranchDetailType }) => {
  return (
    <div className={'flex flex-row items-center gap-1 mt-1.5'}>
      <IconLabel icon={<StoreIcon className={'text-gray-500'} />} label={branch.brand} />
      {branch.location.distance && (
        <IconLabel icon={<PinIcon className={'text-gray-500'} />} label={branch.location.distance} />
      )}
    </div>
  );
});

const BranchHeader = memo(({ branch, onShare }: BranchHeaderProps) => {
  return (
    <DynamicHomeHeaderBackground
      header={
        <>
          <div className={'flex flex-row items-center gap-2'}>
            <p className={'font-b text-20px'}>{branch.name}</p>
          </div>
          <BranchHeaderContent branch={branch} />
        </>
      }
      content={<BranchStaffInfo branch={branch} />}
      buttonArea={
        <button
          className={'flex w-10 h-10 rounded-full bg-primary justify-center items-center text-white shadow-md'}
          onClick={onShare}
        >
          <ShareIcon className={'w-6 h-6'} />
        </button>
      }
    />
  );
});

export default BranchHeader;
