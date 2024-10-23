import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { Header } from "@components/Header.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import BranchFilterBottomSheet, { FilterItem } from "./_fragments/BranchFilterBottomSheet.tsx"
import BranchFilterSection from "./_fragments/BranchFilterSection.tsx"
import BranchFilterList from "./_fragments/BranchFilterList.tsx"
import { MockBranches } from "../../types/Branch.ts"

const Branch = () => {
  const { setHeader } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const [selectedFilter, setSelectedFilter] = useState<{
    brand: FilterItem | null,
    category: FilterItem | null,
  }>({
    brand: null,
    category: null,
  })

  useEffect(() => {
    setHeader({
      component: <BranchHeader />,
      display: true,
    })
  }, [])

  return (
    <div>
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
      <BranchFilterList branches={MockBranches} />
    </div>
  )
}

const BranchHeader = () => {
  return (
    <Header
      type="location"
      title="서울 강남구 테헤란로78길 14-10"
      onClickLocation={() => {
        alert("Location Clicked")
      }}
      onClickLeft={() => {
        alert("Left Icon Clicked")
      }}
      onClickRight={() => {
        alert("Right Icon Clicked")
      }}
    />
  )
}

export default Branch

const MockFilters: {
  brands: FilterItem[],
  categories: FilterItem[],
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
