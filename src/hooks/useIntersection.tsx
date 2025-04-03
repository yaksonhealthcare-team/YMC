import { useCallback, useEffect, useRef } from "react"

interface UseIntersectionProps {
  onIntersect: () => void
  threshold?: number
  enabled?: boolean
}

export const useIntersection = <T extends HTMLElement = HTMLDivElement>({
  onIntersect,
  threshold = 0.1,
  enabled = true,
}: UseIntersectionProps) => {
  const observerTarget = useRef<T | null>(null)

  const handleIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && enabled) {
        onIntersect()
      }
    },
    [onIntersect, enabled],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, { threshold })
    const currentTarget = observerTarget.current

    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
      observer.disconnect()
    }
  }, [handleIntersect, threshold])

  return {
    observerTarget,
  }
}

export default useIntersection
