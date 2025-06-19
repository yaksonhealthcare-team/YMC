import BranchIcon from '@components/icons/BranchIcon.tsx';
import { Branch } from '../../types/Branch.ts';

interface BranchItemProps {
  branch: Branch;
}

const BranchItem = ({ branch }: BranchItemProps) => {
  return (
    <>
      <div className="flex gap-[6px]">
        <BranchIcon className="w-[16px] h-[16px] mt-[3px]" />
        <div className="text-[14px]">
          <p className="font-bold text-gray-700">{branch.name}</p>
          <p className="font-normal text-gray-500 mt-[8px]">{branch.address}</p>
        </div>
      </div>
    </>
  );
};

export default BranchItem;
