import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { useReviews } from "../../queries/useReviewQueries.tsx"
import { ReviewListItem } from "./_fragments/ReviewListItem.tsx"
import { useIntersection } from "../../hooks/useIntersection.tsx"
import { useNavigate, useLocation } from "react-router-dom"
import LoadingIndicator from "@components/LoadingIndicator.tsx"

const ReviewPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useReviews()

  const { observerTarget } = useIntersection({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  })

  const handleBack = () => {
    const returnPath = location.state?.returnPath || "/mypage"
    navigate(returnPath, { replace: true })
  }

  useEffect(() => {
    setHeader({
      display: true,
      title: "작성한 만족도",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      handleBack()
    }
    window.addEventListener("popstate", handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [location.state])

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
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
