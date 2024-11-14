import { Branch } from "../../../types/Branch.ts"
import { BranchFilterListItem } from "./BranchFilterList.tsx"

interface BranchMapBottomSheetProps {
  branch: Branch
}

const BranchMapBottomSheet = ({ branch }: BranchMapBottomSheetProps) => {
  // const navigate = useNavigate()
  return (
    <div className={"flex flex-col items-stretch gap-5 px-5 bg-white"}>
      <BranchFilterListItem
        branch={branch}
        onClick={(branch) => console.log(branch)}
        onClickFavorite={() => {
          console.log("TOGGLE FAVORITE")
        }}
      />
    </div>
  )
}

export default BranchMapBottomSheet
