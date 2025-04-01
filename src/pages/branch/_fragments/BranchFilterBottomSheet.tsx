import { Divider } from "@mui/material"
import CloseIcon from "@assets/icons/CloseIcon.svg?react"
import { Filter } from "@components/Filter.tsx"
import { useState, useEffect } from "react"
import { Button } from "@components/Button.tsx"
import ReloadIcon from "@components/icons/ReloadIcon.tsx"
import LoadingIndicator from "@components/LoadingIndicator.tsx"

export type FilterItem = {
  code: string
  title: string
}

interface BranchFilterBottomSheetProps {
  brands: FilterItem[]
  categories: FilterItem[]
  currentFilter: { brand: FilterItem | null; category: FilterItem | null }
  isLoading?: boolean
  onApply: ({
    brand,
    category,
  }: {
    brand: FilterItem | null
    category: FilterItem | null
  }) => void
  onBrandChange?: (brand: FilterItem | null) => void
  onClose: () => void
}

const BranchFilterBottomSheet = ({
  brands,
  categories,
  currentFilter,
  isLoading = false,
  onApply: performApply,
  onBrandChange,
  onClose: performClose,
}: BranchFilterBottomSheetProps) => {
  const [filter, setFilter] = useState<{
    brand: FilterItem | null
    category: FilterItem | null
  }>(currentFilter)

  // currentFilter가 변경될 때 내부 filter 상태 업데이트
  useEffect(() => {
    setFilter(currentFilter)
  }, [currentFilter])

  // 브랜드 변경 시 부모 컴포넌트에 알림
  const handleBrandChange = (brand: FilterItem | null) => {
    // 내부 상태 즉시 업데이트
    setFilter((prev) => ({ ...prev, brand, category: null }))
    // 부모 컴포넌트에 알림
    onBrandChange?.(brand)
  }

  return (
    <div className={"flex flex-col items-center h-[541px]"}>
      <div className="w-full px-5">
        <BranchFilterBottomSheetHeader onClose={performClose} />
      </div>

      <div className="w-full overflow-y-auto flex-1 px-5">
        <div className={"flex flex-col items-center gap-5 w-full py-5"}>
          <BranchFilterDivider />
          <BranchFilterBottomSheetWrap
            label={"브랜드 별"}
            items={brands}
            selectedItem={filter.brand}
            onSelect={handleBrandChange}
          />
          <BranchFilterDivider />
          <BranchFilterBottomSheetWrap
            key={`category-${filter.brand?.code || "all"}`}
            label={"카테고리 별"}
            items={
              filter.brand?.code
                ? categories.filter((cat) =>
                    cat.code.startsWith(filter.brand!.code),
                  )
                : categories
            }
            selectedItem={filter.category}
            isLoading={isLoading}
            onSelect={(category) => setFilter({ ...filter, category })}
          />
        </div>
      </div>

      <div className="w-full px-5 mt-auto">
        <BranchFilterBottomSheetFooter
          onInitialize={() => {
            setFilter({ brand: null, category: null })
            onBrandChange?.(null)
          }}
          onApply={() => {
            performApply(filter)
            performClose()
          }}
        />
      </div>
    </div>
  )
}

const BranchFilterBottomSheetHeader = ({
  onClose,
}: {
  onClose: () => void
}) => (
  <>
    <Divider
      sx={{
        width: "52px",
        height: "1.5px",
        borderRadius: "100px",
        bgcolor: "gray.200",
        margin: "0 auto",
      }}
    />
    <div className={"w-full"}>
      <div className={"flex justify-between"}>
        <p className={"font-sb text-18px"}>{"지점 필터"}</p>
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  </>
)

const BranchFilterDivider = () => (
  <div className={"w-full bg-gray-100 h-[1px]"} />
)

const BranchFilterBottomSheetWrap = ({
  label,
  items,
  selectedItem,
  isLoading = false,
  onSelect,
}: {
  label: string
  items: FilterItem[]
  selectedItem: FilterItem | null
  isLoading?: boolean
  onSelect: (item: FilterItem | null) => void
}) => {
  return (
    <div className={"flex flex-col w-full items-start gap-3"}>
      <p className={"text-start font-sb text-16px"}>{label}</p>
      {isLoading ? (
        <div className="flex justify-center items-center w-full py-4">
          <LoadingIndicator size={32} />
        </div>
      ) : items.length > 0 ? (
        <div className={"flex flex-wrap gap-2"}>
          <Filter
            type={"default"}
            state={!selectedItem ? "active" : "default"}
            label={"전체"}
            onClick={() => onSelect(null)}
          />
          {items.map((item, index) => (
            <Filter
              key={index}
              type={"default"}
              state={item.code === selectedItem?.code ? "active" : "default"}
              label={item.title}
              onClick={() => onSelect(item)}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full py-4 text-gray-500">
          {label === "카테고리 별" && items.length === 0
            ? "카테고리 정보가 없습니다"
            : "데이터가 없습니다"}
        </div>
      )}
    </div>
  )
}

const BranchFilterBottomSheetFooter = ({
  onInitialize,
  onApply,
}: {
  onInitialize: () => void
  onApply: () => void
}) => {
  return (
    <div className={"w-full flex justify-around gap-2 pb-8 mt-[30px]"}>
      <Button
        className={"w-1/2 rounded-xl"}
        variantType={"line"}
        iconLeft={<ReloadIcon htmlColor={"#F37165"} />}
        onClick={onInitialize}
      >
        {"초기화"}
      </Button>
      <Button
        className={"w-1/2 rounded-xl"}
        variantType={"primary"}
        onClick={onApply}
      >
        {"적용하기"}
      </Button>
    </div>
  )
}

export default BranchFilterBottomSheet
