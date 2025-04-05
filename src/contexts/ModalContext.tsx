import React, { createContext, ReactNode, useContext, useState } from "react"
import { Dialog, DialogContent } from "@mui/material"
import { Button } from "../components/Button"

/**
 * 오버레이 타입을 정의하는 열거형
 */
enum OverlayTypes {
  MESSAGE_BOX = "messageBox",
  BOTTOM_SHEET = "bottomSheet",
  MODAL = "modal",
}

/**
 * 오버레이 상태를 정의하는 인터페이스
 */
interface ModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel?: () => void
}

interface BottomSheetButton {
  text: string
  onClick: () => void
  variant?: "text" | "line" | "primary" | "secondary" | "gray" | "grayLine"
  height?: "default" | "large"
}

interface MessageBoxOptions {
  title?: string
}

interface BottomSheetOptions {
  title?: string
  buttons?: BottomSheetButton[]
  height?: "default" | "large"
}

type OverlayOptions = MessageBoxOptions | BottomSheetOptions

interface BaseOverlayState {
  isOpen: boolean
  type: OverlayTypes | null
  options: OverlayOptions
}

interface MessageBoxState extends BaseOverlayState {
  type: OverlayTypes.MESSAGE_BOX
  content: string
  options: MessageBoxOptions
}

interface BottomSheetState extends BaseOverlayState {
  type: OverlayTypes.BOTTOM_SHEET
  content: ReactNode
  options: BottomSheetOptions
}

interface ModalState extends BaseOverlayState {
  type: OverlayTypes.MODAL
  content: ModalProps
  options: Record<string, never>
}

type OverlayState =
  | MessageBoxState
  | BottomSheetState
  | ModalState
  | {
      isOpen: false
      type: null
      content: null
      options: Record<string, never>
    }

/**
 * 오버레이 컨텍스트의 값을 정의하는 인터페이스
 */
export interface OverlayContextValue {
  overlayState: OverlayState
  closeOverlay: () => void
  openMessageBox: (message: string, options?: MessageBoxOptions) => void
  openBottomSheet: (content: ReactNode, options?: BottomSheetOptions) => void
  showToast: (message: string) => void
  openModal: (props: ModalProps) => void
}

// 오버레이 컨텍스트 생성
const OverlayContext = createContext<OverlayContextValue | undefined>(undefined)

/**
 * 오버레이 프로바이더 props 인터페이스
 */
interface OverlayProviderProps {
  children: ReactNode
}

/**
 * 오버레이 프로바이더 컴포넌트
 *
 * @param {OverlayProviderProps} props - 자식 컴포넌트를 포함하는 props
 * @returns {JSX.Element} OverlayProvider 컴포넌트
 */
export const OverlayProvider: React.FC<OverlayProviderProps> = ({
  children,
}) => {
  const [overlayState, setOverlayState] = useState<OverlayState>({
    isOpen: false,
    type: null,
    content: null,
    options: {},
  })
  const [toastMessage, setToastMessage] = useState("")

  const openOverlay = <T extends OverlayState>(state: T) => {
    setOverlayState(state)
  }

  const closeOverlay = () => {
    setOverlayState({
      isOpen: false,
      type: null,
      content: null,
      options: {},
    })
  }

  const openMessageBox = (message: string, options: MessageBoxOptions = {}) => {
    openOverlay({
      isOpen: true,
      type: OverlayTypes.MESSAGE_BOX,
      content: message,
      options,
    })
  }

  const openBottomSheet = (
    content: ReactNode,
    options: BottomSheetOptions = {},
  ) => {
    openOverlay({
      isOpen: true,
      type: OverlayTypes.BOTTOM_SHEET,
      content,
      options,
    })
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage("")
    }, 2000)
  }

  const openModal = (props: ModalProps) => {
    openOverlay({
      isOpen: true,
      type: OverlayTypes.MODAL,
      content: props,
      options: {},
    })
  }

  return (
    <OverlayContext.Provider
      value={{
        overlayState,
        closeOverlay,
        openMessageBox,
        openBottomSheet,
        showToast,
        openModal,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg z-[9999] min-w-[300px] max-w-[90%] text-center">
          {toastMessage}
        </div>
      )}
      <OverlayContainer />
    </OverlayContext.Provider>
  )
}

