import { useLocation, useNavigate } from "react-router-dom"
import { useReservationFormStore } from "../../stores/reservationFormStore"
import { Branch, BranchSearchResult } from "../../types/Branch"
import { useBranches } from "../../queries/useBranchQueries"
import { useGeolocation } from "../../hooks/useGeolocation"
import { useIntersection } from "../../hooks/useIntersection"
import { useDebounce } from "../../hooks/useDebounce"
import LoadingIndicator from "@components/LoadingIndicator"
import BranchPlaceholderImage from "@assets/images/BranchPlaceholderImage.png"
import { Image } from "@components/common/Image"
import SearchIcon from "@components/icons/SearchIcon"

interface MembershipBranchListProps {
  onSelect?: (branch: Branch) => void
  query?: string
  memberShipId?: string
}

const MembershipBranchList = ({
  onSelect,
  query,
  memberShipId,
}: MembershipBranchListProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { location: geolocationLocation, error: _ } = useGeolocation()
  const { setSelectedBranch } = useReservationFormStore()

  const debouncedQuery = useDebounce(query, 300)
  const s_idx = location.state?.s_idx ?? location.state?.membershipId

  const {
    data: branchPages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    isFetching,
  } = useBranches({
    latitude: geolocationLocation?.latitude,
    longitude: geolocationLocation?.longitude,
    search: debouncedQuery,
    brandCode: undefined,
    mp_idx: memberShipId || location.state?.selectedItem,
    s_idx: s_idx,
    isConsultation: location.state?.isConsultation,
    enabled: !!geolocationLocation,
  })

  const branches = branchPages?.pages.flatMap((page) => page.body.result) ?? []

  // 서버에서 이미 필터링된 결과를 사용
  const filteredBranches = branches

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  const handleBranchSelect = (branch: BranchSearchResult | Branch) => {
    const branchData: Branch =
      "b_idx" in branch && "b_name" in branch
        ? {
            b_idx: branch.b_idx,
            name: branch.b_name,
            address: branch.b_addr,
            latitude: Number(branch.b_lat),
            longitude: Number(branch.b_lon),
            canBookToday: branch.reserve === "Y",
            distanceInMeters: branch.distance,
            isFavorite: branch.b_bookmark === "Y",
            brandCode: branch.brand_code,
            brand: "therapist",
          }
        : branch

    if (onSelect) {
      onSelect(branchData)
    } else {
      setSelectedBranch(branchData)
      navigate(-1)
    }
  }

  // 지점 목록 렌더링 컴포넌트 추출
  const renderBranchList = (branches: BranchSearchResult[]) => (
    <ul className="overflow-y-scroll h-full divide-y divide-gray-100">
      {branches.map((branch) => (
        <li key={branch.b_idx}>
          <button
            onClick={() => handleBranchSelect(branch)}
            className="w-full px-5 py-4 gap-4 flex items-stretch  rounded"
            aria-label={`${branch.b_name} 선택`}
          >
            <Image
              className="border border-gray-100 rounded-xl h-[88px] aspect-square object-cover"
              src={BranchPlaceholderImage}
              alt="지점 사진"
            />
            <div className="w-full flex flex-col">
              <div className="mt-0.5 text-start">
                <p className="font-b text-16px">{branch.b_name}</p>
              </div>
              <div className="flex items-center gap-[2.5px]">
                {branch.distance && (
                  <p className="font-r text-12px text-gray-400">
                    {branch.distance}
                  </p>
                )}
              </div>
              <p className="font-r text-14px text-start">{branch.b_addr}</p>
            </div>
          </button>
        </li>
      ))}
      <div ref={observerTarget} className="h-1" />
    </ul>
  )

  // 초기 데이터 로딩 상태 (완전히 빈 상태일 때)
  if (isLoading && !branches.length) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <LoadingIndicator />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center text-gray-500">
          {error instanceof Error
            ? error.message
            : "지점 목록을 불러오는데 실패했습니다"}
        </div>
      </div>
    )
  }

  // 검색 결과 불러오는 중인 경우 (초기 로딩 이후 검색 시 로딩)
  if (debouncedQuery && isFetching && !isFetchingNextPage) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingIndicator />
      </div>
    )
  }

  if (filteredBranches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 min-h-[200px] mt-8">
        <div className="mb-4 p-3 rounded-full bg-gray-100">
          <SearchIcon className="w-6 h-6 text-gray-400" />
        </div>
        <p className="font-m text-16px text-gray-700 text-center">
          {"검색 결과가 없습니다"}
        </p>
        <p className="mt-2 font-r text-14px text-gray-500 text-center">
          {"다른 키워드로 검색해 보세요"}
        </p>
      </div>
    )
  }

  return renderBranchList(filteredBranches)
}

export default MembershipBranchList
