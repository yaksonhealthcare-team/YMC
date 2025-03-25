import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { useNavigate } from "react-router-dom"

interface MembershipUsageProps {
  membershipName?: string
  branchName?: string
  remainingCount?: string
  membershipId?: string
}

const MembershipUsage = ({
  membershipName,
  branchName,
  remainingCount,
  membershipId,
}: MembershipUsageProps) => {
  const navigate = useNavigate()
  const hasMembershipName = !!membershipName
  const hasBranchName = !!branchName
  const hasRemainingCount = !!remainingCount

  return (
    <div className="flex flex-col gap-[16px] mt-[40px]">
      <div className="flex justify-between">
        <p className="font-b">회원권 사용 현황</p>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            navigate(`/membership/usage/${membershipId}`)
          }}
        >
          <span className="font-r text-12px text-gray-500">사용내역보기 </span>
          <CaretRightIcon className="w-3 h-3" />
        </div>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div>
          <p className="text-gray-500 font-sb text-[14px]">회원권명</p>
          <p
            className={`font-r text-[14px] mt-[4px] ${!hasMembershipName ? "text-gray-500" : "text-gray-700"}`}
          >
            {hasMembershipName ? membershipName : "회원권 정보가 없습니다"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 font-sb text-[14px]">사용 지점</p>
          <p
            className={`font-r text-[14px] mt-[4px] ${!hasBranchName ? "text-gray-500" : "text-gray-700"}`}
          >
            {hasBranchName ? branchName : "지점 정보가 없습니다"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 font-sb text-[14px]">잔여 횟수</p>
          <p
            className={`font-r text-[14px] mt-[4px] ${!hasRemainingCount ? "text-gray-500" : "text-gray-700"}`}
          >
            {hasRemainingCount ? remainingCount : "잔여 횟수 정보가 없습니다"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MembershipUsage
