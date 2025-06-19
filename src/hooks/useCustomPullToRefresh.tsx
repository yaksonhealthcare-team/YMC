import { useEffect, useRef, useState } from 'react';

interface CustomPullToRefreshOptions {
  onRefresh: () => Promise<void>;
  pullDownThreshold?: number;
  maxPullDownDistance?: number;
}

export const useCustomPullToRefresh = ({
  onRefresh,
  pullDownThreshold = 80,
  maxPullDownDistance = 200
}: CustomPullToRefreshOptions) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const contentStartY = useRef(0);
  const isDragging = useRef(false);
  const currentPullDistance = useRef(0); // 현재 당김 거리를 ref로 추적

  // 진행률 계산 (0~1 사이 값)
  const pullProgress = Math.min(1, pullDistance / pullDownThreshold);

  // 새로고침 진행 함수
  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      await onRefresh();
    } catch {
      // 에러 발생 시 조용히 처리
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
      currentPullDistance.current = 0;
    }
  };

  // pullDistance 상태가 업데이트될 때마다 ref 값도 업데이트
  useEffect(() => {
    currentPullDistance.current = pullDistance;
  }, [pullDistance]);

  // 터치 시작 핸들러
  const handleTouchStart = (e: TouchEvent) => {
    if (isRefreshing) return;

    const container = containerRef.current;
    if (!container) return;

    // 컨테이너가 최상단에 있는 경우에만 당김 동작 허용
    if (container.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      contentStartY.current = 0;
      isDragging.current = true;
    }
  };

  // 터치 이동 핸들러
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current || isRefreshing) return;

    const container = containerRef.current;
    if (!container) return;

    // 스크롤이 최상단이 아니면 당김 동작 무시
    if (container.scrollTop > 0) {
      isDragging.current = false;
      setPullDistance(0);
      currentPullDistance.current = 0;
      return;
    }

    const touchDeltaY = e.touches[0].clientY - touchStartY.current;

    // 아래로 당길 때만(양수 값) 처리
    if (touchDeltaY > 0) {
      // 저항 효과를 추가하기 위해 제곱근 적용 (당길수록 어려워짐)
      const newPullDistance = Math.min(maxPullDownDistance, Math.sqrt(touchDeltaY) * 5);

      currentPullDistance.current = newPullDistance;
      setPullDistance(newPullDistance);

      // 기본 스크롤 동작 방지
      e.preventDefault();
    }
  };

  // 터치 종료 핸들러
  const handleTouchEnd = () => {
    if (!isDragging.current || isRefreshing) return;

    const finalPullDistance = currentPullDistance.current;

    isDragging.current = false;

    // 지정된 임계값 이상 당겼으면 새로고침 실행
    if (finalPullDistance >= pullDownThreshold) {
      void handleRefresh();
    } else {
      // 임계값에 도달하지 않았으면 원래 위치로 복귀
      setPullDistance(0);
      currentPullDistance.current = 0;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const touchStartHandler = (e: TouchEvent) => handleTouchStart(e);
    const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e);
    const touchEndHandler = () => handleTouchEnd();

    // 이벤트 리스너 등록
    container.addEventListener('touchstart', touchStartHandler, {
      passive: false
    });
    container.addEventListener('touchmove', touchMoveHandler, {
      passive: false
    });
    container.addEventListener('touchend', touchEndHandler);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
    };
  }, []); // isRefreshing 의존성 제거 - 이벤트 리스너를 한 번만 등록

  return {
    containerRef,
    pullDistance,
    pullProgress,
    isRefreshing,
    manualRefresh: handleRefresh // 수동 갱신 함수 노출
  };
};
