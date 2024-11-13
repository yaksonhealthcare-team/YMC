import { MembershipStatus } from "types/Membership"
import { Tag, TagType } from "./Tag"

interface MembershipTagProps {
  status: MembershipStatus
}

const MembershipTag = ({ status }: MembershipTagProps) => {
  const getTagContent = (): string => {
    switch (status) {
      case MembershipStatus.AVAILABLE:
        return "사용가능"
      case MembershipStatus.COMPLETED:
        return "사용완료"
      case MembershipStatus.EXPIRED:
        return "만료됨"
      default:
        return "사용가능"
    }
  }

  const getTagType = (): TagType => {
    switch (status) {
      case MembershipStatus.AVAILABLE:
        return "red"
      case MembershipStatus.COMPLETED:
        return "used"
      case MembershipStatus.EXPIRED:
        return "used"
      default:
        return "red"
    }
  }

  return (
    <Tag type={getTagType()} title={getTagContent()} className="!rounded" />
  )
}

export default MembershipTag
