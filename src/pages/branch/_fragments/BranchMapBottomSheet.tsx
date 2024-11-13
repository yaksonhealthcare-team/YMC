import { Branch } from "../../../types/Branch.ts"
import { BranchFilterListItem } from "./BranchFilterList.tsx"
import { useNavigate } from "react-router-dom"

interface BranchMapBottomSheetProps {
  branch: Branch
}

const BranchMapBottomSheet = ({ branch }: BranchMapBottomSheetProps) => {
  const navigate = useNavigate()
  return (
    <div className={"flex flex-col w-screen items-center gap-5 px-5"}>
      <BranchFilterListItem
        branch={branch}
        onClick={(branch) => navigate(`/branch/${branch.id}`)}
        onClickFavorite={() => {
          console.log("TOGGLE FAVORITE")
        }}
      />
    </div>
  )
}

export default BranchMapBottomSheet
