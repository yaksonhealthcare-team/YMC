import type { ApiPopupItem } from '@/entities/content/api/contents.api';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface PopupState {
  isOpen: boolean;
  popupData: ApiPopupItem[] | null;
  dontShowUntil: number | null;
  sessionShown: boolean;
  actions: {
    openPopup: (data: ApiPopupItem[]) => void;
    closePopup: () => void;
    setDontShowAgain: (days: number) => void;
    shouldShowPopup: () => boolean;
  };
}

const POPUP_STORAGE_KEY = 'startup-popup-dont-show';

export const usePopupStore = create<PopupState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      popupData: null,
      dontShowUntil: null,
      sessionShown: false,
      actions: {
        openPopup: (data) => {
          if (get().actions.shouldShowPopup() && !get().sessionShown && data && data.length > 0) {
            set({ isOpen: true, popupData: data, sessionShown: true });
          } else {
            set({ isOpen: false, popupData: null });
          }
        },
        closePopup: () => set({ isOpen: false }),
        setDontShowAgain: (days) => {
          const msInDay = 24 * 60 * 60 * 1000;
          const dontShowUntil = Date.now() + days * msInDay;
          set({ dontShowUntil, isOpen: false });
        },
        shouldShowPopup: () => {
          const { dontShowUntil } = get();
          if (!dontShowUntil) {
            return true;
          }
          return Date.now() > dontShowUntil;
        }
      }
    }),
    {
      name: POPUP_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ dontShowUntil: state.dontShowUntil })
    }
  )
);

export const usePopupActions = () => usePopupStore((state) => state.actions);
