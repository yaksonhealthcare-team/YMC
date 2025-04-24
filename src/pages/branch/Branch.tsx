import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState, useRef } from "react"
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
import clsx from "clsx"

// 기본 주소 상수 정의
const DEFAULT_ADDRESS = "서울특별시 중구 세종대로 110"

const Branch = () => {
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay, showToast } = useOverlay()
  const {
    location: currentLocation,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation()
  const { location: selectedLocation } = useBranchLocationSelect()
  const [screen, setScreen] = useState<"list" | "map">("list")
  const [selectedBranch, setSelectedBranch] = useState<BranchType | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const prevSelectedLocationRef = useRef(selectedLocation)
  const [selectedFilter, setSelectedFilter] = useState<{
    latitude?: number
    longitude?: number
    brand: FilterItem | null
    category: FilterItem | null
    enabled: boolean
  }>({
    brand: null,
    category: null,
    latitude: undefined,
    longitude: undefined,
    enabled: false,
  })

  const queryClient = useQueryClient()
  const { data: brands } = useBrands()
  const routeLocation = useLocation()

  // 위치 정보가 로드되면 필터 업데이트
  useEffect(() => {
    if (locationLoading) {
      return
    }

    // 우선순위 변경: 1) 선택된 위치, 2) 현재 위치, 3) 에러 및 디폴트 위치
    if (selectedLocation?.coords) {
      // 사용자가 선택한 위치가 있는 경우 (최우선)
      setSelectedFilter((prev) => ({
        ...prev,
        latitude: selectedLocation.coords.latitude,
        longitude: selectedLocation.coords.longitude,
        enabled: true,
      }))
    } else if (currentLocation && !locationError) {
      // 현재 위치를 사용할 수 있는 경우 (두 번째 우선순위)
      setSelectedFilter((prev) => ({
        ...prev,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        enabled: true,
      }))
    } else if (locationError) {
      // 위치 정보를 불러올 수 없을 때 (마지막 우선순위)
      showToast("위치 정보를 불러올 수 없습니다")

      // 기본 좌표로 설정 (서울시청)
      setSelectedFilter((prev) => ({
        ...prev,
        latitude: 37.5665,
        longitude: 126.978,
        enabled: true,
      }))
    }

    // 초기 로딩이 완료되면 isInitialLoad 상태 업데이트
    if (isInitialLoad) {
      // 약간의 지연을 주어 위치 정보가 표시된 후 변경되도록 함
      setTimeout(() => {
        setIsInitialLoad(false)
      }, 1000)
    }
  }, [locationLoading, locationError, currentLocation, selectedLocation])

  // selectedLocation이 변경되었을 때 API 새로 호출
  useEffect(() => {
    // 최초 렌더링 시 제외
    if (
      prevSelectedLocationRef.current !== selectedLocation &&
      selectedFilter.enabled
    ) {
      console.log("위치 변경 감지: API 재호출", selectedLocation)

      // 선택된 위치가 있으면 필터 업데이트
      if (selectedLocation?.coords) {
        setSelectedFilter((prev) => ({
          ...prev,
          latitude: selectedLocation.coords.latitude,
          longitude: selectedLocation.coords.longitude,
          enabled: true,
        }))
      }

      // API 새로 호출
      refetch()
    }

    // 참조 업데이트
    prevSelectedLocationRef.current = selectedLocation
  }, [selectedLocation])

  // 위치 설정 페이지에서 돌아왔을 때 감지
  useEffect(() => {
    // 이전 페이지가 위치 설정 페이지일 경우
    if (
      routeLocation.state?.from === "/branch/location" ||
      routeLocation.state?.from === "/branch/location/picker"
    ) {
      console.log("위치 설정 페이지에서 돌아옴: API 재호출", selectedLocation)

      // 선택된 위치가 있으면 필터 업데이트
      if (selectedLocation?.coords) {
        setSelectedFilter((prev) => ({
          ...prev,
          latitude: selectedLocation.coords.latitude,
          longitude: selectedLocation.coords.longitude,
          enabled: true,
        }))
      }

      // API 새로 호출
      refetch()
    }
  }, [routeLocation.state])

  const {
    data: branchPaginationData,
    isLoading: branchesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useBranches({
    latitude: selectedFilter.latitude,
    longitude: selectedFilter.longitude,
    brandCode: selectedFilter.brand?.code,
    category: selectedFilter.category?.code,
    enabled: selectedFilter.enabled,
  })

  // 로딩 상태 계산 - 위치 로딩 중이거나 API 호출 중이거나 초기 로드 중인 경우
  const isLoading =
    locationLoading || (selectedFilter.enabled && branchesLoading) || isFetching

  // 현재 표시할 주소 결정
  const displayAddress = () => {
    // 페이지 초기 진입 시 '현재 위치'로 표시
    if (isInitialLoad) {
      return "현재 위치"
    }

    // 사용자가 선택한 위치가 있는 경우 (최우선)
    if (selectedLocation?.address) {
      return selectedLocation.address
    }

    // API에서 받아온 주소가 있는 경우 (두 번째 우선순위)
    if (branchPaginationData?.pages[0]?.body?.current_addr) {
      return branchPaginationData.pages[0].body.current_addr
    }

    // 위치 정보 에러가 있는 경우 기본 주소 반환 (마지막 우선순위)
    return DEFAULT_ADDRESS
  }

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
      navigate("/", { replace: true })
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
    }))
    refetch()
    // 필터 초기화 시 선택된 지점 초기화
    setSelectedBranch(null)
  }

  const handleNavigateToLocationSettings = () => {
    navigate("/branch/location", {
      state: { from: location.pathname },
    })
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
                {displayAddress()}
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
      backgroundColor: "bg-white",
    })
    setNavigation({
      display: false,
    })
  }, [
    selectedFilter,
    brands,
    locationLoading,
    selectedLocation,
    locationError,
    branchPaginationData,
    screen,
    isInitialLoad,
  ])

  const handleMapMove = (newCenter: Coordinate) => {
    setSelectedFilter((prev) => ({
      ...prev,
      latitude: newCenter.latitude,
      longitude: newCenter.longitude,
    }))
    refetch()
  }

  // 위치 정보를 로딩 중이거나 API 로딩 중인 경우 로딩 표시
  if (locationLoading && !selectedFilter.enabled) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size={48} />
      </div>
    )
  }

  return (
    <div
      className={clsx(
        "flex flex-col w-full h-full",
        screen === "list" ? "pt-[48px]" : "pt-[0px]",
      )}
    >
      {screen === "list" ? (
        <BranchFilterList
          branches={branches}
          onIntersect={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage()
            }
          }}
          onSelectBranch={handleBranchSelect}
          isFetchingNextPage={isFetchingNextPage}
          branchesLoading={branchesLoading || locationLoading}
          totalCount={branchPaginationData?.pages[0].total_count}
        />
      ) : (
        <BranchMapSection
          brandCode={selectedFilter.brand?.code}
          category={selectedFilter.category?.code}
          onSelectBranch={setSelectedBranch}
          branches={branches}
          onMoveMap={handleMapMove}
          isLoading={isLoading}
        />
      )}
      <div
        className={clsx(
          "fixed left-1/2 -translate-x-1/2 z-10 transition-all duration-300",
          screen === "map" && selectedBranch
            ? "bottom-[calc(8rem+2rem)]"
            : "bottom-10",
        )}
      >
        <SearchFloatingButton
          type={screen === "list" ? "search" : "list"}
          title={screen === "list" ? "지도보기" : "목록보기"}
          onClick={() => {
            if (screen === "list") {
              setScreen("map")
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
