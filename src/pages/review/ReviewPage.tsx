import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { useReviews } from "../../queries/useReviewQueries.tsx"
import { ReviewListItem } from "./_fragments/ReviewListItem.tsx"
import { useIntersection } from "../../hooks/useIntersection.tsx"

const ReviewPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useReviews()

  const { observerTarget } = useIntersection({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  })

  useEffect(() => {
    setHeader({
      display: true,
      title: "만족도 내역",
      backgroundColor: "bg-gray-50",
    })
    setNavigation({ display: true })
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-5 bg-gray-50 h-full">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="h-[200px] bg-gray-100 rounded-[20px] animate-pulse"
            />
          ))}
      </div>
    )
  }

  if (!data) {
    return null
  }

  if (data.pages[0].length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <span className="text-gray-500 text-sm font-medium">
          작성한 만족도가 없습니다.
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-5 bg-gray-50 h-full">
      {data.pages.map((page) =>
        page.map((review) => (
          <ReviewListItem key={review.id} review={review} />
        )),
      )}
      <div ref={observerTarget} />
    </div>
  )
}

export default ReviewPage
