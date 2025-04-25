import { ReactNode, useEffect, useState } from "react"
import { useCustomPullToRefresh } from "../hooks/useCustomPullToRefresh"

interface CustomPullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  pullDownThreshold?: number
  maxPullDownDistance?: number
  className?: string
}

export const CustomPullToRefresh = ({
  onRefresh,
  children,
  pullDownThreshold = 80,
  maxPullDownDistance = 200,
  className = "",
}: CustomPullToRefreshProps) => {
  const [debugTapCount, setDebugTapCount] = useState(0)
  const {
    containerRef,
    pullDistance,
    pullProgress,
    isRefreshing,
    manualRefresh,
  } = useCustomPullToRefresh({
    onRefresh,
    pullDownThreshold,
    maxPullDownDistance,
  })

  // 숨겨진 디버그 모드 - 헤더를 5번 빠르게 탭하면 활성화
  useEffect(() => {
    if (debugTapCount >= 5) {
      manualRefresh()
      setDebugTapCount(0)
    }

    // 3초 후 탭 카운트 리셋
    const timer = setTimeout(() => {
      if (debugTapCount > 0) {
        setDebugTapCount(0)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [debugTapCount, manualRefresh])

  // 풀 진행도에 따른 색상 변화
  const getRefreshIconColor = () => {
    if (isRefreshing) return "text-primary-500"
    if (pullProgress >= 0.8) return "text-primary-500" // 80% 이상 당겼을 때 색상 변경
    return "text-gray-400"
  }

  const handleDebugTap = () => {
    setDebugTapCount((prev) => prev + 1)
  }

  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      {/* 숨겨진 디버그 버튼 영역 */}
      <div
        className="absolute top-0 left-0 w-1/2 h-10 z-20 opacity-0"
        onClick={handleDebugTap}
      />

      {/* 새로고침 인디케이터 */}
      <div
        className="refresh-indicator absolute top-0 left-0 w-full flex flex-col items-center justify-center transition-transform z-10"
        style={{
          transform: `translateY(${pullDistance > 0 ? Math.max(0, pullDistance - 40) : -40}px)`,
          opacity: pullProgress,
        }}
      >
        <div className={`p-2 rounded-full ${getRefreshIconColor()}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-6 h-6 transition-transform duration-200 ${
              isRefreshing ? "animate-spin" : ""
            }`}
            style={{
              transform: `rotate(${Math.min(360, pullProgress * 360)}deg)`,
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
        {pullProgress >= 0.8 && !isRefreshing && (
          <div className="text-xs text-center text-gray-500 animate-pulse whitespace-nowrap mt-1">
            놓으면 새로고침됩니다
          </div>
        )}
        {isRefreshing && (
          <div className="text-xs text-center text-primary-500 whitespace-nowrap mt-1">
            새로고침 중...
          </div>
        )}
      </div>

      {/* 내용 컨테이너 - 스크롤 가능한 영역 */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-hide"
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: `transform ${isRefreshing || pullDistance === 0 ? "0.3s" : "0s"} ease-out`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
