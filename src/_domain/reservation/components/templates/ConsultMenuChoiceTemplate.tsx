import { Divider, Layout, Loading, SearchTextField } from '@/_shared/components';
import { useIntersectionObserver } from '@/_shared/hooks/useIntersectionObserver';
import { useHeaderStore } from '@/_shared/store';
import { useLayoutEffect, useRef } from 'react';
import { ConvertedConsultMenuData } from '../../business';
import { MenuCard } from '../organisms';

export interface ConsultMenuChoiceTemplateProps {
  onNextFetch: () => void;
  onBack: () => void;
  onClickCard: (item: ConvertedConsultMenuData[number]) => void;
  isPending: boolean;
  data?: ConvertedConsultMenuData;
  search?: string;
  onChangeSearch?: (value: string) => void;
}

export const ConsultMenuChoiceTemplate = ({
  data = [],
  search,
  isPending,
  onBack,
  onNextFetch,
  onClickCard,
  onChangeSearch
}: ConsultMenuChoiceTemplateProps) => {
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
          <button key={`${item.idx}-${idx}`} onClick={() => onClickCard(item)}>
            <MenuCard key={`${item.idx}-${idx}`} item={item} />
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
