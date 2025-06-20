import { EmptyCard } from '@/components/EmptyCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import { Tag } from '@/components/Tag';
import { useLayout } from '@/contexts/LayoutContext';
import useIntersection from '@/hooks/useIntersection';
import { usePointHistories } from '@/queries/usePointQueries';
import { useEffect } from 'react';

const PointPage = () => {
  const { setHeader, setNavigation } = useLayout();

  const { data: histories, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePointHistories();

  useEffect(() => {
    setHeader({
      display: true,
      left: 'back',
      title: '포인트 내역',
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });
  }, []);

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    }
  });

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  if (!histories || histories.pages[0].data.length === 0) {
    return (
      <div className="h-screen bg-white p-5">
        <EmptyCard title="포인트 내역이 없습니다." />
      </div>
    );
  }

  return (
    <div className={'flex flex-col p-5'}>
      <ul className={'divide-y'}>
        {histories.pages.map((page) =>
          page.data.map((history) => (
            <li key={`${history.date}-${history.title}`} className={'py-6'}>
              <div className={'flex gap-4'}>
                <div className={'flex-shrink'}>
                  <Tag
                    className={'text-nowrap'}
                    type={history.pointType === '사용' ? 'blue' : 'red'}
                    title={history.pointType}
                  />
                </div>
                <div className={'flex flex-col flex-grow'}>
                  <p className={'font-sb'}>{history.title}</p>
                  <p className={'text-14px text-gray-600 mt-1'}>{history.description}</p>
                  <p className={'text-12px text-gray-400'}>{history.date}</p>
                </div>
                <div className={'flex-shrink'}>
                  <p className={`${history.pointType === '사용' ? 'text-success' : 'text-primary'} font-b text-18px`}>
                    {history.point.includes('-') ? history.point : `+${history.point}`}
                  </p>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <div ref={observerTarget} className={'h-4'} />
      {isFetchingNextPage && (
        <div className="py-4">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
};

export default PointPage;
