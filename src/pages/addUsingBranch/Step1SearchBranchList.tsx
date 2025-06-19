import CloseGrayFillIcon from '@assets/icons/CloseGrayFillIcon.svg?react';
import CustomTextField from '@components/CustomTextField.tsx';
import LoadingIndicator from '@components/LoadingIndicator';
import BranchIcon from '@components/icons/BranchIcon.tsx';
import CheckIcon from '@components/icons/CheckIcon.tsx';
import SearchIcon from '@components/icons/SearchIcon.tsx';
import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useGeolocation } from '../../hooks/useGeolocation.tsx';
import useIntersection from '../../hooks/useIntersection.tsx';
import { useBranches } from '../../queries/useBranchQueries.tsx';
import { Branch } from '../../types/Branch.ts';

interface SearchBranchListProps {
  selectedBranches: Branch[];
  setSelectedBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
}

const Step1SearchBranchList = ({ selectedBranches, setSelectedBranches }: SearchBranchListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { location: currentLocation } = useGeolocation();
  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  });

  const {
    data: branchPages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading
  } = useBranches({
    latitude: currentLocation?.latitude,
    longitude: currentLocation?.longitude,
    search: debouncedSearchQuery,
    enabled: !!currentLocation
  });

  const branches =
    branchPages?.pages.flatMap((page) =>
      page.body.result.map((branch) => ({
        b_idx: branch.b_idx,
        name: branch.b_name,
        address: branch.b_addr,
        latitude: Number(branch.b_lat),
        longitude: Number(branch.b_lon),
        canBookToday: branch.reserve === 'Y',
        distanceInMeters: branch.distance,
        isFavorite: branch.b_bookmark === 'Y',
        brandCode: branch.brand_code,
        brand: 'therapist'
      }))
    ) || [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranches((prev) => {
      if (prev.some((b) => b.b_idx === branch.b_idx)) {
        return prev.filter((b) => b.b_idx !== branch.b_idx);
      }
      return [...prev, branch];
    });
  };

  const handleRemoveBranch = (branch: Branch) => {
    setSelectedBranches((prev) => prev.filter((b) => b.b_idx !== branch.b_idx));
  };

  return (
    <div className="flex flex-col justify-between h-full bg-white">
      <div className="px-[20px] mt-[20px]">
        <p className="text-gray-700 font-bold text-20px">
          기존에 이용하셨던
          <br />
          지점을 선택해주세요
        </p>
        <p className="mt-[12px] text-gray-400">지점명을 검색해 이용하셨던 매장을 알려주세요</p>

        <div className="mt-[40px]">
          <CustomTextField
            type={'text'}
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="지점명 검색"
            iconLeft={<SearchIcon className="ml-[2px] w-[24px] h-[24px]" />}
            iconRight={
              searchQuery && (
                <IconButton className="px-0 py-[15px] mr-[2px] h-full" onClick={handleSearchClear}>
                  <CloseGrayFillIcon className="w-[24px] h-[24px]" />
                </IconButton>
              )
            }
          />
        </div>

        <div className="mt-[28px]">
          <p className="text-gray-800 font-semibold mb-4">선택한 지점</p>
          <div className="flex mt-[16px] space-x-2 overflow-x-auto whitespace-nowrap no-scrollbar">
            {selectedBranches.map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center px-[8px] py-[5px] bg-[#f8f8f8] rounded-full text-gray-600 font-medium text-[14px]"
              >
                {item.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBranch(item);
                  }}
                  className="ml-[4px] text-gray-500 hover:text-gray-700 "
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F7F8FB] h-[8px] mt-[24px]"></div>

      <div className="flex-auto h-[0px] min-h-[200px] px-[20px] overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingIndicator />
          </div>
        ) : (
          <>
            {branches.length === 0 ? (
              <div className="flex justify-center items-center py-8 text-gray-500">검색 결과가 없습니다.</div>
            ) : (
              branches.map((branch) => (
                <div
                  key={branch.b_idx}
                  className="w-full flex justify-between py-[16px] cursor-pointer border-b border-b-[#ECECEC] text-left"
                  onClick={() => handleSelectBranch(branch)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectBranch(branch);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${branch.name} 지점 선택`}
                >
                  <div className="flex gap-[6px] w-full">
                    <BranchIcon className="w-[16px] h-[16px] mt-[3px]" />
                    <div className="text-[14px] w-full">
                      <div className="flex justify-between items-center h-[24px] w-full">
                        <p className="font-bold text-gray-700">{branch.name}</p>
                        {selectedBranches.some((b) => b.b_idx === branch.b_idx) && (
                          <CheckIcon className="w-[24px] h-[24px] flex-shrink-0" htmlColor="#F37165" />
                        )}
                      </div>
                      <p className="font-normal text-gray-500 mt-[8px]">{branch.address}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={observerTarget} className={'h-4'} />
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <LoadingIndicator size={24} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Step1SearchBranchList;
