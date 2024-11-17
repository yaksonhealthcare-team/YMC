import { Divider } from "@mui/material"
import CloseIcon from "@assets/icons/CloseIcon.svg?react"
import { Filter } from "@components/Filter.tsx"
import { useState } from "react"
import { Button } from "@components/Button.tsx"
import ReloadIcon from "@components/icons/ReloadIcon.tsx"

export type FilterItem = {
  code: string
  title: string
}

interface BranchFilterBottomSheetProps {
  brands: FilterItem[]
  categories: FilterItem[]
  currentFilter: { brand: FilterItem | null; category: FilterItem | null }
  onApply: ({
    brand,
    category,
  }: {
    brand: FilterItem | null
    category: FilterItem | null
  }) => void
  onClose: () => void
}

const BranchFilterBottomSheet = ({
  brands,
  categories,
  currentFilter,
  onApply: performApply,
  onClose: performClose,
}: BranchFilterBottomSheetProps) => {
  const [filter, setFilter] = useState<{
    brand: FilterItem | null
    category: FilterItem | null
  }>(currentFilter)

  return (
    <div className={"flex flex-col items-center gap-5 px-5"}>
      <BranchFilterBottomSheetHeader onClose={performClose} />
      <BranchFilterDivider />
      <BranchFilterBottomSheetWrap
        label={"브랜드 별"}
        items={brands}
        selectedItem={filter.brand}
        onSelect={(brand) => setFilter({ ...filter, brand: brand })}
      />
      <BranchFilterDivider />
      <BranchFilterBottomSheetWrap
        label={"카테고리 별"}
        items={categories}
        selectedItem={filter.category}
        onSelect={(category) => setFilter({ ...filter, category: category })}
      />
      <div className={"h-20"} />
      <BranchFilterBottomSheetFooter
        onInitialize={() => setFilter({ brand: null, category: null })}
        onApply={() => {
          performApply(filter)
          performClose()
        }}
      />
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
  onSelect,
}: {
  label: string
  items: FilterItem[]
  selectedItem: FilterItem | null
  onSelect: (item: FilterItem | null) => void
}) => {
  return (
    <div className={"flex flex-col w-full items-start gap-3"}>
      <p className={"text-start font-sb text-16px"}>{label}</p>
      <div className={"flex flex-wrap gap-2"}>
        <Filter
          type={"default"}
          state={!selectedItem ? "active" : "default"}
          label={"전체"}
          onClick={() => onSelect(null)}
        />
        {items.map((item) => (
          <Filter
            key={item.code}
            type={"default"}
            state={item.code === selectedItem?.code ? "active" : "default"}
            label={item.title}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
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
    <div className={"w-full flex justify-around gap-2"}>
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
