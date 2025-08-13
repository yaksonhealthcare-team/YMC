import { useUserStore } from '@/_domain/auth';
import BranchCard from '@/components/BranchCard';
import { Branch } from '@/types/Branch';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface BranchInfo {
  b_idx: string;
  brandName: string;
  address?: string;
  brandCode: string;
}

interface Props {
  onBranchSelect: (branch: Branch) => void;
  brandCode?: string;
}

export const MembershipActiveBranchList = ({ onBranchSelect, brandCode }: Props) => {
  const { user } = useUserStore();
  const location = useLocation();

  // 사용 가능한 지점 목록
  const availableBranches: BranchInfo[] = useMemo(
    () => location.state?.availableBranches ?? [],
    [location.state?.availableBranches]
  );

  // 현재 선택된 브랜드 코드
  const currentBrandCode = brandCode ?? location.state?.brand_code ?? '';

  // 사용자의 활성 지점과 사용 가능한 지점을 필터링
  const filteredBranches = useMemo(() => {
    if (!user?.brands?.length) return [];

    if (availableBranches.length === 0) {
      // 브랜드 코드가 있는 경우 해당 브랜드만 필터링
      if (currentBrandCode) {
        return user.brands.filter((brand) => brand.brand_code === currentBrandCode);
      }
      return user.brands; // 필터링 없이 모든 활성 지점 표시
    }

    // 사용 가능한 지점 목록이 있는 경우, 사용자의 활성 지점과 교차 필터링
    return user.brands.filter((brand) =>
      availableBranches.some(
        (availableBranch: BranchInfo) =>
          availableBranch.b_idx === brand.b_idx && (currentBrandCode ? brand.brand_code === currentBrandCode : true)
      )
    );
  }, [user?.brands, availableBranches, currentBrandCode]);

  if (!filteredBranches.length) {
    return (
      <div className="p-5">
        <h3 className="font-m text-16px text-gray-900 mb-4">이용중인 지점</h3>
        <div className="text-center text-gray-500 py-12">이용중인 지점이 없습니다</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="font-m text-16px text-gray-900 mb-2">이용중인 지점</h3>
      {filteredBranches.map((branch) => {
        const branchData: Branch = {
          b_idx: branch.b_idx,
          name: branch.b_name,
          address: branch.addr || '',
          latitude: 0,
          longitude: 0,
          canBookToday: false,
          distanceInMeters: null,
          isFavorite: false,
          brandCode: branch.brand_code || '',
          brand: 'therapist'
        };
        return (
          <button key={branch.b_idx} onClick={() => onBranchSelect(branchData)}>
            <BranchCard name={branch.b_name} address={branch.addr || ''} />
          </button>
        );
      })}
    </div>
  );
};
