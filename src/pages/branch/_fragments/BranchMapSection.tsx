import MapView from "@components/MapView.tsx"
import { Branch } from "../../../types/Branch.ts"

interface BranchMapSectionProps {
  branches: Branch[]
  onSelectBranch: (branch: Branch | null) => void
}

const BranchMapSection = ({
  branches,
  onSelectBranch,
}: BranchMapSectionProps) => {
  const markers = branches.map((branch) => {
    return new naver.maps.Marker({
      position: new naver.maps.LatLng(branch.latitude, branch.longitude),
      map,
      clickable: true,
    })
  })

  return (
    <div className={"flex flex-col flex-1 h-full"}>
      <MapView />
    </div>
  )
}

export default BranchMapSection
