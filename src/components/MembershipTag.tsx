import { MembershipStatus } from "types/Membership"
import { Tag, TagType } from "./Tag"

interface MembershipTagProps {
  status: MembershipStatus
}

const MembershipTag = ({ status }: MembershipTagProps) => {
  const getTagType = (): TagType => {
    switch (status) {
      case MembershipStatus.ACTIVE:
        return "unused"
      case MembershipStatus.INACTIVE:
        return "used"
      case MembershipStatus.EXPIRED:
        return "used"
      default:
        return "unused"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case MembershipStatus.ACTIVE:
        return "사용가능"
      case MembershipStatus.INACTIVE:
        return "사용완료"
      case MembershipStatus.EXPIRED:
        return "만료됨"
      default:
        return ""
    }
  }

  return <Tag type={getTagType()} title={getStatusText()} />
}

export default MembershipTag
