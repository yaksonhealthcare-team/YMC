import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { Branch } from "../../types/Branch.ts"
import { BranchFilterListItem } from "../branch/_fragments/BranchFilterList.tsx"
import {
  useBranchBookmarksQuery,
  useBranchBookmarkMutation,
  useBranchUnbookmarkMutation,
} from "../../queries/useBranchQueries.tsx"
import { useNavigate } from "react-router-dom"
import { useGeolocation } from "../../hooks/useGeolocation.tsx"

const FavoritePage: React.FC = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { location, loading, error } = useGeolocation()
  const { data: favoriteBranches = [] } = useBranchBookmarksQuery(location)
  const { mutate: addBookmark } = useBranchBookmarkMutation()
  const { mutate: removeBookmark } = useBranchUnbookmarkMutation()

  useEffect(() => {
    setHeader({
      display: true,
      title: "즐겨찾는 지점",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  function handleBranchClick(branch: Branch) {
    navigate(`/branch/${branch.id}`)
  }

  function handleToggleFavorite(branch: Branch) {
    if (branch.isFavorite) {
      removeBookmark(branch.id)
    } else {
      addBookmark(branch.id)
    }
  }

  if (loading) {
    return (
      <div className="h-screen max-h-full bg-white p-5">
        <p>위치 정보를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen max-h-full bg-white p-5">
        <p>위치 정보를 불러올 수 없습니다.</p>
        <p className="text-gray-500 text-sm mt-2">{error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="h-screen max-h-full bg-white p-5">
        <div className="py-2 ">
          총 {favoriteBranches.length}개의 즐겨찾는 지점이 있습니다.
        </div>
        <div className="space-y-1">
          {favoriteBranches.map((branch) => (
            <BranchFilterListItem
              key={branch.id}
              branch={branch}
              onClick={(branch) => handleBranchClick(branch)}
              onClickFavorite={(branch) => handleToggleFavorite(branch)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default FavoritePage
