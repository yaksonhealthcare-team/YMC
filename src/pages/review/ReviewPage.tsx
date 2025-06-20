import { Button } from '@/components/Button';
import { EmptyCard } from '@/components/EmptyCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useLayout } from '@/contexts/LayoutContext';
import { useIntersection } from '@/hooks/useIntersection';
import { useReviews } from '@/queries/useReviewQueries';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReviewListItem } from './_fragments/ReviewListItem';

const ReviewPage = () => {
  const { setHeader, setNavigation } = useLayout();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isError, refetch } = useReviews();

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetchingNextPage
  });

  useEffect(() => {
    setHeader({
      display: true,
      title: '작성한 만족도',
      left: 'back',
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: true });
  }, []);

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white">
        <span className="text-gray-500 text-sm font-medium">데이터를 불러오는데 실패했습니다.</span>
        <Button variantType="primary" sizeType="m" onClick={() => refetch()} aria-label="리뷰 새로고침">
          새로고침
        </Button>
      </div>
    );
  }

  if (!data || data.pages[0].length === 0) {
    return (
      <div className="h-screen bg-white p-5">
        <EmptyCard title="작성한 만족도가 없습니다." />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white h-full overflow-y-scroll">
      {data.pages.map((page) =>
        page.map((review) => (
          <Link
            key={review.id}
            to={`/review/${review.id}`}
            className="w-full text-left hover:bg-gray-50 transition-colors"
          >
            <ReviewListItem review={review} />
          </Link>
        ))
      )}
      <div ref={observerTarget} />
      {isFetchingNextPage && (
        <div className="py-4">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
