import Header from "@components/Header"
import { Branch } from "../../../types/Branch"
import MembershipBranchSelectPage from "../MembershipBranchSelectPage"

interface Props {
  onBranchSelect: (branch: Branch) => void
  onClose: () => void
  brandCode: string
}

export const MembershipBranchSelectModal = ({
  onBranchSelect,
  onClose,
  brandCode,
}: Props) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9001]"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="fixed inset-0 bg-white h-full w-full"
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Header title="지점 선택" type="back_title" onClickBack={onClose} />
        <MembershipBranchSelectPage
          onSelect={(branch) => {
            onBranchSelect(branch)
            onClose()
          }}
          brandCode={brandCode}
        />
      </div>
    </div>
  )
}