/**
 * 오버레이 컨텍스트를 사용하기 위한 커스텀 훅
 *
 * @returns {OverlayContextValue} 오버레이 컨텍스트 값
 * @throws {Error} OverlayProvider 외부에서 사용될 경우 에러를 던집니다.
 */
export const useOverlay = (): OverlayContextValue => {
  const context = useContext(OverlayContext)
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider")
  }
  return context
}

/**
 * 오버레이 컨테이너 컴포넌트
 * 현재 오버레이 상태에 따라 적절한 오버레이 컴포넌트를 렌더링합니다.
 */
const OverlayContainer: React.FC = () => {
  const { overlayState, closeOverlay } = useOverlay()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeOverlay()
    }
  }

  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  if (!overlayState.isOpen) return null

  const renderContent = () => {
    switch (overlayState.type) {
      case OverlayTypes.MESSAGE_BOX: {
        return (
          <div
            className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-box-title"
          >
            <div
              className="bg-white rounded-2xl p-6 w-[320px] max-w-[90%]"
              role="document"
              onKeyDown={handleContentKeyDown}
            >
              <h2 id="message-box-title" className="text-lg font-bold mb-4">
                {(overlayState as MessageBoxState).options.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {(overlayState as MessageBoxState).content}
              </p>
              <button
                className="w-full bg-primary text-white py-3 rounded-lg"
                onClick={closeOverlay}
                autoFocus
              >
                확인
              </button>
            </div>
          </div>
        )
      }

      case OverlayTypes.BOTTOM_SHEET: {
        const bottomSheetOptions = overlayState.options as BottomSheetOptions
        return (
          <Dialog
            open={overlayState.isOpen}
            onClose={closeOverlay}
            keepMounted
            fullWidth
            maxWidth="sm"
            className="z-[9000]"
            PaperProps={{
              style: {
                position: "fixed",
                bottom: 0,
                margin: 0,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight:
                  bottomSheetOptions.height === "large" ? "95vh" : "80vh",
                minHeight:
                  bottomSheetOptions.height === "large" ? "95vh" : "auto",
                overflowY: "hidden",
                width: "100%",
              },
            }}
          >
            <DialogContent className="p-0 scrollbar-hide overflow-y-auto">
              <div className="flex flex-col items-center">
                <div className="w-10 h-1 bg-gray-300 rounded-full my-4" />
                {bottomSheetOptions.title && (
                  <h2 className="text-[18px] font-semibold mb-4 text-center">
                    {bottomSheetOptions.title}
                  </h2>
                )}
                <div className="w-full text-center">
                  {overlayState.content as ReactNode}
                </div>
                {bottomSheetOptions.buttons?.map((button, index) => (
                  <Button
                    key={index}
                    variantType="primary"
                    onClick={button.onClick}
                    fullWidth
                    className={`mt-2 ${
                      button.height === "large" ? "py-4" : "py-2"
                    }`}
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )
      }

      case OverlayTypes.MODAL: {
        const modalState = overlayState as ModalState
        return (
          <Dialog
            open={true}
            onClose={closeOverlay}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <DialogContent>
              <h2 id="modal-title" className="text-lg font-bold mb-4">
                {modalState.content.title}
              </h2>
              <p id="modal-description" className="text-gray-600 mb-6">
                {modalState.content.message}
              </p>
              <div className="flex gap-2">
                {modalState.content.onCancel && (
                  <Button
                    onClick={modalState.content.onCancel}
                    variantType="line"
                    className="flex-1"
                  >
                    취소
                  </Button>
                )}
                <Button
                  onClick={modalState.content.onConfirm}
                  variantType="primary"
                  className="flex-1"
                >
                  확인
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )
      }

      default:
        return null
    }
  }

  return (
    <div onKeyDown={handleKeyDown} className="relative">
      {renderContent()}
    </div>
  )
}
