import { useUserStore } from '@/_domain/auth';
import { BranchesSchema } from '@/_domain/reservation';
import { useGetBranches } from '@/_domain/reservation/services/queries/branch.queries';
import { DEFAULT_COORDINATE, useIntersectionObserver } from '@/_shared';
import LoadingIndicator from '@/components/LoadingIndicator';
import { Image } from '@/components/common/Image';
import SearchIcon from '@/components/icons/SearchIcon';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useCallback, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface MembershipBranchListProps {
  onSelect?: (branch: BranchesSchema) => void;
  query?: string;
  // memberShipId?: string;
}

const MembershipBranchList = ({ onSelect, query /* memberShipId */ }: MembershipBranchListProps) => {
  const location = useLocation();
  const loadMoreRef = useRef(null);
  const { location: geolocationLocation } = useGeolocation();
  const { user } = useUserStore();

  const debouncedQuery = useDebounce(query, 300);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, isError, error, isFetching } =
    useGetBranches(
      user?.hp || '',
      {
        nowlat: geolocationLocation?.latitude || DEFAULT_COORDINATE.latitude,
        nowlon: geolocationLocation?.longitude || DEFAULT_COORDINATE.longitude,
        search: debouncedQuery,
        mp_idx: location.state?.selectedItem
      },
      { enabled: !!user, initialPageParam: 1 }
    );

  const handleNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useIntersectionObserver(loadMoreRef, handleNextPage, { rootMargin: '200px' });

  // const handleBranchSelect = (branch: BranchesSchema | Branch) => {
  //   const branchData: Branch =
  //     'b_idx' in branch && 'b_name' in branch
  //       ? {
  //           b_idx: branch.b_idx,
  //           name: branch.b_name,
  //           address: branch.b_addr,
  //           latitude: Number(branch.b_lat),
  //           longitude: Number(branch.b_lon),
  //           canBookToday: branch.reserve === 'Y',
  //           distanceInMeters: branch.distance,
  //           isFavorite: branch.b_bookmark === 'Y',
  //           brandCode: branch.brand_code,
  //           brand: 'therapist'
  //         }
  //       : branch;

  //   if (onSelect) {
  //     onSelect(branchData);
  //   } else {
  //     setFormData({
  //       branch: branchData.b_idx
  //     });
  //     navigate(-1);
  //   }
  // };

  // 지점 목록 렌더링 컴포넌트 추출
  const renderBranchList = (branches: BranchesSchema[]) => (
    <ul className="h-full overflow-y-auto divide-y divide-gray-100">
      {branches.map((branch) => (
        <li key={branch.b_idx}>
          <button
            onClick={() => onSelect?.(branch)}
            className="w-full px-5 py-4 gap-4 flex items-stretch  rounded"
            aria-label={`${branch.b_name} 선택`}
          >
            <Image
              className="border border-gray-100 rounded-xl h-[88px] aspect-square object-cover"
              src={branch.branch_pic}
              alt="지점 사진"
            />
            <div className="w-full flex flex-col">
              <div className="mt-0.5 text-start">
                <p className="font-b text-16px">{branch.b_name}</p>
              </div>
              <div className="flex items-center gap-[2.5px]">
                {branch.distance && <p className="font-r text-14px text-gray-400">{branch.distance}</p>}
              </div>
              <p className="font-r text-14px text-start">{branch.b_addr}</p>
            </div>
          </button>
        </li>
      ))}
      <div ref={loadMoreRef} />
    </ul>
  );

  const branches = useMemo(() => data?.flatMap((page) => page.data.body.result), [data]) || [];

  // 초기 데이터 로딩 상태 (완전히 빈 상태일 때)
  if (isLoading && !branches.length) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center text-gray-500">
          {error instanceof Error ? error.message : '지점 목록을 불러오는데 실패했습니다'}
        </div>
      </div>
    );
  }

  // 검색 결과 불러오는 중인 경우 (초기 로딩 이후 검색 시 로딩)
  if (debouncedQuery && isFetching && !isFetchingNextPage) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingIndicator />
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 min-h-[200px] mt-8">
        <div className="mb-4 p-3 rounded-full bg-gray-100">
          <SearchIcon className="w-6 h-6 text-gray-400" />
        </div>
        <p className="font-m text-16px text-gray-700 text-center">{'검색 결과가 없습니다'}</p>
        <p className="mt-2 font-r text-14px text-gray-500 text-center">{'다른 키워드로 검색해 보세요'}</p>
      </div>
    );
  }

  return <div className="h-full">{renderBranchList(branches)}</div>;
};

export default MembershipBranchList;
