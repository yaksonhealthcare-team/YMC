import { useRef, useState, useEffect, RefObject } from "react"

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>
  pullDownThreshold?: number
  containerRef?: RefObject<HTMLDivElement>
  triggerThresholdRatio?: number
}

export const usePullToRefresh = ({
  onRefresh,
  pullDownThreshold = 400,
  containerRef: externalContainerRef,
  triggerThresholdRatio = 0.8,
}: PullToRefreshOptions) => {
  const [startPoint, setStartPoint] = useState(0)
  const [pullChange, setPullChange] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const internalContainerRef = useRef<HTMLDivElement>(null)

  // 스크롤 관련 상태 관리
  const scrollPositionRef = useRef(0)
  const lastScrollTimeRef = useRef(0)
  const scrollSpeedRef = useRef(0)
  const hasRecentlyScrolledRef = useRef(false)
  const touchStartTimeRef = useRef(0)
  const scrollTimerRef = useRef<number | null>(null)
  const reachedTopTimestampRef = useRef(0)
  const wasScrollingUpRef = useRef(false)
  const scrollDirectionChangeTimestampRef = useRef(0)

  const refreshContainerRef = externalContainerRef || internalContainerRef

  // 현재 진행 상태
  const pullProgress = Math.min(1, pullChange / pullDownThreshold)

  // 새로고침 메시지가 표시되는 조건
  const shouldShowRefreshMessage =
    pullProgress >= triggerThresholdRatio && !isRefreshing

  // 새로고침 가능 여부
  const canTriggerRefresh = pullProgress >= triggerThresholdRatio

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

  // 최상단 스크롤 여부를 확인하는 함수
  const isScrollAtTop = () => {
    return (
      document.documentElement.scrollTop <= 5 || document.body.scrollTop <= 5
    )
  }

  // 스크롤 감지 처리 함수
  const handleScroll = () => {
    const currentTime = Date.now()
    const currentPosition =
      document.documentElement.scrollTop || document.body.scrollTop

    // 스크롤 방향 감지
    const isScrollingUp = currentPosition < scrollPositionRef.current

    // 스크롤 방향이 바뀐 경우 시간 기록
    if (isScrollingUp !== wasScrollingUpRef.current) {
      scrollDirectionChangeTimestampRef.current = currentTime
      wasScrollingUpRef.current = isScrollingUp
    }

    // 최상단에 도달한 경우 시간 기록
    if (currentPosition <= 5 && scrollPositionRef.current > 5) {
      reachedTopTimestampRef.current = currentTime
    }

    // 스크롤 속도 계산 (px/ms)
    if (lastScrollTimeRef.current > 0) {
      const timeDiff = currentTime - lastScrollTimeRef.current
      if (timeDiff > 0) {
        const posDiff = Math.abs(currentPosition - scrollPositionRef.current)
        scrollSpeedRef.current = posDiff / timeDiff
      }
    }

    // 빠른 스크롤인 경우 플래그 설정
    if (scrollSpeedRef.current > 0.5) {
      // 임계값 (px/ms)
      hasRecentlyScrolledRef.current = true

      // 타이머 재설정
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current)
      }

      // 스크롤 후 일정 시간(500ms) 동안 플래그 유지
      scrollTimerRef.current = window.setTimeout(() => {
        hasRecentlyScrolledRef.current = false
        scrollTimerRef.current = null
      }, 500)
    }

    scrollPositionRef.current = currentPosition
    lastScrollTimeRef.current = currentTime
  }

  // 최상단에 도달한 후 경과한 시간 (ms)
  const getTimePassedSinceReachedTop = () => {
    return Date.now() - reachedTopTimestampRef.current
  }

  // 스크롤 방향이 바뀐 후 경과한 시간 (ms)
  const getTimePassedSinceDirectionChange = () => {
    return Date.now() - scrollDirectionChangeTimestampRef.current
  }

  const pullStart = (e: TouchEvent) => {
    if (isRefreshing) return

    // 최상단에 있는지 확인
    if (!isScrollAtTop()) return

    // 스크롤 중이거나 최근에 스크롤한 경우 무시
    if (hasRecentlyScrolledRef.current) return

    // 최상단에 도달한 직후 일정 시간(800ms) 동안은 무시
    if (getTimePassedSinceReachedTop() < 800) return

    // 스크롤 방향이 바뀐 후 일정 시간(500ms) 동안은 무시
    if (getTimePassedSinceDirectionChange() < 500) return

    const touch = e.touches[0]
    setStartPoint(touch.screenY)
    touchStartTimeRef.current = Date.now()
  }

  const pull = (e: TouchEvent) => {
    if (startPoint === 0 || isRefreshing) return

    // 스크롤이 최상단에 있는지 다시 확인
    if (!isScrollAtTop()) {
      // 최상단이 아니면 당김 취소
      setStartPoint(0)
      setPullChange(0)
      return
    }

    // 스크롤 중이거나 최근에 스크롤한 경우 당김 취소
    if (hasRecentlyScrolledRef.current) {
      setStartPoint(0)
      setPullChange(0)
      return
    }

    const touch = e.touches[0]
    const { screenY } = touch

    // 아래로 당길 때만 처리 (위로 당기는 경우 무시)
    if (startPoint < screenY) {
      // 당김 지속 시간 계산
      const touchDuration = Date.now() - touchStartTimeRef.current

      // 짧은 시간 동안의 터치는 무시 (스크롤 관성일 가능성이 높음)
      if (touchDuration < 100) return

      // 비선형 저항을 적용하여 당기기 어렵게 함
      const rawPull = Math.abs(screenY - startPoint)
      const pullLength = Math.pow(rawPull, 0.8) * 2.5

      // 아주 작은 움직임은 무시 (10px 미만)
      if (pullLength > 10) {
        setPullChange(pullLength)
      }
    }
  }

  const endPull = () => {
    if (isRefreshing) return

    // 스크롤 중이거나 최근에 스크롤한 경우 무시
    if (hasRecentlyScrolledRef.current) {
      setStartPoint(0)
      setPullChange(0)
      return
    }

    // 최상단에 있는지 확인
    if (!isScrollAtTop()) {
      setStartPoint(0)
      setPullChange(0)
      return
    }

    // 충분한 당김과 최상단에 있을 때만 새로고침 실행
    // 메시지가 표시되는 조건(canTriggerRefresh)일 때만 새로고침 실행
    if (canTriggerRefresh) {
      // 터치 지속 시간이 충분히 길면 의도적인 제스처라고 판단
      const touchDuration = Date.now() - touchStartTimeRef.current
      if (touchDuration >= 200) {
        void initRefresh()
      } else {
        // 짧은 터치는 의도적인 제스처가 아니라고 판단
        setStartPoint(0)
        setPullChange(0)
      }
    } else {
      // 끝날 때 항상 초기화
      setStartPoint(0)
      setPullChange(0)
    }
  }

  useEffect(() => {
    const element = document.documentElement

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll, { passive: true })

    // 터치 이벤트 리스너 등록
    element.addEventListener("touchstart", pullStart, { passive: true })
    element.addEventListener("touchmove", pull, { passive: true })
    element.addEventListener("touchend", endPull, { passive: true })

    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current)
      }

      window.removeEventListener("scroll", handleScroll)
      element.removeEventListener("touchstart", pullStart)
      element.removeEventListener("touchmove", pull)
      element.removeEventListener("touchend", endPull)
    }
  }, [startPoint, pullChange, isRefreshing])

  return {
    refreshContainerRef,
    pullChange,
    isRefreshing,
    pullProgress,
    shouldShowRefreshMessage,
  }
}
