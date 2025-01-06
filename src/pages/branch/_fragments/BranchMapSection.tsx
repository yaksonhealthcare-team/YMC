import MapView from "@components/MapView.tsx"
import { Branch } from "../../../types/Branch.ts"
import { Coordinate, DEFAULT_COORDINATE } from "../../../types/Coordinate.ts"
import { useEffect, useState } from "react"
import { fetchBranches } from "../../../apis/branch.api.ts"
import { BranchFilterListItem } from "./BranchFilterList.tsx"
import {
  useBranchBookmarkMutation,
  useBranchUnbookmarkMutation,
} from "../../../queries/useBranchQueries.tsx"

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
  const [branches, setBranches] = useState<Branch[]>([])
  const [coords, setCoords] = useState<Coordinate>(DEFAULT_COORDINATE)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const { mutateAsync: addBookmark } = useBranchBookmarkMutation()
  const { mutateAsync: removeBookmark } = useBranchUnbookmarkMutation()

  useEffect(() => {
    fetchBranchesByCoords(coords)
  }, [])

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
          (branch) => !branches.some((newBranch) => newBranch.id === branch.id),
        ),
        ...branches,
      ]
    })
    if (selectedBranch) {
      const newBranch = branches.find(
        (branch) => selectedBranch.id === branch.id,
      )
      if (newBranch) {
        setSelectedBranch(newBranch)
      }
    }
  }

  return (
    <div className={"relative flex flex-col flex-1 h-full overflow-hidden"}>
      <MapView
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
            onClick={() => {}}
            onClickFavorite={async (branch) => {
              if (branch.isFavorite) {
                await removeBookmark(branch.id)
              } else {
                await addBookmark(branch.id)
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
