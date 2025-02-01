import { MembershipStatus, membershipStatusToKorean } from "../types/Membership"
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

  return <Tag type={getTagType()} title={membershipStatusToKorean[status]} />
}

export default MembershipTag
