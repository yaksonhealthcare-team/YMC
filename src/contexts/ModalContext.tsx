import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material"

/**
 * 오버레이 타입을 정의하는 열거형
 */
enum OverlayTypes {
  MESSAGE_BOX = "messageBox",
  BOTTOM_SHEET = "bottomSheet",
  ALERT = "alert",
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

type OverlayContent = ReactNode | ModalProps

interface OverlayState {
  isOpen: boolean
  type: OverlayTypes | null
  content: OverlayContent | null
  options: Record<string, unknown>
}

/**
 * 오버레이 컨텍스트의 값을 정의하는 인터페이스
 */
export interface OverlayContextValue {
  overlayState: OverlayState
  closeOverlay: (options?: { skipHistoryBack?: boolean }) => void
  openMessageBox: (
    message: string,
    options?: Record<string, unknown> | undefined,
  ) => void
  openBottomSheet: (content: ReactNode) => void
  showToast: (message: string) => void
  openAlert: (props: {
    title: string
    description: string
    onClose?: () => void
  }) => void
  openModal: (props: {
    title: string
    message: string
    onConfirm: () => void
    onCancel?: () => void
  }) => void
}

// 오버레이 컨텍스트 생성
const OverlayContext = createContext<OverlayContextValue | undefined>(undefined)

/**
 * 오버레이 프로바이더 props 인터페이스
 */
interface OverlayProviderProps {
  children: ReactNode
}

interface BottomSheetButton {
  text: string
  onClick: () => void
  variant?: "text" | "outlined" | "contained"
  height?: "default" | "large"
}

interface BottomSheetOptions extends Record<string, unknown> {
  title?: string
  buttons?: BottomSheetButton[]
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
  const [alertProps, setAlertProps] = useState<{
    title: string
    description: string
    onClose?: () => void
  } | null>(null)

  useEffect(() => {
    if (
      overlayState.isOpen &&
      overlayState.type === OverlayTypes.BOTTOM_SHEET
    ) {
      window.history.pushState({ bottomSheet: true }, "")

      const handlePopState = () => {
        setOverlayState({
          isOpen: false,
          type: null,
          content: null,
          options: {},
        })
        setAlertProps(null)
      }

      window.addEventListener("popstate", handlePopState)

      return () => {
        window.removeEventListener("popstate", handlePopState)
      }
    }
  }, [overlayState.isOpen, overlayState.type])

  const openOverlay = (
    type: OverlayTypes,
    content: OverlayContent,
    options: Record<string, unknown> = {},
  ) => {
    setOverlayState({
      isOpen: true,
      type,
      content,
      options,
    })
  }

  const closeOverlay = (options?: { skipHistoryBack?: boolean }) => {
    if (
      overlayState.type === OverlayTypes.BOTTOM_SHEET &&
      !options?.skipHistoryBack
    ) {
      const currentState = window.history.state
      if (currentState?.bottomSheet) {
        window.history.back()
        setOverlayState({
          isOpen: false,
          type: null,
          content: null,
          options: {},
        })
        setAlertProps(null)
        return
      }
    }

    setOverlayState({ isOpen: false, type: null, content: null, options: {} })
    setAlertProps(null)
  }

  const openMessageBox = (
    message: string,
    options: Record<string, unknown> = {},
  ) => {
    openOverlay(OverlayTypes.MESSAGE_BOX, message, options)
  }

  const openBottomSheet = (content: ReactNode) => {
    openOverlay(OverlayTypes.BOTTOM_SHEET, content)
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage("")
    }, 2000)
  }

  const openAlert = (props: {
    title: string
    description: string
    onClose?: () => void
  }) => {
    setAlertProps(props)
  }

  const openModal = (props: {
    title: string
    message: string
    onConfirm: () => void
    onCancel?: () => void
  }) => {
    openOverlay(OverlayTypes.MODAL, props)
  }

  return (
    <OverlayContext.Provider
      value={{
        overlayState,
        closeOverlay,
        openMessageBox,
        openBottomSheet,
        showToast,
        openAlert,
        openModal,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg z-[9999] min-w-[300px] max-w-[90%] text-center">
          {toastMessage}
        </div>
      )}
      {alertProps && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-5 mx-5 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">{alertProps.title}</h2>
            <p className="text-gray-600 mb-5">{alertProps.description}</p>
            <button
              className="w-full py-3 bg-primary text-white rounded-lg font-medium"
              onClick={(e) => {
                e.preventDefault()
                closeOverlay()
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
      {overlayState.type === OverlayTypes.MODAL && overlayState.content && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-5 mx-5 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              {(overlayState.content as ModalProps).title}
            </h2>
            <p className="text-gray-600 mb-5">
              {(overlayState.content as ModalProps).message}
            </p>
            <div className="flex gap-2">
              {(overlayState.content as ModalProps).onCancel && (
                <button
                  className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium"
                  onClick={() => {
                    ;(overlayState.content as ModalProps).onCancel?.()
                    closeOverlay()
                  }}
                >
                  취소
                </button>
              )}
              <button
                className="flex-1 py-3 bg-primary text-white rounded-lg font-medium"
                onClick={() => {
                  ;(overlayState.content as ModalProps).onConfirm()
                  closeOverlay()
                }}
              >
                확인
              </button>
            </div>
          </div>
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
  const { isOpen, type, content, options } = overlayState

  if (!isOpen) return null

  switch (type) {
    case OverlayTypes.MESSAGE_BOX:
      return (
        <Dialog
          open={isOpen}
          onClose={closeOverlay}
          aria-labelledby="message-box-title"
          aria-describedby="message-box-description"
          className="z-50"
        >
          <DialogTitle id="message-box-title">
            {(options.title as React.ReactNode) || "메시지"}
          </DialogTitle>
          <DialogContent>
            <p id="message-box-description" className="text-gray-700">
              {content as string}
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => {
                e.preventDefault()
                closeOverlay()
              }}
              color="primary"
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      )
    case OverlayTypes.BOTTOM_SHEET:
      return (
        <Dialog
          open={isOpen}
          onClose={closeOverlay}
          keepMounted
          fullWidth
          maxWidth="sm"
          className="z-50"
          PaperProps={{
            style: {
              position: "fixed",
              bottom: 0,
              margin: 0,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight:
                (options as BottomSheetOptions)?.height === "large"
                  ? "90vh"
                  : "80vh",
              overflowY: "auto",
              width: "100%",
            },
          }}
        >
          <DialogContent className={"p-0"}>
            <div className="flex flex-col items-center">
              <div className="w-[52px] h-[4px] bg-[#ECECEC] rounded-full mt-3 mb-4" />
              {(options?.title as string) && (
                <h2 className="text-[18px] font-semibold mb-4 text-center">
                  {options?.title as string}
                </h2>
              )}
              <div className="w-full text-center">
                {type === OverlayTypes.BOTTOM_SHEET && (content as ReactNode)}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )
    case OverlayTypes.ALERT:
      return (
        <Snackbar
          open={isOpen}
          message={content as string}
          onClose={(
            _event: Event | React.SyntheticEvent<Element>,
            reason: string,
          ) => {
            if (reason === "clickaway") {
              return
            }
            closeOverlay()
          }}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          className="z-50"
          sx={{
            "& .MuiSnackbarContent-root": {
              maxWidth: "600px",
              margin: "0 16px",
            },
          }}
        />
      )
    default:
      return null
  }
}
