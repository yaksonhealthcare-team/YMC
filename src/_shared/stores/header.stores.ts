import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Header.tsx에서 사용합니다.
 */
export interface HeaderState {
  /**
   * 페이지 타이틀
   */
  title: string;
  setTitle: (newTitle: string) => void;

  /**
   * 뒤로가기 클릭 이벤트
   */
  onBack?: () => void;
  setOnBack: (handler?: () => void) => void;

  /**
   * 헤더 상태를 초기값으로 리셋
   */
  reset: () => void;
}

export const useHeaderStore = create<HeaderState>()(
  devtools(
    (set) => ({
      title: '',
      setTitle: (newTitle: string) => set({ title: newTitle }),
      onBack: undefined,
      setOnBack: (handler?: () => void) => set({ onBack: handler }),
      reset: () => set({ title: '', onBack: undefined })
    }),
    { name: 'header-store' }
  )
);
