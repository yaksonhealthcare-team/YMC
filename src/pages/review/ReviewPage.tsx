import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { useReviews } from "../../queries/useReviewQueries.tsx"
import { ReviewListItem } from "./_fragments/ReviewListItem.tsx"
import { useIntersection } from "../../hooks/useIntersection.tsx"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"

const ReviewPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useReviews()

  const { observerTarget } = useIntersection({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  })

  useEffect(() => {
    setHeader({
      display: true,
      title: "작성한 만족도",
      backgroundColor: "bg-white",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
    })
    setNavigation({ display: false })
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="px-5 py-4">
              <div className="h-[302px] bg-gray-100 animate-pulse rounded-[20px]" />
            </div>
          ))}
      </div>
    )
  }

  if (!data) {
    return null
  }

  if (data.pages[0].length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-gray-500 text-sm font-medium">
          작성한 만족도가 없습니다.
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {data.pages.map((page) =>
        page.map((review) => (
          <div key={review.id} onClick={() => navigate(`/review/${review.id}`)}>
            <ReviewListItem review={review} />
          </div>
        )),
      )}
      <div ref={observerTarget} />
    </div>
  )
}

export default ReviewPage
