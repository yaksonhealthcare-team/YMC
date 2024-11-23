import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useCallback, useEffect, useRef } from "react"
import { usePointHistories } from "../../queries/usePointQueries.tsx"
import { Tag } from "@components/Tag.tsx"

const PointPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const observerTarget = useRef(null)

  const {
    data: histories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePointHistories()

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      title: "포인트 내역",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  const onIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 })
    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [onIntersect])

  if (!histories) return <></>

  return (
    <div className={"flex flex-col p-5"}>
      <ul className={"divide-y"}>
        {histories.pages.map((page) =>
          page.data.map((history, index) => (
            <li key={index} className={"py-6"}>
              <div className={"flex gap-4"}>
                <div className={"flex-shrink"}>
                  <Tag
                    className={"text-nowrap"}
                    type={history.pointType === "사용" ? "blue" : "red"}
                    title={history.pointType}
                  />
                </div>
                <div className={"flex flex-col flex-grow"}>
                  <p className={"font-sb"}>{history.title}</p>
                  <p className={"text-14px text-gray-600 mt-1"}>
                    {history.description}
                  </p>
                  <p className={"text-12px text-gray-400"}>{history.date}</p>
                </div>
                <div className={"flex-shrink"}>
                  <p
                    className={`${history.pointType === "사용" ? "text-success" : "text-primary"} font-b text-18px`}
                  >
                    {history.point.includes("-")
                      ? history.point
                      : `+${history.point}`}
                  </p>
                </div>
              </div>
            </li>
          )),
        )}
      </ul>
      <div ref={observerTarget} className={"h-4"} />
      {isFetchingNextPage && (
        <p className={"text-center text-gray-500 py-4"}>로딩 중...</p>
      )}
    </div>
  )
}

export default PointPage
