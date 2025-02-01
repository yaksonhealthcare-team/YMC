import { useLayout } from "../../../contexts/LayoutContext"
import { useEffect } from "react"
import { useUserMemberships } from "../../../queries/useMembershipQueries"
import useIntersection from "../../../hooks/useIntersection"
import LoadingIndicator from "@components/LoadingIndicator"
import { useNavigate } from "react-router-dom"
import { MembershipCard } from "@components/MembershipCard"
import { MembershipStatus } from "../../../types/Membership"

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

  if (!memberships?.pages) return null

  return (
    <div className="flex flex-col">
      {memberships.pages.map((page) =>
        page.body.map((membership) => (
          <div
            key={membership.mp_idx}
            className="flex flex-col gap-4 p-5 border-b border-gray-100"
            onClick={() => navigate(`/membership/usage/${membership.mp_idx}`)}
          >
            <MembershipCard
              id={parseInt(membership.mp_idx)}
              title={membership.service_name || '회원권 이름'}
              count={`${membership.remain_amount}회 / ${membership.buy_amount}회`}
              date={`${membership.pay_date.split(" ")[0]} - ${membership.expiration_date.split(" ")[0]}`}
              status={membership.status as MembershipStatus}
              showReserveButton={true}
              serviceType={membership.s_type.replace('회원권', '').trim()}
            />
          </div>
        ))
      )}
      <div ref={observerTarget} className="h-4" />
      {isFetchingNextPage && (
        <LoadingIndicator className="min-h-[100px]" />
      )}
    </div>
  )
}

export default MembershipHistoryPage 