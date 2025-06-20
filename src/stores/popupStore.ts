import { AppPopupData } from '@/apis/contents.api'; // Correct import path assumption
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// interface PopupData {
//   code: string
//   imageUrl: string
//   linkUrl?: string // Optional: Link to navigate to when image is clicked
//   // Add other necessary data from API later
// }
// Using AppPopupData directly

export interface PopupState {
  isOpen: boolean;
  popupData: AppPopupData[] | null;
  dontShowUntil: number | null; // Timestamp until which the popup should not be shown
  sessionShown: boolean; // Tracks if popup was shown this session
  actions: {
    openPopup: (data: AppPopupData[]) => void;
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
      sessionShown: false, // Default to false, reset each session
      actions: {
        openPopup: (data) => {
          // Check if it should be shown based on "don't show again" AND session status
          if (get().actions.shouldShowPopup() && !get().sessionShown && data && data.length > 0) {
            set({ isOpen: true, popupData: data, sessionShown: true }); // Mark as shown this session
          } else {
            // Ensure popup is closed if conditions aren't met
            set({ isOpen: false, popupData: null });
          }
        },
        closePopup: () => set({ isOpen: false }),
        setDontShowAgain: (days) => {
          const msInDay = 24 * 60 * 60 * 1000;
          const dontShowUntil = Date.now() + days * msInDay;
          set({ dontShowUntil, isOpen: false });
          // Note: We rely on the persist middleware to save `dontShowUntil`
        },
        shouldShowPopup: () => {
          const { dontShowUntil } = get();
          if (!dontShowUntil) {
            return true; // Never shown or storage cleared
          }
          return Date.now() > dontShowUntil; // Show if the suppression period has passed
        }
      }
    }),
    {
      name: POPUP_STORAGE_KEY, // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      partialize: (state) => ({ dontShowUntil: state.dontShowUntil }) // Only persist dontShowUntil
      // `sessionShown` is intentionally omitted here
    }
  )
);

// Export actions separately for easier usage in components
export const usePopupActions = () => usePopupStore((state) => state.actions);
