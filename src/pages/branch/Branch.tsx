import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
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
import { Branch as BranchType } from "../../types/Branch.ts"
import { useBrands } from "../../queries/useBrandQueries.tsx"
import { useGeolocation } from "../../hooks/useGeolocation.tsx"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import SearchIcon from "@components/icons/SearchIcon"
import CaretDownIcon from "@assets/icons/CaretDownIcon.svg?react"
import { useBranchLocationSelect } from "../../hooks/useBranchLocationSelect.ts"
import { DEFAULT_COORDINATE } from "../../types/Coordinate.ts"

const Branch = () => {
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const { location: currentLocation } = useGeolocation()
  const { location: selectedLocation } = useBranchLocationSelect()
  const [screen, setScreen] = useState<"list" | "map">("list")
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
    data: result,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBranches({
    latitude: (
      selectedLocation?.coords ??
      (currentLocation || DEFAULT_COORDINATE)
    ).latitude,
    longitude: (
      selectedLocation?.coords ??
      (currentLocation || DEFAULT_COORDINATE)
    ).longitude,
    brandCode: selectedFilter.brand?.code,
    category: selectedFilter.category?.code,
  })

  const address = result?.pages[0].address || "서울 강남구 테헤란로78길 14-10"
  const branches = result?.pages.flatMap(({ branches }) => branches) || []

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
            address={selectedLocation?.address ?? address}
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
      backgroundColor: "bg-system-bg",
    })
    setNavigation({
      display: false,
    })
  }, [selectedFilter, brands, address])

  const renderScreen = () => {
    switch (screen) {
      case "list":
        return (
          <BranchFilterList
            branches={branches}
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
            brandCode={selectedFilter.brand?.code}
            category={selectedFilter.category?.code}
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
  address,
  onBack,
  onSearch,
  onClickLocation,
}: {
  address: string
  onBack: () => void
  onSearch: () => void
  onClickLocation: () => void
}) => {
  return (
    <div
      className={"w-full justify-between flex px-5 py-3.5 bg-white h-12 gap-4"}
    >
      <button onClick={onBack}>
        <CaretLeftIcon className={"w-5 h-5"} />
      </button>
      <button className={"flex gap-2 items-center"} onClick={onClickLocation}>
        <p className={"font-sb text-14px overflow-ellipsis line-clamp-1"}>
          {address}
        </p>
        <CaretDownIcon className={"w-4 h-4"} />
      </button>
      <button onClick={onSearch}>
        <SearchIcon className={"w-6 h-6"} />
      </button>
    </div>
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
