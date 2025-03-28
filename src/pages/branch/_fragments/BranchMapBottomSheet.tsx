import { Branch } from "../../../types/Branch.ts"
import { BranchFilterListItem } from "./BranchFilterList.tsx"
import { useNavigate } from "react-router-dom"
import { 
  useBranchBookmarkMutation,
  useBranchUnbookmarkMutation
} from "../../../queries/useBranchQueries.tsx"
import { useOverlay } from "../../../contexts/ModalContext.tsx"

interface BranchMapBottomSheetProps {
  branch: Branch
}

const BranchMapBottomSheet = ({ branch }: BranchMapBottomSheetProps) => {
  const navigate = useNavigate()
  const { mutate: addBookmark } = useBranchBookmarkMutation()
  const { mutate: removeBookmark } = useBranchUnbookmarkMutation()
  const { showToast } = useOverlay()

  const handleToggleFavorite = (branch: Branch) => {
    if (branch.isFavorite) {
      removeBookmark(branch.b_idx, {
        onSuccess: () => {
          showToast("즐겨찾기에서 삭제했어요.")
        }
      })
    } else {
      addBookmark(branch.b_idx, {
        onSuccess: () => {
          showToast("즐겨찾기에 추가했어요.")
        }
      })
    }
  }
  
  return (
    <div className={"flex flex-col items-stretch gap-5 px-5 bg-white"}>
      <BranchFilterListItem
        branch={branch}
        onClick={(branch) => navigate(`/branch/${branch.b_idx}`)}
        onClickFavorite={handleToggleFavorite}
        isFavorite={branch.isFavorite || false}
      />
    </div>
  )
}

export default BranchMapBottomSheet
