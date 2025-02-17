import { memo } from "react"
import BranchDetailBottomActionBar from "./BranchDetailBottomActionBar"
import { BranchDetail as BranchDetailType } from "types/Branch"

interface BranchActionsProps {
  branch: BranchDetailType
  onBookmark: () => void
  onReservation: () => void
}

const BranchActions = memo(
  ({ branch, onBookmark, onReservation }: BranchActionsProps) => {
    return (
      <div
        className={
          "fixed bottom-0 left-0 right-0 flex flex-col items-center justify-center w-full bg-white"
        }
      >
        <BranchDetailBottomActionBar
          isBookmarked={branch.isBookmarked || false}
          bookmarkCount={branch.favoriteCount}
          onBookmark={onBookmark}
          onClickReservation={onReservation}
        />
      </div>
    )
  },
)

export default BranchActions
