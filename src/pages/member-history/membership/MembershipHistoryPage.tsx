import { useLayout } from "../../../contexts/LayoutContext"
import { useCallback, useEffect, useState } from "react"
import { useUserMemberships } from "../../../queries/useMembershipQueries"
import useIntersection from "../../../hooks/useIntersection"
import LoadingIndicator from "@components/LoadingIndicator"
import { useNavigate } from "react-router-dom"
import { MembershipCard } from "@components/MembershipCard"
import {
  myMembershipFilters,
  MyMembershipFilterItem,
} from "../../../types/Membership"
import MainTabs from "../_fragments/MainTabs"
import { Button } from "@components/Button"
import clsx from "clsx"
import AddMembershipIcon from "@assets/icons/AddMembershipIcon.svg?react"
import { getStatusFromString } from "../../../utils/membership"

const MembershipContent = ({ filterId }: { filterId: string }) => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])
  const {
    data: memberships,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useUserMemberships(filterId === "-" ? "" : filterId)

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  if (isLoading) {
    return <LoadingIndicator className="flex-1" />
  }

  const handleCardClick = (membershipId: string) => {
    navigate(`/membership/usage/${membershipId}`, {
      state: { from: "/member-history/membership" },
    })
  }

  return (
    <div className="flex-1 px-5 space-y-3 pb-32 overflow-y-auto scrollbar-hide">
      {!memberships?.pages[0].body?.length ? (
        <div className="flex justify-center items-center p-4">
          회원권 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {memberships.pages.map((page) =>
            page.body.map((membership) => (
              <div
                key={membership.mp_idx}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button")) {
                    e.stopPropagation()
                    return
                  }
                  handleCardClick(membership.mp_idx)
                }}
              >
                <MembershipCard
                  id={parseInt(membership.mp_idx)}
                  title={membership.service_name || "No Named"}
                  count={`${membership.remain_amount}회 / ${membership.buy_amount}회`}
                  startDate={membership.pay_date.split(" ")[0]}
                  endDate={membership.expiration_date.split(" ")[0]}
                  status={getStatusFromString(membership.status)}
                  showReserveButton={false}
                  serviceType={membership.s_type.replace("회원권", "").trim()}
                  branchs={membership.branchs}
                />
              </div>
            )),
          )}
          <div ref={observerTarget} className="h-4" />
          {isFetchingNextPage && <LoadingIndicator className="min-h-[100px]" />}
        </div>
      )}
    </div>
  )
}

const FilterContent = ({
  membershipFilter,
  onFilterChange,
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
              "min-w-0 whitespace-nowrap px-[12px] py-[5px] text-14px !rounded-[15px]",
              isSelected
                ? "bg-primary-50 text-primary border border-solid border-primary font-sb"
                : "bg-white text-gray-500 border border-solid border-gray-200 font-r",
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

const MembershipHistoryPage = () => {
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
  }, [])

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
        <AddMembershipIcon className="w-8 h-8 mx-auto text-white" />
      </button>
    </div>
  )
}

export default MembershipHistoryPage
