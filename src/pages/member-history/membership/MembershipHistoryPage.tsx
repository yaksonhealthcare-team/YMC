import { useLayout } from "../../../contexts/LayoutContext"
import { useEffect } from "react"
import { useUserMemberships } from "../../../queries/useMembershipQueries"
import useIntersection from "../../../hooks/useIntersection"
import LoadingIndicator from "@components/LoadingIndicator"
import { useNavigate } from "react-router-dom"
import { MembershipStatus } from "../../../types/Membership"

const getMembershipStatusText = (status: MembershipStatus) => {
  switch (status) {
    case MembershipStatus.ACTIVE:
      return "사용가능"
    case MembershipStatus.INACTIVE:
      return "사용완료"
    case MembershipStatus.EXPIRED:
      return "만료됨"
    default:
      return status
  }
}

const MembershipHistoryPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const {
    data: memberships,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useUserMemberships()

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  useEffect(() => {
    setHeader({
      display: true,
      title: "회원권 내역",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  if (!memberships) return null

  return (
    <div className="flex flex-col">
      {memberships.pages.map((page) =>
        page.body.map((membership) => (
          <div
            key={membership.mp_idx}
            className="flex flex-col gap-4 p-5 border-b border-gray-100"
            onClick={() => navigate(`/membership/${membership.mp_idx}`)}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-14px">
                {membership.service_name || membership.s_type}
              </span>
              <span className="text-primary font-m text-14px">
                {getMembershipStatusText(membership.status as MembershipStatus)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-b text-16px">
                잔여 {membership.remain_amount}회
              </span>
              <span className="text-gray-600 text-14px">
                {membership.pay_date} ~ {membership.expiration_date}
              </span>
            </div>
          </div>
        )),
      )}
      <div ref={observerTarget} className="h-4" />
      {isFetchingNextPage && (
        <LoadingIndicator className="min-h-[100px]" />
      )}
    </div>
  )
}

export default MembershipHistoryPage 