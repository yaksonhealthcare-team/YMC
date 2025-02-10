import { useEffect, useState } from "react"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import ActiveBranchList from "./_fragments/ActiveBranchList.tsx"
import BranchSearchResultList from "./_fragments/BranchSearchResultList.tsx"
import { SearchField } from "@components/SearchField.tsx"
import { useNavigate } from "react-router-dom"

const BranchSearch = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  useEffect(() => {
    setHeader({
      left: "back",
      title: "지점 검색",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className={"flex flex-col overflow-y-hidden"}>
      <div className={"px-5 pt-5 pb-6"}>
        <SearchField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={"지역 또는 지점명을 입력해주세요."}
        />
      </div>
      {query.length === 0 ? (
        <ActiveBranchList />
      ) : (
        <BranchSearchResultList
          query={query}
          onSelect={(branch) => navigate(`/branch/${branch.b_idx}`)}
        />
      )}
    </div>
  )
}

export default BranchSearch
