import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { EmptyCard } from "../../components/EmptyCard.tsx"
import LoadingIndicator from "../../components/LoadingIndicator.tsx"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import { useGeolocation } from "../../hooks/useGeolocation.tsx"
import {
  useBranchBookmarksQuery,
  useBranchUnbookmarkMutation,
} from "../../queries/useBranchQueries.tsx"
import { Branch } from "../../types/Branch.ts"
import { BranchFilterListItem } from "../branch/_fragments/BranchFilterList.tsx"

const FavoritePage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { location, loading: locationLoading } = useGeolocation()
  const { data, isLoading: branchesLoading } = useBranchBookmarksQuery(location)
  const { mutate: removeBookmark } = useBranchUnbookmarkMutation()
  const { showToast } = useOverlay()

  const favoriteBranches = data?.branches || []

  useEffect(() => {
    setHeader({
      display: true,
      title: "즐겨찾는 지점",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: true })
  }, [setHeader, setNavigation])

  const handleBranchClick = (branch: Branch) => {
    navigate(`/branch/${branch.b_idx}`)
  }

  const handleToggleFavorite = (branch: Branch) => {
    removeBookmark(branch.b_idx, {
      onSuccess: () => {
        showToast("즐겨찾기에서 삭제했어요.")
      },
    })
  }

  if (locationLoading || branchesLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <LoadingIndicator />
      </div>
    )
  }

  if (!favoriteBranches.length) {
    return (
      <div className="h-screen bg-white p-5">
        <EmptyCard title="관심있는 지점을 즐겨찾기에 추가해보세요" />
      </div>
    )
  }

  return (
    <div className="h-screen max-h-full bg-white">
      <div className="px-5 mt-4 overflow-hidden pb-[82px]">
        <p className="font-m text-14px">
          {"총 "}
          <span>{favoriteBranches.length}</span>
          {"개의 즐겨찾는 지점이 있습니다."}
        </p>
        <ul className="divide-y">
          {favoriteBranches.map((branch) => (
            <BranchFilterListItem
              key={branch.b_idx}
              branch={branch}
              onClick={handleBranchClick}
              onClickFavorite={handleToggleFavorite}
              isFavorite={branch.isFavorite ?? true}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FavoritePage
