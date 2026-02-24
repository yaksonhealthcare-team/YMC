import { Divider } from '@/shared/ui/divider/Divider';
import { Loading } from '@/shared/ui/loading/Loading';
import { SearchTextField } from '@/shared/ui/text-field/SearchTextField';
import { Layout } from '@/widgets/layout/ui/Layout';
import { useIntersectionObserver } from '@/shared/lib/hooks/useIntersectionObserver';
import { useHeaderStore } from '@/shared/lib/stores/header.store';
import { useLayoutEffect, useRef } from 'react';
import { ConvertedConsultMenuData } from '@/features/reservation/lib/menu.business';
import { MenuCard, MenuCardProps } from '@/features/reservation/ui';

export interface MenuChoiceTemplateProps {
  onNextFetch: () => void;
  onBack: () => void;
  onClickCard: (item: ConvertedConsultMenuData[number]) => void;
  isPending: boolean;
  data?: ConvertedConsultMenuData;
  search?: string;
  onChangeSearch?: (value: string) => void;
  type?: MenuCardProps['type'];
}

export const MenuChoiceTemplate = ({
  data = [],
  search,
  type = 'standard',
  isPending,
  onBack,
  onNextFetch,
  onClickCard,
  onChangeSearch
}: MenuChoiceTemplateProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { setTitle, setOnBack, reset } = useHeaderStore();
  useIntersectionObserver(loadMoreRef, onNextFetch, { rootMargin: '200px' });

  useLayoutEffect(() => {
    setTitle('메뉴 선택');
    setOnBack(onBack);

    return reset;
  }, [onBack, reset, setOnBack, setTitle]);

  const renderContent = () => {
    if (isPending) return <Loading />;

    return (
      <div className="flex flex-col gap-4">
        {data.map((item, idx) => (
          <button key={`${item.ss_idx}-${idx}`} onClick={() => onClickCard(item)}>
            <MenuCard key={`${item.ss_idx}-${idx}`} item={item} type={type} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 h-full w-full z-[9999] flex flex-col bg-white">
      <Layout>
        <div className="p-5">
          <SearchTextField
            placeholder="메뉴명을 입력해주세요."
            onClear={() => onChangeSearch?.('')}
            value={search}
            onChange={(e) => onChangeSearch?.(e.target.value)}
          />
        </div>
        <Divider />
        <div className="flex flex-col flex-1 overflow-auto pt-4 pb-20 px-2 ">
          {renderContent()}
          <div ref={loadMoreRef} />
        </div>
      </Layout>
    </div>
  );
};
