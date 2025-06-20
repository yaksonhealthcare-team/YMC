import StoreIcon from '@/assets/icons/StoreIcon.svg?react';

interface BranchCardProps {
  name: string;
  address: string;
}

const BranchCard = ({ name, address }: BranchCardProps) => {
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex items-center gap-1.5'}>
        <StoreIcon className={'w-4 h-4 text-gray-950'} />
        <p className={'font-b text-14px'}>{name}</p>
      </div>
      <div className={'flex items-center gap-1.5'}>
        <div className={'w-4'} />
        <p className={'text-14px text-gray-500'}>{address}</p>
      </div>
    </div>
  );
};

export default BranchCard;
