import { useEffect, useState } from "react"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import BranchSearchHeader from "./_fragments/BranchSearchHeader.tsx"
import ActiveBranchList from "./_fragments/ActiveBranchList.tsx"
import BranchSearchResultList from "./_fragments/BranchSearchResultList.tsx"

const BranchSearch = () => {
  const { setHeader, setNavigation } = useLayout()
  const [query, setQuery] = useState("")

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  return (
    <div className={"flex flex-col overflow-y-hidden"}>
      <BranchSearchHeader query={query} onChange={setQuery} />
      {query.length === 0 ? (
        <ActiveBranchList />
      ) : (
        <BranchSearchResultList query={query} />
      )}
    </div>
  )
}

export default BranchSearch
