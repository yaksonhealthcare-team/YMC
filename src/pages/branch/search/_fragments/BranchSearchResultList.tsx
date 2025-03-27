import BranchCard from "@components/BranchCard.tsx"
import useDebounce from "../../../../hooks/useDebounce.tsx"
import { useBranches } from "../../../../queries/useBranchQueries.tsx"
import { useGeolocation } from "../../../../hooks/useGeolocation.tsx"
import useIntersection from "../../../../hooks/useIntersection.tsx"
import { Branch } from "../../../../types/Branch.ts"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import SearchIcon from "@components/icons/SearchIcon"

interface BranchSearchResultListProps {
  query: string
  onSelect: (branch: Branch) => void
}

const BranchSearchResultList = ({
  query,
  onSelect,
}: BranchSearchResultListProps) => {
  const debouncedQuery = useDebounce(query, 300)
  const { location, loading: locationLoading } = useGeolocation()

  const {
    data: branchPages,
    isLoading: branchesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useBranches({
    page: 1,
    latitude: location?.latitude,
    longitude: location?.longitude,
    brandCode: "",
    search: debouncedQuery,
  })

  const branches =
    branchPages?.pages.flatMap((page) =>
      page.body.result.map((branch) => ({
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
      })),
    ) || []

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  // 위치 정보를 로딩 중인 경우 로딩 표시
  if (locationLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <LoadingIndicator />
        <p className="mt-4 text-gray-500">
          {"위치 정보를 불러오는 중입니다..."}
        </p>
      </div>
    )
  }

  // 지점 데이터 로딩 중이고 결과가 없는 경우
  if (branchesLoading && branches.length === 0) {
    return <LoadingIndicator className="self-center mt-40" />
  }

  // 검색 결과가 없는 경우
  if (!branchesLoading && branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 h-full">
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

  return (
    <div className="h-full overflow-y-auto">
      <ul className="divide-y divide-gray-100 px-5">
        {branches.map((branch, index) => (
          <li key={index} className="py-4" onClick={() => onSelect(branch)}>
            <BranchCard name={branch.name} address={branch.address} />
          </li>
        ))}
        <div ref={observerTarget} className="h-4" />
      </ul>
    </div>
  )
}

export default BranchSearchResultList
