import MapView from "@components/MapView.tsx"
import { Branch } from "../../../types/Branch.ts"
import { Coordinate } from "../../../types/Coordinate.ts"
import { useEffect, useState } from "react"
import { fetchBranches } from "../../../apis/branch.api.ts"
import { BranchFilterListItem } from "./BranchFilterList.tsx"
import {
  useBranchBookmarkMutation,
  useBranchUnbookmarkMutation,
} from "../../../queries/useBranchQueries.tsx"
import { useNavigate } from "react-router-dom"
import { useBranchLocationSelect } from "../../../hooks/useBranchLocationSelect.ts"
import { useGeolocation } from "../../../hooks/useGeolocation.tsx"

interface BranchMapSectionProps {
  brandCode?: string
  category?: string
  onSelectBranch: (branch: Branch | null) => void
}

const BranchMapSection = ({
  brandCode,
  category,
  onSelectBranch,
}: BranchMapSectionProps) => {
  const navigate = useNavigate()
  const [branches, setBranches] = useState<Branch[]>([])
  const [coords, setCoords] = useState<Coordinate | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const { location: selectedLocation } = useBranchLocationSelect()
  const { location: currentLocation } = useGeolocation()

  const { mutateAsync: addBookmark } = useBranchBookmarkMutation()
  const { mutateAsync: removeBookmark } = useBranchUnbookmarkMutation()

  useEffect(() => {
    // 초기 로딩 시 현재 위치 또는 선택된 위치를 기준으로 지점 데이터 로드
    const initialCoords = selectedLocation?.coords || currentLocation
    if (initialCoords) {
      setCoords(initialCoords)
      fetchBranchesByCoords(initialCoords)
    }
  }, [])

  useEffect(() => {
    // 브랜드 코드나 카테고리가 변경되면 분기에서 즉시 데이터 로드
    if (coords) {
      setBranches([])
      fetchBranchesByCoords(coords)
      // 필터 변경 시 선택된 지점 초기화
      setSelectedBranch(null)
      onSelectBranch(null)
    }
  }, [brandCode, category])

  const fetchBranchesByCoords = async (coords: Coordinate) => {
    setCoords(coords)
    const { branches } = await fetchBranches({
      page: 1,
      latitude: coords.latitude,
      longitude: coords.longitude,
      brandCode,
      category,
    })
    setBranches((prev) => {
      return [
        ...prev.filter(
          (branch) =>
            !branches.some((newBranch) => newBranch.b_idx === branch.b_idx),
        ),
        ...branches,
      ]
    })
    if (selectedBranch) {
      const newBranch = branches.find(
        (branch) => selectedBranch.b_idx === branch.b_idx,
      )
      if (newBranch) {
        setSelectedBranch(newBranch)
      }
    }
  }

  return (
    <div className={"relative flex flex-col flex-1 h-full overflow-hidden"}>
      <MapView
        center={coords}
        branches={branches || []}
        options={{
          onSelectBranch: (branch) => {
            if (!branch) return
            setSelectedBranch(branch)
            onSelectBranch?.(branch)
          },
          onMoveMap: fetchBranchesByCoords,
          showCurrentLocationButton: true,
          showCurrentLocation: true,
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
              await fetchBranchesByCoords(coords)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default BranchMapSection
