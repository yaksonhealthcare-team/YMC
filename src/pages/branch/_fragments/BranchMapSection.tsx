import MapView from "@components/MapView.tsx"
import { Branch } from "../../../types/Branch.ts"
import { Coordinate } from "../../../types/Coordinate.ts"
import { useEffect, useState } from "react"
import {
  useBranchBookmarkMutation,
  useBranchUnbookmarkMutation,
} from "../../../queries/useBranchQueries.tsx"
import { useNavigate } from "react-router-dom"
import { useBranchLocationSelect } from "../../../hooks/useBranchLocationSelect.ts"
import { useGeolocation } from "../../../hooks/useGeolocation.tsx"
import { BranchFilterListItem } from "./BranchFilterList.tsx"
import LoadingIndicator from "@components/LoadingIndicator.tsx"

interface BranchMapSectionProps {
  brandCode?: string
  category?: string
  branches: Branch[]
  onSelectBranch: (branch: Branch | null) => void
  onMoveMap: (newCenter: Coordinate) => void
}

const BranchMapSection = ({
  brandCode,
  category,
  onSelectBranch,
  branches,
  onMoveMap,
}: BranchMapSectionProps) => {
  const navigate = useNavigate()
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const { location: selectedLocation } = useBranchLocationSelect()
  const { location: currentLocation, loading: locationLoading } =
    useGeolocation()
  const [center, setCenter] = useState<Coordinate>()
  const { mutateAsync: addBookmark } = useBranchBookmarkMutation()
  const { mutateAsync: removeBookmark } = useBranchUnbookmarkMutation()

  // 위치 이동 감지 및 처리
  const handleMapMove = (newCenter: Coordinate) => {
    onMoveMap(newCenter)
  }

  useEffect(() => {
    // 초기 로딩 시 현재 위치 또는 선택된 위치를 기준으로 설정
    const initialCoords = selectedLocation?.coords ||
      currentLocation || {
        latitude: 37.5665,
        longitude: 126.978,
      }
    setCenter(initialCoords)
    handleMapMove(initialCoords)
  }, [])

  useEffect(() => {
    // 필터 변경 시 선택된 지점 초기화
    setSelectedBranch(null)
    onSelectBranch(null)
  }, [brandCode, category])

  if (locationLoading || !center) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div className={"relative w-full  h-full "}>
      <MapView
        center={center}
        branches={branches}
        options={{
          onSelectBranch: (branch) => {
            if (!branch) return
            setSelectedBranch(branch)
            onSelectBranch?.(branch)
          },
          onMoveMap: handleMapMove,
          showCurrentLocationButton: true,
          showCurrentLocation: true,
          currentLocationButtonPosition: selectedBranch
            ? "transition-transform -translate-y-32 duration-300"
            : "transition-transform translate-y-0 duration-300",
        }}
      />
      <div
        className={`w-full absolute px-5 pb-6 pt-2 -bottom-32 rounded-t-3xl ${selectedBranch ? "transition-transform -translate-y-32 duration-300" : "transition-transform translate-y-6 duration-300"} bg-white z-[300]`}
      >
        {selectedBranch && (
          <BranchFilterListItem
            branch={selectedBranch}
            onClick={() => {
              navigate(`/branch/${selectedBranch.b_idx}`)
            }}
            onClickFavorite={async (branch) => {
              if (branch.isFavorite) {
                await removeBookmark(branch.b_idx)
              } else {
                await addBookmark(branch.b_idx)
              }
            }}
            isFavorite={selectedBranch.isFavorite || false}
          />
        )}
      </div>
    </div>
  )
}

export default BranchMapSection
