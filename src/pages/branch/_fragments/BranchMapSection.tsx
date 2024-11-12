import MapView from "@components/MapView.tsx"
import { MockBranches } from "../../../types/Branch.ts"


const BranchMapSection = () => {
  return <div className={"flex flex-col flex-1 h-full"}><MapView branches={MockBranches} onSelectBranch={console.log} />
  </div>
}

export default BranchMapSection
