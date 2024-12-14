import { MembershipStatus } from "types/Membership"
import { Tag, TagType } from "./Tag"

interface MembershipTagProps {
  status: MembershipStatus
}

const MembershipTag = ({ status }: MembershipTagProps) => {
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

  return <Tag type={getTagType()} title={status} className="!rounded" />
}

export default MembershipTag
