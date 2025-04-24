import { useRef, useState, useEffect, RefObject } from "react"

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>
  pullDownThreshold?: number
  containerRef?: RefObject<HTMLDivElement>
}

export const usePullToRefresh = ({
  onRefresh,
  pullDownThreshold = 220,
  containerRef: externalContainerRef,
}: PullToRefreshOptions) => {
  const [startPoint, setStartPoint] = useState(0)
  const [pullChange, setPullChange] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const internalContainerRef = useRef<HTMLDivElement>(null)

  const refreshContainerRef = externalContainerRef || internalContainerRef

  const initRefresh = async () => {
    if (refreshContainerRef.current) {
      refreshContainerRef.current.classList.add("loading")
      setIsRefreshing(true)

      try {
        await onRefresh()
      } catch (error) {
        console.error("새로고침 중 오류 발생:", error)
      } finally {
        setStartPoint(0)
        setPullChange(0)
        setIsRefreshing(false)

        if (refreshContainerRef.current) {
          refreshContainerRef.current.classList.remove("loading")
        }
      }
    }
  }

  const pullStart = (e: TouchEvent) => {
    if (isRefreshing) return

    const touch = e.touches[0]
    setStartPoint(touch.screenY)
  }

  const pull = (e: TouchEvent) => {
    if (startPoint === 0 || isRefreshing) return

    const touch = e.touches[0]
    const { screenY } = touch
    let pullLength = startPoint < screenY ? Math.abs(screenY - startPoint) : 0

    setPullChange(pullLength)
  }

  const endPull = () => {
    if (isRefreshing) return

    if (pullChange > pullDownThreshold) {
      void initRefresh()
    } else {
      setStartPoint(0)
      setPullChange(0)
    }
  }

  useEffect(() => {
    const element = document.documentElement

    element.addEventListener("touchstart", pullStart)
    element.addEventListener("touchmove", pull)
    element.addEventListener("touchend", endPull)

    return () => {
      element.removeEventListener("touchstart", pullStart)
      element.removeEventListener("touchmove", pull)
      element.removeEventListener("touchend", endPull)
    }
  }, [startPoint, pullChange, isRefreshing])

  return {
    refreshContainerRef,
    pullChange,
    isRefreshing,
  }
}
