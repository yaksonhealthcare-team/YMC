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
  return (
    <div className={"flex flex-col flex-1 h-full"}>
      <MapView branches={branches} onSelectBranch={onSelectBranch} />
    </div>
  )
}

export default BranchMapSection
