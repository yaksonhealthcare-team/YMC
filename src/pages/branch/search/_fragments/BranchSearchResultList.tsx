import BranchCard from "@components/BranchCard.tsx"
import { useNavigate } from "react-router-dom"
import useDebounce from "../../../../hooks/useDebounce.tsx"
import { useBranches } from "../../../../queries/useBranchQueries.tsx"
import useGeolocation from "../../../../hooks/useGeolocation.tsx"
import { DEFAULT_COORDINATE } from "../../../../types/Coordinate.ts"

interface BranchSearchResultListProps {
  query: string
}

const BranchSearchResultList = ({ query }: BranchSearchResultListProps) => {
  const navigate = useNavigate()
  const debouncedQuery = useDebounce(query, 300)
  const { location } = useGeolocation()

  const { data: branches, isLoading } = useBranches({
    page: 1,
    latitude: location.latitude ?? DEFAULT_COORDINATE.latitude!,
    longitude: location.longitude ?? DEFAULT_COORDINATE.longitude!,
    brandCode: "",
    search: debouncedQuery,
  })

  if (!isLoading && branches?.length === 0) {
    return <p className={"self-center mt-40"}>{"검색 결과가 없습니다."}</p>
  }

  return (
    <ul className={"divide-y divide-gray-100 px-5 overflow-y-scroll"}>
      {(branches || []).map((branch, index) => (
        <li
          key={index}
          className={"py-4"}
          onClick={() => {
            navigate(`/branch/${branch.id}`)
          }}
        >
          <BranchCard name={branch.name} address={branch.address} />
        </li>
      ))}
    </ul>
  )
}

export default BranchSearchResultList
