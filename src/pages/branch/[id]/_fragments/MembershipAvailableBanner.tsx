import MembershipIcon from "@assets/icons/MembershipIcon.svg?react"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"

const MembershipAvailableBanner = ({
  availableMembershipCount,
  onClick,
}: {
  availableMembershipCount: number,
  onClick: () => void,
}) => (
  <button
    className={"w-full flex text-primary items-center justify-between bg-white rounded-lg px-4 py-3"}
    onClick={onClick}
  >
    <div className={"flex items-center gap-2"}>
      <MembershipIcon />
      <p className={"font-sb text-14px"}>{`사용 가능한 회원권이 ${availableMembershipCount}개 있어요`}</p>
    </div>
    <CaretRightIcon className={"w-4 h-4"} />
  </button>
)

export default MembershipAvailableBanner
