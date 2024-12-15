import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { Header } from "@components/Header.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import BranchFilterBottomSheet, {
  FilterItem,
} from "./_fragments/BranchFilterBottomSheet.tsx"
import BranchFilterSection from "./_fragments/BranchFilterSection.tsx"
import BranchFilterList from "./_fragments/BranchFilterList.tsx"
import { SearchFloatingButton } from "@components/SearchFloatingButton.tsx"
import { useLocation, useNavigate } from "react-router-dom"
import BranchMapSection from "./_fragments/BranchMapSection.tsx"
import { useBranches } from "../../queries/useBranchQueries.tsx"
import { INITIAL_CENTER } from "@constants/LocationConstants.ts"
import { Branch as BranchType } from "../../types/Branch.ts"
import { useBrands } from "../../queries/useBrandQueries.tsx"

const Branch = () => {
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const [screen, setScreen] = useState<"list" | "map">("map")
  const [selectedBranch, setSelectedBranch] = useState<BranchType | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<{
    brand: FilterItem | null
    category: FilterItem | null
  }>({
    brand: null,
    category: null,
  })

  const { data: brands } = useBrands()
  // TODO: Category API 추가되면 여기에 useCategory로 추가하기 (+ useEffect dependencies)

  const {
    data: branches,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBranches({
    latitude: INITIAL_CENTER.lat,
    longitude: INITIAL_CENTER.lng,
    brandCode: selectedFilter.brand?.code,
    category: selectedFilter.category?.code,
  })

  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigateToBack = () => {
    if (location.state?.from === "/") {
      navigate(-1)
    } else {
      navigate("/")
    }
  }

  const handleFilterChange = (newFilter: {
    brand: FilterItem | null
    category: FilterItem | null
  }) => {
    setSelectedFilter(newFilter)
    refetch()
  }

  const handleFilterReset = () => {
    setSelectedFilter({ brand: null, category: null })
    refetch()
  }

  const handleNavigateToLocationSettings = () => {
    navigate("/branch/location")
  }

  const handleNavigateToBranchSearch = () => {
    navigate("/branch/search")
  }

  useEffect(() => {
    setHeader({
      component: (
        <div>
          <BranchHeader
            onBack={handleNavigateToBack}
            onClickLocation={handleNavigateToLocationSettings}
            onSearch={handleNavigateToBranchSearch}
          />
          <BranchFilterSection
            currentFilter={selectedFilter}
            onInitialize={handleFilterReset}
            onClick={() => {
              openBottomSheet(
                <BranchFilterBottomSheet
                  onClose={closeOverlay}
                  brands={(brands || []).map((brand) => ({
                    title: brand.name,
                    code: brand.code,
                  }))}
                  categories={MockFilters.categories}
                  currentFilter={selectedFilter}
                  onApply={handleFilterChange}
                />,
              )
            }}
          />
        </div>
      ),
      display: true,
    })
    setNavigation({
      display: false,
    })
  }, [selectedFilter, brands])

  const renderScreen = () => {
    switch (screen) {
      case "list":
        return (
          <BranchFilterList
            branches={branches?.pages.flatMap((page) => page) || []}
            onIntersect={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
          />
        )
      case "map":
        return (
          <BranchMapSection
            branches={branches?.pages.flatMap((page) => page) || []}
            onSelectBranch={setSelectedBranch}
          />
        )
    }
  }

  return (
    <div className={"relative flex flex-col flex-1 pt-12"}>
      {renderScreen()}
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 ${selectedBranch ? "transition-transform -translate-y-32 duration-300" : "transition-transform translate-y-0 duration-300"}`}
      >
        <SearchFloatingButton
          type={screen === "list" ? "search" : "list"}
          title={screen === "list" ? "지도보기" : "목록보기"}
          onClick={() => {
            if (screen === "list") {
              setScreen("map")
            } else {
              setSelectedBranch(null)
              setScreen("list")
            }
          }}
        />
      </div>
    </div>
  )
}

const BranchHeader = ({
  onBack,
  onSearch,
  onClickLocation,
}: {
  onBack: () => void
  onSearch: () => void
  onClickLocation: () => void
}) => {
  return (
    <Header
      type="location"
      title="서울 강남구 테헤란로78길 14-10"
      onClickLocation={onClickLocation}
      onClickLeft={onBack}
      onClickRight={onSearch}
    />
  )
}

export default Branch

const MockFilters: {
  categories: FilterItem[]
} = {
  categories: [
    { code: "1", title: "애스테틱" },
    { code: "2", title: "스파" },
    { code: "3", title: "다이어트" },
    { code: "4", title: "피부관리" },
  ],
}
