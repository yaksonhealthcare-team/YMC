import { useEffect } from 'react';

interface UseModalBackButtonHandlerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 모달/바텀시트 등 오버레이 컴포넌트가 열려 있을 때
 * 기기의 뒤로가기 버튼 (안드로이드) 또는 브라우저 뒤로가기 액션 시
 * 모달을 닫도록 처리하는 훅.
 */
export function useModalBackButtonHandler({ isOpen, onClose }: UseModalBackButtonHandlerProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // 더미 히스토리 상태 푸시
    history.pushState(null, '', location.href);

    const handlePopState = (event: PopStateEvent) => {
      // popstate 이벤트 발생 시 모달 닫기
      event.preventDefault();
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // 컴포넌트 언마운트 또는 isOpen 변경 시,
      // 현재 히스토리 상태가 우리가 push한 상태인지 확인하고,
      // 맞다면 뒤로 가기 (pushState로 추가된 더미 히스토리 제거)
      // 이렇게 하지 않으면, 모달 외부 클릭 등으로 닫혔을 때 더미 히스토리가 남게 됨.
      if (history.state === null) {
        // history.state가 null이 우리가 추가한 상태를 의미 (정확한 비교 필요 시 개선)
        // history.back() // history.back()은 예상치 못한 동작을 유발할 수 있으므로 주석 처리
      }
    };
  }, [isOpen, onClose]);
}
