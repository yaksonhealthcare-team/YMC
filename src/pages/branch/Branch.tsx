import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { Header } from "@components/Header.tsx"
import { Filter } from "@components/Filter.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import BranchFilterBottomSheet from "./_fragments/BranchFilterBottomSheet.tsx"

const Branch = () => {
  const { setHeader } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const [selectedFilter, setSelectedFilter] = useState<Filters>({ brand: null, category: null })

  useEffect(() => {
    setHeader({
      component: <BranchHeader />,
      display: true,
    })
  }, [])

  return (
    <div className={"flex flex-col"}>
      <FilterSection
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

const FilterSection = ({
  currentFilter,
  onClick,
  onInitialize: performInitialize,
}: {
  currentFilter: Filters,
  onClick: () => void,
  onInitialize: () => void,
}) => {
  return (
    <div className={"flex overflow-x-auto px-5 py-2 "}>
      <div className={"flex flex-none gap-2"}>
        {(currentFilter.brand || currentFilter.category) && (
          <Filter type={"reload"} onClick={performInitialize} />
        )}
        <Filter
          type={"arrow"}
          state={!currentFilter.brand ? "default" : "active"}
          label={currentFilter.brand?.title ?? "브랜드"}
          onClick={onClick}
        />
        <Filter
          type={"arrow"}
          state={!currentFilter.category ? "default" : "active"}
          label={currentFilter.category?.title ?? "카테고리"}
          onClick={onClick}
        />
      </div>
    </div>
  )
}

export default Branch

type Filters = {
  brand: Item | null,
  category: Item | null,
}

type Item = {
  id: string,
  title: string,
}

const MockFilters: {
  brands: Item[],
  categories: Item[],
} = {
  brands: [
    { id: "1", title: "약손명가" },
    { id: "2", title: "달리아 스파" },
    { id: "3", title: "여리한 다이어트" },
  ],
  categories: [
    { id: "1", title: "애스테틱" },
    { id: "2", title: "스파" },
    { id: "3", title: "다이어트" },
    { id: "4", title: "피부관리" },
  ],
}
