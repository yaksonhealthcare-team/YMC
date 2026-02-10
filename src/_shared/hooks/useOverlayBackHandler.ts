import { useOverlay } from '@/stores/ModalContext';
import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

/**
 * @description
 * 오버레이가 open되어 있는 상태에서 뒤로가기 탐지 시, 오버레이를 close
 */
export const useOverlayBackHandler = () => {
  const { overlayState, closeOverlay } = useOverlay();
  const { state, reset } = useBlocker(({ historyAction }) => {
    return overlayState.isOpen && historyAction === 'POP';
  });

  useEffect(() => {
    if (state === 'blocked' && overlayState.isOpen) {
      closeOverlay();
      reset();
    }
  }, [closeOverlay, overlayState.isOpen, reset, state]);
};
