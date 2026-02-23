import { EmptyCard } from '@/shared/ui/EmptyCard';
import LoadingIndicator from '@/shared/ui/loading/LoadingIndicator';
import { useLayout } from '@/stores/LayoutContext';
import { useIntersectionObserver } from '@/shared/lib/hooks/useIntersectionObserver';
import { usePaymentHistories } from '@/entities/payment/api/usePaymentQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentHistoryListItem from './_fragments/PaymentHistoryListItem';

const SCROLL_POSITION_KEY = ['payment_history_scroll_position'] as const;

const PaymentHistoryPage = () => {
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  const { data: payments, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePaymentHistories();

  const observerTarget = useRef<HTMLDivElement>(null);
  useIntersectionObserver(observerTarget, () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  useEffect(() => {
    setHeader({
      display: true,
      left: 'back',
      title: '결제 내역',
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: true });

    // 저장된 스크롤 위치 복원
    const savedPosition = queryClient.getQueryData(SCROLL_POSITION_KEY);
    if (scrollContainerRef.current && savedPosition) {
      scrollContainerRef.current.scrollTop = savedPosition as number;
    }

    return () => {
      // 현재 스크롤 위치 저장
      if (scrollContainerRef.current) {
        queryClient.setQueryData(SCROLL_POSITION_KEY, scrollContainerRef.current.scrollTop);
      }
    };
  }, []);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      queryClient.setQueryData(SCROLL_POSITION_KEY, scrollContainerRef.current.scrollTop);
    }
  };

  // 페이지 이동 시 스크롤 위치 초기화
  const handlePaymentClick = (paymentIndex: string) => {
    queryClient.removeQueries({ queryKey: SCROLL_POSITION_KEY });
    navigate(`/payment/${paymentIndex}`);
  };

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  return (
    <div className={'h-full flex flex-col overflow-hidden pb-[82px]'}>
      {payments && payments.pages.length > 0 && payments.pages[0].length > 0 ? (
        <ul
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={'divide-[#F7F8Fb] divide-y-8 overflow-y-auto flex-1'}
        >
          {payments.pages.map((page) =>
            page.map((payment, index) => (
              <li key={payment.index || index} className={'p-5'} onClick={() => handlePaymentClick(payment.index)}>
                <PaymentHistoryListItem payment={payment} />
              </li>
            ))
          )}
          {isFetchingNextPage && (
            <li className="py-4">
              <LoadingIndicator className="h-8" />
            </li>
          )}
          <div ref={observerTarget} className={'h-4 bg-[#F7F8Fb]'} />
        </ul>
      ) : (
        <EmptyCard title={`결제 내역이 없어요.\n결제 내역이 생기면 이곳에 표시됩니다.`} />
      )}
    </div>
  );
};

export default PaymentHistoryPage;
