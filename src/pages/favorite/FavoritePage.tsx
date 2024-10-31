import { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { Branch, MockBranches } from "../../types/Branch.ts"
import { BranchFilterListItem } from "../branch/_fragments/BranchFilterList.tsx"

interface FavoriteFilterItem {
  type: "location" | "brand" | "category"
  label: string
  value: string
}

const FavoritePage: React.FC = () => {
  const { setHeader, setNavigation } = useLayout()
  const [favoriteBranches, setFavoriteBranches] = useState<Branch[]>([])
  const [_, setFilterItems] = useState<FavoriteFilterItem[]>([])

  useEffect(() => {
    setHeader({
      display: true,
      title: "즐겨찾는 지점",
    })
    setNavigation({ display: true })

    // 즐겨찾는 지점 목록을 가져오는 로직 추가
    setFavoriteBranches(MockBranches.filter((branch) => branch.isFavorite))

    // 필터 아이템 초기화
    const initialFilterItems: FavoriteFilterItem[] = [
      { type: "location", label: "서울", value: "seoul" },
      { type: "brand", label: "약손명가", value: "yakson" },
      { type: "category", label: "스파", value: "spa" },
    ]
    setFilterItems(initialFilterItems)
  }, [setHeader, setNavigation])

  // const handleFilterToggle = (filterItem: FavoriteFilterItem) => {
  //   if (selectedFilters.some((f) => f.value === filterItem.value)) {
  //     setSelectedFilters(
  //       selectedFilters.filter((f) => f.value !== filterItem.value),
  //     )
  //   } else {
  //     setSelectedFilters([...selectedFilters, filterItem])
  //   }
  // }
  //
  // const handleFilterReset = () => {
  //   setSelectedFilters([])
  // }

  function handleBranchClick(branch: Branch) {
    console.log("Branch clicked", branch)
  }

  function handleToggleFavorite(branch: Branch) {
    console.log("TOGGLE FAVORITE", branch)
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
