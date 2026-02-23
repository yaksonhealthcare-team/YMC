import LoadingIndicator from '@/shared/ui/loading/LoadingIndicator';
import MapView from '@/shared/ui/map-view/MapView';
import { useBranchLocationSelect } from '@/features/search-branch/lib/useBranchLocationSelect';
import { useGeolocation } from '@/features/search-branch/lib/useGeolocation';
import { useBranchBookmarkMutation, useBranchUnbookmarkMutation } from '@/entities/branch/api/useBranchQueries';
import { Branch } from '@/entities/branch/model/Branch';
import { Coordinate } from '@/shared/types/Coordinate';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BranchFilterListItem } from './BranchFilterList';

interface BranchMapSectionProps {
  brandCode?: string;
  category?: string;
  branches: Branch[];
  onSelectBranch: (branch: Branch | null) => void;
  onMoveMap: (newCenter: Coordinate) => void;
  isLoading?: boolean;
}

const BranchMapSection = ({
  brandCode,
  category,
  onSelectBranch,
  branches,
  onMoveMap,
  isLoading
}: BranchMapSectionProps) => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const { location: selectedLocation } = useBranchLocationSelect();
  const { location: currentLocation } = useGeolocation();
  const [center, setCenter] = useState<Coordinate>();
  const { mutateAsync: addBookmark } = useBranchBookmarkMutation();
  const { mutateAsync: removeBookmark } = useBranchUnbookmarkMutation();

  // 위치 이동 감지 및 처리
  const handleMapMove = (newCenter: Coordinate) => {
    onMoveMap(newCenter);
  };

  useEffect(() => {
    // 초기 로딩 시 현재 위치 또는 선택된 위치를 기준으로 설정
    const initialCoords = selectedLocation?.coords ||
      currentLocation || {
        latitude: 37.5665,
        longitude: 126.978
      };
    setCenter(initialCoords);
    handleMapMove(initialCoords);
  }, []);

  useEffect(() => {
    // 필터 변경 시 선택된 지점 초기화
    setSelectedBranch(null);
    onSelectBranch(null);
  }, [brandCode, category]);

  // 로딩 중일 때 표시
  if (!center) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
        <LoadingIndicator size={48} />
      </div>
    );
  }

  return (
    <div className={'relative w-full  h-full '}>
      {isLoading && (
        <div className="absolute lex items-center justify-center min-h-[calc(100vh-300px)]">
          <LoadingIndicator size={48} />
        </div>
      )}
      <MapView
        center={center}
        branches={branches}
        options={{
          onSelectBranch: (branch) => {
            if (!branch) return;
            setSelectedBranch(branch);
            onSelectBranch?.(branch);
          },
          onMoveMap: handleMapMove,
          showCurrentLocationButton: true,
          showCurrentLocation: true,
          currentLocationButtonPosition: selectedBranch
            ? 'transition-transform -translate-y-32 duration-300'
            : 'transition-transform translate-y-0 duration-300'
        }}
      />
      <div
        className={`w-full absolute px-5 -bottom-32 rounded-t-3xl ${selectedBranch ? 'transition-transform -translate-y-32 duration-300' : 'transition-transform translate-y-6 duration-300'} bg-white z-[300]`}
      >
        {selectedBranch && (
          <BranchFilterListItem
            branch={selectedBranch}
            onClick={() => {
              navigate(`/branch/${selectedBranch.b_idx}`);
            }}
            onClickFavorite={async (branch) => {
              if (branch.isFavorite) {
                await removeBookmark(branch.b_idx);
              } else {
                await addBookmark(branch.b_idx);
              }
            }}
            isFavorite={selectedBranch.isFavorite || false}
          />
        )}
      </div>
    </div>
  );
};

export default BranchMapSection;
