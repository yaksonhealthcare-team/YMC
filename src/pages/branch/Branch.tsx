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
import { useQueryClient } from "@tanstack/react-query"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { Coordinate } from "types/Coordinate.ts"

const Branch = () => {
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const { location: currentLocation, loading: locationLoading } =
    useGeolocation()
  const { location: selectedLocation } = useBranchLocationSelect()
  const [screen, setScreen] = useState<"list" | "map">("list")
  const [selectedBranch, setSelectedBranch] = useState<BranchType | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<{
    latitude?: number
    longitude?: number
    brand: FilterItem | null
    category: FilterItem | null
    enabled: boolean
  }>({
    brand: null,
    category: null,
    latitude: (selectedLocation?.coords || currentLocation)?.latitude,
    longitude: (selectedLocation?.coords || currentLocation)?.longitude,
    enabled: !!(selectedLocation?.coords || currentLocation),
  })

  const queryClient = useQueryClient()
  const { data: brands } = useBrands()
  // const { data: categories, isLoading: isCategoriesLoading } =
  //   useBranchCategories(selectedFilter.brand?.code)

  const {
    data: branchPaginationData,
    isLoading: branchesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useBranches({
    latitude: selectedFilter.latitude,
    longitude: selectedFilter.longitude,
    brandCode: selectedFilter.brand?.code,
    category: selectedFilter.category?.code,
    enabled: selectedFilter.enabled,
  })

  const address =
    branchPaginationData?.pages[0]?.body?.current_addr ||
    "서울 강남구 테헤란로78길 14-10"

  // 브랜드 코드와 브랜드 타입 매핑
  const getBrandType = (brandCode: string) => {
    switch (brandCode) {
      case "001":
        return "yakson"
      case "003":
        return "dalia"
      case "004":
        return "diet"
      default:
        return "therapist"
    }
  }

  const branches =
    branchPaginationData?.pages.flatMap((page) =>
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
        brand: getBrandType(branch.brand_code),
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
      setSelectedFilter((prev) => ({
        ...prev,
        brand: newFilter.brand,
        category: newFilter.category,
      }))

      // 브랜드가 변경된 경우 카테고리 캐시 무효화
      if (brandChanged) {
        queryClient.invalidateQueries({
          queryKey: ["branches", "categories", newFilter.brand?.code],
        })
      }

      // 지점 목록 다시 조회
      refetch()

      // 지도 화면에서도 필터링된 데이터가 즉시 반영되도록 selectedBranch 초기화
      setSelectedBranch(null)
    }
  }

  const handleFilterReset = () => {
    setSelectedFilter((prev) => ({
      ...prev,
      brand: null,
      category: null,
      enabled: false,
    }))
    refetch()
    // 필터 초기화 시 선택된 지점 초기화
    setSelectedBranch(null)
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
    // 카테고리 캐시 무효화
    queryClient.invalidateQueries({
      queryKey: ["branches", "categories", brand?.code],
    })

    // 상태 업데이트
    setSelectedFilter((prev) => ({
      ...prev,
      brand,
      category: null,
    }))

    // 지점 목록 다시 조회
    refetch()
  }

  useEffect(() => {
    setHeader({
      component: (
        <div>
          <div
            className={
              "w-full justify-between flex px-5 py-3.5 bg-white h-12 gap-4"
            }
          >
            <button onClick={handleNavigateToBack}>
              <CaretLeftIcon className={"w-5 h-5"} />
            </button>
            <button
              className={"flex gap-2 items-center"}
              onClick={handleNavigateToLocationSettings}
            >
              <p className={"font-sb text-14px overflow-ellipsis line-clamp-1"}>
                {selectedLocation?.address ?? address}
              </p>
              <CaretDownIcon className={"w-4 h-4"} />
            </button>
            <button onClick={handleNavigateToBranchSearch}>
              <SearchIcon className={"w-6 h-6"} />
            </button>
          </div>
          <div className="border-b border-gray-100">
            <BranchFilterSection
              currentFilter={{
                brand: selectedFilter.brand,
                category: selectedFilter.category,
              }}
              onInitialize={handleFilterReset}
              onClick={() => {
                openBottomSheet(
                  <BranchFilterBottomSheet
                    onClose={closeOverlay}
                    brands={(brands || []).map((brand) => ({
                      title: brand.name,
                      code: brand.code,
                    }))}
                    currentFilter={{
                      brand: selectedFilter.brand,
                      category: selectedFilter.category,
                    }}
                    onApply={handleFilterChange}
                    onBrandChange={handleBrandChange}
                  />,
                )
              }}
            />
          </div>
        </div>
      ),
      display: true,
      backgroundColor: "bg-system-bg",
    })
    setNavigation({
      display: false,
    })
  }, [
    selectedFilter,
    brands,
    address,
    // categories,
    // isCategoriesLoading,
    branchPaginationData?.pages[0]?.total_count,
    screen,
  ])

  const handleMapMove = (newCenter: Coordinate) => {
    setSelectedFilter((prev) => ({
      ...prev,
      latitude: newCenter.latitude,
      longitude: newCenter.longitude,
    }))
    refetch()
  }

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
            onSelectBranch={handleBranchSelect}
            isLoading={branchesLoading}
            totalCount={branchPaginationData?.pages[0].total_count}
          />
        )
      case "map":
        return (
          <BranchMapSection
            brandCode={selectedFilter.brand?.code}
            category={selectedFilter.category?.code}
            onSelectBranch={setSelectedBranch}
            branches={branches}
            onMoveMap={handleMapMove}
          />
        )
    }
  }

  // 위치 정보를 로딩 중인 경우 로딩 표시
  if (locationLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div
      className={`relative flex flex-col h-screen ${screen === "list" ? "pt-[60px]" : "pt-[0px]"}`}
    >
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
              // 목록 화면에서 지도 화면으로 전환 시 선택된 지점은 초기화하되,
              // 필터는 그대로 유지
              setSelectedBranch(null)
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

export default Branch
