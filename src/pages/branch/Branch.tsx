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
import {
  useBranches,
  useBranchCategories,
} from "../../queries/useBranchQueries.tsx"
import { Branch as BranchType } from "../../types/Branch.ts"
import { useBrands } from "../../queries/useBrandQueries.tsx"
import { useGeolocation } from "../../hooks/useGeolocation.tsx"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import SearchIcon from "@components/icons/SearchIcon"
import CaretDownIcon from "@assets/icons/CaretDownIcon.svg?react"
import { useBranchLocationSelect } from "../../hooks/useBranchLocationSelect.ts"
import { DEFAULT_COORDINATE } from "../../types/Coordinate.ts"
import { useQueryClient } from "@tanstack/react-query"

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

  const queryClient = useQueryClient()
  const { data: brands } = useBrands()
  const { data: categories, isLoading: isCategoriesLoading } =
    useBranchCategories(selectedFilter.brand?.code)

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

  const address =
    result?.pages[0]?.body?.current_addr || "서울 강남구 테헤란로78길 14-10"
  const branches =
    result?.pages.flatMap((page) =>
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
    // 선택한 필터가 변경된 경우에만 상태 업데이트 및 API 호출
    const brandChanged = selectedFilter.brand?.code !== newFilter.brand?.code
    const categoryChanged =
      selectedFilter.category?.code !== newFilter.category?.code

    if (brandChanged || categoryChanged) {
      // 상태 업데이트
      setSelectedFilter(newFilter)

      // 브랜드가 변경된 경우 카테고리 캐시 무효화
      if (brandChanged) {
        queryClient.invalidateQueries({
          queryKey: ["branches", "categories"],
        })
      }

      // 지점 목록 다시 조회
      refetch()
    }
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

  const handleBranchSelect = (branch: BranchType) => {
    if (location.state?.returnPath) {
      navigate(location.state.returnPath, {
        state: {
          ...location.state,
          selectedBranch: branch,
        },
      })
    } else {
      navigate(`/branch/${branch.b_idx}`)
    }
  }

  // 브랜드 변경 처리 함수
  const handleBrandChange = (brand: FilterItem | null) => {
    if (selectedFilter.brand?.code !== brand?.code) {
      // 상태 업데이트만 하고 API 직접 호출은 하지 않음
      setSelectedFilter({
        brand,
        category: null,
      })

      // branches 목록을 즉시 새로고침하지 않음
      // useEffect 의존성으로 인해 brand가 변경되면 자동으로 categories 쿼리가 실행됨
    }
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
                  categories={categories || []}
                  isLoading={isCategoriesLoading}
                  currentFilter={selectedFilter}
                  onApply={handleFilterChange}
                  onBrandChange={handleBrandChange}
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
  }, [selectedFilter, brands, address, categories, isCategoriesLoading])

  const renderScreen = () => {
    switch (screen) {
      case "list":
        return (
          <BranchFilterList
            branches={branches}
            totalCount={result?.pages[0]?.total_count || 0}
            onIntersect={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
            onSelectBranch={handleBranchSelect}
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
    <div className="relative flex flex-col h-screen">
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
