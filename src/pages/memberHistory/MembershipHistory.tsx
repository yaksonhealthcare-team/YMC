import MainTabs from "./_fragments/MainTabs"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@components/Button"
import clsx from "clsx"
import { MembershipCard } from "@components/MembershipCard"
import { useNavigate } from "react-router-dom"
import ReservationIcon from "@assets/icons/ReservationIcon.png"
import { useLayout } from "contexts/LayoutContext"
import { useUserMemberships } from "queries/useMembershipQueries"
import {
  MyMembershipFilterItem,
  myMembershipFilters,
  MembershipStatus,
} from "types/Membership"
import LoadingIndicator from "@components/LoadingIndicator"

const MembershipContent = ({ filterId }: { filterId: string }) => {
  const {
    data: memberships,
    isLoading,
    isError,
    error,
  } = useUserMemberships(filterId === "-" ? "" : filterId)

  const flattenedMemberships = useMemo(() => {
    if (!memberships?.body) return []
    return memberships.body
  }, [memberships])

  if (isLoading) return <LoadingIndicator className="flex-1" />
  if (isError)
    return (
      <div className="p-5 text-red-500">
        에러가 발생했습니다:{" "}
        {error instanceof Error ? error.message : "알 수 없는 에러"}
      </div>
    )

  return (
    <div className="flex-1 px-5 space-y-3 pb-32 overflow-y-auto scrollbar-hide">
      {!memberships?.body?.length ? (
        <div className="flex justify-center items-center p-4">
          회원권 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {flattenedMemberships.map((membership) => (
            <MembershipCard
              key={membership.mp_idx}
              id={parseInt(membership.mp_idx)}
              status={
                membership.status === "사용가능"
                  ? MembershipStatus.ACTIVE
                  : membership.status === "사용완료"
                    ? MembershipStatus.INACTIVE
                    : MembershipStatus.EXPIRED
              }
              title={membership.s_type}
              count={`${membership.remain_amount}회 / ${membership.buy_amount}회`}
              date={`${membership.pay_date.split(" ")[0]} - ${membership.expiration_date.split(" ")[0]}`}
              showReserveButton={false}
              serviceType={membership.service_name || membership.s_type}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const FilterContent = ({ 
  membershipFilter, 
  onFilterChange 
}: { 
  membershipFilter: MyMembershipFilterItem
  onFilterChange: (filter: MyMembershipFilterItem) => void
}) => {
  return (
    <div className="px-5 py-4 flex justify-center gap-2">
      {myMembershipFilters.map((filter) => {
        const isSelected = filter.id === membershipFilter.id
        return (
          <Button
            key={filter.id}
            fullCustom
            className={clsx(
              "min-w-0 whitespace-nowrap px-[12px] py-[5px] text-12px font-sb !rounded-2xl",
              isSelected
                ? "bg-primary-50 text-primary border border-solid border-primary"
                : "bg-white text-gray-500 border border-solid border-gray-200",
            )}
            onClick={() => onFilterChange(filter)}
          >
            {filter.title}
          </Button>
        )
      })}
    </div>
  )
}

const MembershipHistory = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [membershipFilter, setMembershipFilter] =
    useState<MyMembershipFilterItem>(myMembershipFilters[0])

  const handleFilterChange = useCallback((filter: MyMembershipFilterItem) => {
    setMembershipFilter(filter)
  }, [])

  useEffect(() => {
    setHeader({
      display: false,
    })
    setNavigation({ display: true })
  }, [setHeader, setNavigation])

  return (
    <div className="flex flex-col bg-system-bg min-h-[calc(100vh-82px)]">
      <div className="px-5">
        <MainTabs />
      </div>

      <FilterContent 
        membershipFilter={membershipFilter} 
        onFilterChange={handleFilterChange} 
      />

      <MembershipContent filterId={membershipFilter.id} />

      <button
        className="fixed bottom-[98px] right-5 w-14 h-14 bg-primary-300 text-white rounded-full shadow-lg hover:bg-primary-400 focus:outline-none focus:bg-primary-500 focus:ring-opacity-50 transition-colors duration-200 z-10"
        onClick={() => navigate("/membership")}
      >
        <img src={ReservationIcon} alt="예약하기" className="w-8 h-8 mx-auto" />
      </button>
    </div>
  )
}

export default MembershipHistory
