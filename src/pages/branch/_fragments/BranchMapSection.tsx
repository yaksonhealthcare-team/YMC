import MapView from "@components/MapView.tsx"
import { Branch } from "../../../types/Branch.ts"

interface BranchMapSectionProps {
  branches: Branch[];
}

const BranchMapSection = ({ branches }: BranchMapSectionProps) => {
  return (
    <div className={"flex flex-col flex-1 h-full"}>
      <MapView branches={branches} onSelectBranch={console.log} />
    </div>
  )
}

export default BranchMapSection
