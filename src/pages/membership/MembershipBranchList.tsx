import { Branch, BranchSearchResult } from "../../types/Branch.ts"
import { MembershipActiveBranchList } from "./_fragments/MembershipActiveBranchList.tsx"
import BranchPlaceholderImage from "@assets/images/BranchPlaceholderImage.png"
import { useLocation, useNavigate } from "react-router-dom"
import { useGeolocation } from "../../hooks/useGeolocation.tsx"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions.ts"
import { DEFAULT_COORDINATE } from "../../types/Coordinate.ts"
import { useBranches } from "../../queries/useBranchQueries.tsx"
import useIntersection from "../../hooks/useIntersection.tsx"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { Image } from "@components/common/Image"
import { BranchInfo } from "../../types/Membership.ts"

interface MembershipBranchListProps {
  onSelect?: (branch: Branch) => void
  query?: string
}

const DEFAULT_BRAND_CODE = "001" // 약손명가

const MembershipBranchList = ({
  onSelect,
  query,
}: MembershipBranchListProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { location: geolocationLocation, error: _ } = useGeolocation()
  const { setSelectedBranch, setIsBottomSheetOpen } =
    useMembershipOptionsStore()

  const coordinates = geolocationLocation
    ? {
        latitude: geolocationLocation.latitude,
        longitude: geolocationLocation.longitude,
      }
    : DEFAULT_COORDINATE

  const {
    data: branchPages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useBranches({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    search: query,
    brandCode: location.state?.brand_code || DEFAULT_BRAND_CODE,
    mp_idx: location.state?.selectedItem,
  })

  const branches = branchPages?.pages.flatMap((page) => page.body.result) || []

  // 사용 가능한 지점 목록이 지정된 경우 해당 지점만 필터링
  const availableBranches: BranchInfo[] =
    location.state?.availableBranches || []

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
      if (location.state?.returnPath) {
        navigate(location.state.returnPath, {
          state: {
            ...location.state,
            selectedBranch: branchData,
          },
        })
      } else {
        setIsBottomSheetOpen(true)
        navigate(-1)
      }
    }
  }

  // 지점 목록 렌더링 컴포넌트 추출
  const renderBranchList = (branches: BranchSearchResult[]) => (
    <ul className="overflow-y-scroll h-full divide-y divide-gray-100">
      {branches.map((branch) => (
        <li key={branch.b_idx}>
          <button
            className="w-full px-5 py-4 gap-4 flex items-stretch"
            onClick={() => handleBranchSelect(branch)}
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
                {branch.reserve === "Y" && (
                  <>
                    <p className="font-r text-12px text-tag-green">
                      당일 예약 가능
                    </p>
                    <div className="w-0.5 h-0.5 rounded-xl bg-gray-400" />
                  </>
                )}
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

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  // 검색어가 없고 사용 가능한 지점 목록이 있으면 해당 지점만 표시
  if (query?.length === 0) {
    // 사용 가능한 지점이 있는 경우 바로 지점 목록을 보여줌
    if (availableBranches.length > 0) {
      return renderBranchList(filteredBranches)
    }
    // 사용 가능한 지점이 없는 경우 기존 활성 지점 목록 표시
    return <MembershipActiveBranchList onBranchSelect={handleBranchSelect} />
  }

  if (filteredBranches.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">검색 결과가 없습니다.</div>
    )
  }

  return renderBranchList(filteredBranches)
}

export default MembershipBranchList
