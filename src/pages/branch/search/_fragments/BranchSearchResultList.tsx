import BranchCard from "@components/BranchCard.tsx"
import useDebounce from "../../../../hooks/useDebounce.tsx"
import { useBranches } from "../../../../queries/useBranchQueries.tsx"
import { useGeolocation } from "../../../../hooks/useGeolocation.tsx"
import { DEFAULT_COORDINATE } from "../../../../types/Coordinate.ts"
import useIntersection from "../../../../hooks/useIntersection.tsx"
import { Branch } from "../../../../types/Branch.ts"

interface BranchSearchResultListProps {
  query: string
  onSelect: (branch: Branch) => void
}

const BranchSearchResultList = ({
  query,
  onSelect,
}: BranchSearchResultListProps) => {
  const debouncedQuery = useDebounce(query, 300)
  const { location } = useGeolocation()
  const {
    data: branchPages,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useBranches({
    page: 1,
    latitude: location?.latitude || DEFAULT_COORDINATE.latitude,
    longitude: location?.longitude || DEFAULT_COORDINATE.longitude,
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

  if (!isLoading && branches.length === 0) {
    return <p className={"self-center mt-40"}>{"검색 결과가 없습니다."}</p>
  }

  return (
    <ul className={"divide-y divide-gray-100 px-5 overflow-y-scroll"}>
      {branches.map((branch, index) => (
        <li key={index} className={"py-4"} onClick={() => onSelect(branch)}>
          <BranchCard name={branch.name} address={branch.address} />
        </li>
      ))}
      <div ref={observerTarget} className={"h-4"} />
    </ul>
  )
}

export default BranchSearchResultList
