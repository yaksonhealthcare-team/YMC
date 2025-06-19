import { Filter } from '@components/Filter.tsx';
import { FilterItem } from './BranchFilterBottomSheet.tsx';

const BranchFilterSection = ({
  currentFilter,
  onClick,
  onInitialize: performInitialize
}: {
  currentFilter: { brand: FilterItem | null; category: FilterItem | null };
  onClick: () => void;
  onInitialize: () => void;
}) => {
  return (
    <div className={'flex overflow-x-auto px-5 py-2 bg-white no-scrollbar'}>
      <div className={'flex flex-none gap-2'}>
        {(currentFilter.brand || currentFilter.category) && <Filter type={'reload'} onClick={performInitialize} />}
        <Filter
          type={'arrow'}
          state={!currentFilter.brand ? 'default' : 'active'}
          label={currentFilter.brand?.title ?? '브랜드'}
          onClick={onClick}
        />
        {/* <Filter
          type={"arrow"}
          state={!currentFilter.category ? "default" : "active"}
          label={currentFilter.category?.title ?? "카테고리"}
          onClick={onClick}
        /> */}
      </div>
    </div>
  );
};

export default BranchFilterSection;
