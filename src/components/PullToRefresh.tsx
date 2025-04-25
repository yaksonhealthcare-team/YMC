import { ReactNode } from "react"
import { usePullToRefresh } from "../hooks/usePullToRefresh"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  pullDownThreshold?: number
  triggerThresholdRatio?: number
}

export const PullToRefresh = ({
  onRefresh,
  children,
  pullDownThreshold = 400,
  triggerThresholdRatio = 0.8,
}: PullToRefreshProps) => {
  const {
    refreshContainerRef,
    pullChange,
    pullProgress,
    isRefreshing,
    shouldShowRefreshMessage,
  } = usePullToRefresh({
    onRefresh,
    pullDownThreshold,
    triggerThresholdRatio,
  })

  // 풀 진행도에 따른 색상 변화
  const getRefreshIconColor = () => {
    if (isRefreshing) return "text-primary-500"
    if (pullProgress >= triggerThresholdRatio) return "text-primary-500"
    return "text-gray-400"
  }

  return (
    <div className="relative overflow-hidden h-full">
      <div
        ref={refreshContainerRef}
        className="refresh-container"
        style={{
          marginTop:
            pullChange > 0 ? Math.max(-10, pullChange / 3 - 40) : "-40px",
          opacity: pullChange > 0 ? Math.min(1, pullChange / 80) : 0,
        }}
      >
        <div
          className={`refresh-icon p-2 rounded-full ${getRefreshIconColor()}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-6 h-6 transition-transform duration-200 ${
              isRefreshing ? "animate-spin" : ""
            }`}
            style={{ transform: `rotate(${Math.min(360, pullChange)}deg)` }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
        {shouldShowRefreshMessage && (
          <div className="text-xs text-center mt-1 text-gray-500 animate-pulse">
            놓으면 새로고침됩니다
          </div>
        )}
      </div>
      <div className="h-full">{children}</div>
    </div>
  )
}
