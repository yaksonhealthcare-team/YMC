import React, { createContext, useState, useContext, ReactNode } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Snackbar,
} from "@mui/material"
import { TransitionProps } from "@mui/material/transitions"

/**
 * 오버레이 타입을 정의하는 열거형
 */
enum OverlayTypes {
  MESSAGE_BOX = "messageBox",
  BOTTOM_SHEET = "bottomSheet",
  ALERT = "alert",
}

/**
 * 오버레이 상태를 정의하는 인터페이스
 */
interface OverlayState {
  isOpen: boolean
  type: OverlayTypes | null
  content: ReactNode | null
  options: Record<string, unknown>
}

/**
 * 오버레이 컨텍스트의 값을 정의하는 인터페이스
 */
interface OverlayContextValue {
  overlayState: OverlayState
  closeOverlay: () => void
  openMessageBox: (message: string, options?: Record<string, unknown>) => void
  openBottomSheet: (
    content: ReactNode,
    options?: Record<string, unknown>,
  ) => void
  showAlert: (message: string, options?: Record<string, unknown>) => void
}

// 오버레이 컨텍스트 생성
const OverlayContext = createContext<OverlayContextValue | undefined>(undefined)

/**
 * 오버레이 프로바이더 props 인터페이스
 */
interface OverlayProviderProps {
  children: ReactNode
}

// Slide transition for BottomSheet
const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(
  (props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />
  },
)

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

  const openOverlay = (
    type: OverlayTypes,
    content: ReactNode,
    options: Record<string, unknown> = {},
  ) => {
    setOverlayState({ isOpen: true, type, content, options })
  }

  const closeOverlay = () => {
    setOverlayState({ isOpen: false, type: null, content: null, options: {} })
  }

  const openMessageBox = (
    message: string,
    options: Record<string, unknown> = {},
  ) => {
    openOverlay(OverlayTypes.MESSAGE_BOX, message, options)
  }

  const openBottomSheet = (
    content: ReactNode,
    options: Record<string, unknown> = {},
  ) => {
    openOverlay(OverlayTypes.BOTTOM_SHEET, content, options)
  }

  const showAlert = (
    message: string,
    options: Record<string, unknown> = {},
  ) => {
    openOverlay(OverlayTypes.ALERT, message, options)
    // 2초 후에 자동으로 닫기
    setTimeout(closeOverlay, 2000)
  }

  return (
    <OverlayContext.Provider
      value={{
        overlayState,
        closeOverlay,
        openMessageBox,
        openBottomSheet,
        showAlert,
      }}
    >
      {children}
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
            {options.title || "메시지"}
          </DialogTitle>
          <DialogContent>
            <p id="message-box-description" className="text-gray-700">
              {content as string}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeOverlay} color="primary">
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
          TransitionComponent={Transition}
          keepMounted
          fullWidth
          maxWidth="sm"
          className="z-50"
          PaperProps={{
            style: {
              position: "fixed",
              bottom: 0,
              margin: 0,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
        >
          <DialogContent className="p-4">{content}</DialogContent>
          <DialogActions>
            <Button onClick={closeOverlay} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      )
    case OverlayTypes.ALERT:
      return (
        <Snackbar
          open={isOpen}
          autoHideDuration={2000}
          onClose={closeOverlay}
          message={content as string}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          className="z-50"
        />
      )
    default:
      return null
  }
}
