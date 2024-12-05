import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import useIntersection from "../../hooks/useIntersection.tsx"
import { useReviews } from "../../queries/useReviewQueries.tsx"
import ReviewListItem from "./_fragments/ReviewListItem.tsx"

const ReviewPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useReviews()

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  useEffect(() => {
    setHeader({
      left: "back",
      title: "작성한 만족도",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  const reviews = (data?.pages || []).flatMap((page) => page)

  return (
    <ul className={"divide-y-8 divide-gray-50"}>
      {reviews.map((review) => (
        <li key={review.id} className={"py-6"}>
          <ReviewListItem review={review} />
        </li>
      ))}
      <div className={"h-1"} ref={observerTarget} />
    </ul>
  )
}

export default ReviewPage
