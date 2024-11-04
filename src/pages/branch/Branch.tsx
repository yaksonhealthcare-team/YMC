import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { Header } from "@components/Header.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import BranchFilterBottomSheet, { FilterItem } from "./_fragments/BranchFilterBottomSheet.tsx"
import BranchFilterSection from "./_fragments/BranchFilterSection.tsx"
import BranchFilterList from "./_fragments/BranchFilterList.tsx"
import { MockBranches } from "../../types/Branch.ts"
import { SearchFloatingButton } from "@components/SearchFloatingButton.tsx"
import { useLocation, useNavigate } from "react-router-dom"
import BranchMapSection from "./_fragments/BranchMapSection.tsx"

const Branch = () => {
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const [screen, setScreen] = useState<"list" | "map">("list")
  const [selectedFilter, setSelectedFilter] = useState<{
    brand: FilterItem | null
    category: FilterItem | null
  }>({
    brand: null,
    category: null,
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

  useEffect(() => {
    setHeader({
      component: (
        <div>
          <BranchHeader
            onBack={handleNavigateToBack}
            onClickLocation={() => {}}
            onSearch={() => {}}
          />
          <BranchFilterSection
            currentFilter={selectedFilter}
            onInitialize={() => setSelectedFilter({ brand: null, category: null })}
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
        return <BranchFilterList branches={MockBranches} />
      case "map":
        return <BranchMapSection />
    }
  }

  return (
    <div className={"relative pt-12"}>
      {renderScreen()}
      <div className={"fixed bottom-10 left-1/2 -translate-x-1/2"}>
        <SearchFloatingButton
          type={screen === "list" ? "search" : "list"}
          title={screen === "list" ? "지도보기" : "목록보기"}
          onClick={() => {
            if (screen === "list") {
              setScreen("map")
            } else {
              setScreen("list")
            }
          }}
        />
      </div>
    </div>
  )
}

const BranchHeader = ({ onBack, onSearch, onClickLocation }: {
  onBack: () => void,
  onSearch: () => void,
  onClickLocation: () => void,
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
