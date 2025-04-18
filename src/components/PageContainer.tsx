import { ReactNode, forwardRef, useEffect } from "react"
import { useScrollDetection } from "../hooks/useScrollDetection"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, className }, ref) => {
    // ref를 전달하여 스크롤 감지 hook 적용
    useScrollDetection(ref as React.RefObject<HTMLDivElement>)

    return (
      <div
        className={`h-screen max-h-full overflow-x-hidden ${className ?? "bg-system-bg"}`}
      >
        <div
          ref={ref}
          className="max-w-[500px] mx-auto h-full max-h-full overflow-y-auto overflow-x-hidden flex flex-col scrollbar-hide"
        >
          {children}
        </div>
      </div>
    )
  },
)

export default PageContainer
