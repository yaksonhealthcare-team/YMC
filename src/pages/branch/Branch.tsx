import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { Header } from "@components/Header.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import BranchFilterBottomSheet, {
  FilterItem,
} from "./_fragments/BranchFilterBottomSheet.tsx"
import BranchFilterSection from "./_fragments/BranchFilterSection.tsx"
import BranchFilterList, {
  BranchFilterListItem,
} from "./_fragments/BranchFilterList.tsx"
import { SearchFloatingButton } from "@components/SearchFloatingButton.tsx"
import { useLocation, useNavigate } from "react-router-dom"
import BranchMapSection from "./_fragments/BranchMapSection.tsx"
import { useBranches } from "../../queries/useBranchQueries.tsx"
import { INITIAL_CENTER } from "@constants/LocationConstants.ts"
import { Branch as BranchType } from "../../types/Branch.ts"

const Branch = () => {
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const [screen, setScreen] = useState<"list" | "map">("list")
  const [selectedBranch, setSelectedBranch] = useState<BranchType | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<{
    brand: FilterItem | null
    category: FilterItem | null
  }>({
    brand: null,
    category: null,
  })

  const { data: branches } = useBranches({
    page: 1,
    latitude: INITIAL_CENTER.lat,
    longitude: INITIAL_CENTER.lng,
    brandCode: "001",
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

  const handleNavigateToLocationSettings = () => {
    navigate("/branch/location")
  }

  useEffect(() => {
    setHeader({
      component: (
        <div>
          <BranchHeader
            onBack={handleNavigateToBack}
            onClickLocation={handleNavigateToLocationSettings}
            onSearch={() => {}}
          />
          <BranchFilterSection
            currentFilter={selectedFilter}
            onInitialize={() =>
              setSelectedFilter({ brand: null, category: null })
            }
            onClick={() => {
              openBottomSheet(
                <BranchFilterBottomSheet
                  onClose={closeOverlay}
                  brands={MockFilters.brands}
                  categories={MockFilters.categories}
                  currentFilter={selectedFilter}
                  onApply={setSelectedFilter}
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
  }, [])

  const renderScreen = () => {
    switch (screen) {
      case "list":
        return <BranchFilterList branches={branches || []} />
      case "map":
        return (
          <BranchMapSection
            branches={branches || []}
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
      {screen === "map" && (
        <div
          className={`absolute w-full bottom-0 left-0 rounded-t-2xl bg-white z-[300] max-h-40 px-5 py-3 ${selectedBranch ? "transition-transform translate-y-0 duration-300 opacity-100" : "transition-transform opacity-0 translate-y-40 duration-300"}`}
        >
          {selectedBranch && (
            <BranchFilterListItem
              branch={selectedBranch}
              onClick={() => {
                navigate(`/branch/${selectedBranch.id}`)
              }}
              onClickFavorite={() => {
                console.log("FAVORITE")
              }}
            />
          )}
        </div>
      )}
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
  brands: FilterItem[]
  categories: FilterItem[]
} = {
  brands: [
    { code: "1", title: "약손명가" },
    { code: "2", title: "달리아 스파" },
    { code: "3", title: "여리한 다이어트" },
  ],
  categories: [
    { code: "1", title: "애스테틱" },
    { code: "2", title: "스파" },
    { code: "3", title: "다이어트" },
    { code: "4", title: "피부관리" },
  ],
}
