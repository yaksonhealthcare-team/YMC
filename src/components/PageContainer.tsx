import { ReactNode, forwardRef, useEffect } from "react"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, className }, ref) => {
    // iOS 웹뷰에서 바운스 효과 제어
    useEffect(() => {
      // iOS 웹뷰 감지
      const isIOSWebView =
        window.navigator.userAgent.includes("iPhone") ||
        window.navigator.userAgent.includes("iPad") ||
        (window.webkit && window.webkit.messageHandlers) ||
        window.osType === "ios"

      if (isIOSWebView && ref && "current" in ref && ref.current) {
        // 최상단에서 스크롤 위로 당길 때 오버스크롤 방지
        const handleTouchMove = (e: TouchEvent) => {
          const scrollElement = ref.current as HTMLDivElement
          if (scrollElement.scrollTop <= 0 && e.touches[0].clientY > 50) {
            e.preventDefault()
          }
        }

        const scrollElement = ref.current
        scrollElement.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        })

        return () => {
          scrollElement.removeEventListener("touchmove", handleTouchMove)
        }
      }
    }, [ref])

    return (
      <div
        className={`h-screen max-h-full overflow-x-hidden ${className ?? "bg-system-bg"}`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          ref={ref}
          className="max-w-[500px] mx-auto h-full max-h-full overflow-y-auto overflow-x-hidden flex flex-col scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
            zIndex: 1,
          }}
        >
          {children}
        </div>
      </div>
    )
  },
)

export default PageContainer
