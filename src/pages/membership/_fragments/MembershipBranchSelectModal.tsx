import { Branch } from "../../../types/Branch"
import { MembershipActiveBranchList } from "./MembershipActiveBranchList"

interface Props {
  onBranchSelect: (branch: Branch) => void
  onClose: () => void
}

export const MembershipBranchSelectModal = ({
  onBranchSelect,
  onClose,
}: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="bg-white h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">지점 선택</h2>
          <button onClick={onClose} className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <MembershipActiveBranchList
            onBranchSelect={(branch) => {
              onBranchSelect(branch)
              onClose()
            }}
          />
        </div>
      </div>
    </div>
  )
}
