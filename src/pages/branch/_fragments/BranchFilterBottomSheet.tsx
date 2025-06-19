import CloseIcon from '@assets/icons/CloseIcon.svg?react';
import { Filter } from '@components/Filter.tsx';
import { useState, useEffect } from 'react';
import { Button } from '@components/Button.tsx';
import ReloadIcon from '@components/icons/ReloadIcon.tsx';
import LoadingIndicator from '@components/LoadingIndicator.tsx';

export type FilterItem = {
  code: string;
  title: string;
};

type FilterState = {
  brand: FilterItem | null;
  category: FilterItem | null;
};

interface BranchFilterBottomSheetProps {
  brands: FilterItem[];
  currentFilter: FilterState;
  onApply: (filter: FilterState) => void;
  onBrandChange?: (brand: FilterItem | null) => void;
  onClose: () => void;
}

const BranchFilterBottomSheet = ({
  brands,
  currentFilter,
  onApply: performApply,
  onBrandChange,
  onClose: performClose
}: BranchFilterBottomSheetProps) => {
  const [filter, setFilter] = useState<FilterState>(currentFilter);
  // const { data: categories = [], isLoading: isCategoriesLoading } =
  //   useBranchCategories(filter.brand?.code)

  useEffect(() => {
    setFilter(currentFilter);
  }, [currentFilter]);

  const handleBrandChange = (brand: FilterItem | null) => {
    setFilter((prev) => ({ ...prev, brand, category: null }));
  };

  // const handleCategoryChange = (category: FilterItem | null) => {
  //   setFilter((prev) => ({ ...prev, category }))
  // }

  const handleInitialize = () => {
    setFilter({ brand: null, category: null });
    onBrandChange?.(null);
  };

  const handleApply = () => {
    performApply(filter);
    performClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full px-5 py-4 bg-white sticky top-0 z-10">
        <BranchFilterBottomSheetHeader onClose={performClose} />
      </div>

      <div className="w-full flex-1 overflow-y-auto px-5">
        <div className="flex flex-col gap-6 w-full py-4">
          <BranchFilterDivider />
          <BranchFilterSection
            label="브랜드 별"
            items={brands}
            selectedItem={filter.brand}
            onSelect={handleBrandChange}
          />
          {/* <BranchFilterDivider /> */}
          {/* <BranchFilterSection
            key={`category-${filter.brand?.code || "all"}`}
            label="카테고리 별"
            items={categories}
            selectedItem={filter.category}
            isLoading={isCategoriesLoading}
            onSelect={handleCategoryChange}
          /> */}
        </div>
      </div>

      <div className="w-full px-5 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-10">
        <BranchFilterBottomSheetFooter onInitialize={handleInitialize} onApply={handleApply} />
      </div>
    </div>
  );
};

const BranchFilterBottomSheetHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="w-full">
    <div className="flex justify-between items-center">
      <p className="font-sb text-18px">지점 필터</p>
      <button onClick={onClose}>
        <CloseIcon />
      </button>
    </div>
  </div>
);

const BranchFilterDivider = () => <div className="w-full bg-gray-100 h-[1px]" />;

interface BranchFilterSectionProps {
  label: string;
  items: FilterItem[];
  selectedItem: FilterItem | null;
  isLoading?: boolean;
  onSelect: (item: FilterItem | null) => void;
}

const BranchFilterSection = ({ label, items, selectedItem, isLoading = false, onSelect }: BranchFilterSectionProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center w-full py-4">
          <LoadingIndicator size={32} />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex justify-center items-center w-full py-4 text-gray-500">
          {label === '카테고리 별' ? '카테고리 정보가 없습니다' : '데이터가 없습니다'}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 w-full">
        <Filter
          type="default"
          state={!selectedItem ? 'active' : 'default'}
          label="전체"
          onClick={() => onSelect(null)}
        />
        {items.map((item) => (
          <Filter
            key={item.code}
            type="default"
            state={item.code === selectedItem?.code ? 'active' : 'default'}
            label={item.title}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full items-start gap-3">
      <p className="text-start font-sb text-16px">{label}</p>
      {renderContent()}
    </div>
  );
};

interface BranchFilterBottomSheetFooterProps {
  onInitialize: () => void;
  onApply: () => void;
}

const BranchFilterBottomSheetFooter = ({ onInitialize, onApply }: BranchFilterBottomSheetFooterProps) => (
  <div className="w-full flex justify-around gap-2">
    <Button
      className="w-1/2 rounded-xl"
      variantType="line"
      iconLeft={<ReloadIcon htmlColor="#F37165" />}
      onClick={onInitialize}
    >
      초기화
    </Button>
    <Button className="w-1/2 rounded-xl" variantType="primary" onClick={onApply}>
      적용하기
    </Button>
  </div>
);

export default BranchFilterBottomSheet;
