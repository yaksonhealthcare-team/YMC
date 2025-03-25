import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { useReviews } from "../../queries/useReviewQueries.tsx"
import { ReviewListItem } from "./_fragments/ReviewListItem.tsx"
import { useIntersection } from "../../hooks/useIntersection.tsx"
import { useNavigate, useLocation } from "react-router-dom"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { Button } from "@components/Button"
import { EmptyCard } from "@components/EmptyCard"

const ReviewPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    refetch,
  } = useReviews()

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage()
      }
    },
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
    setNavigation({ display: true })
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white">
        <span className="text-gray-500 text-sm font-medium">
          데이터를 불러오는데 실패했습니다.
        </span>
        <Button variantType="primary" sizeType="m" onClick={() => refetch()}>
          다시 시도
        </Button>
      </div>
    )
  }

  if (!data || data.pages[0].length === 0) {
    return (
      <div className="h-screen bg-white p-5">
        <EmptyCard title="작성한 만족도가 없습니다." />
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white">
      {data.pages.map((page) =>
        page.map((review) => (
          <button
            type="button"
            key={review.id}
            onClick={() => navigate(`/review/${review.id}`)}
            className="w-full text-left hover:bg-gray-50 transition-colors"
          >
            <ReviewListItem review={review} />
          </button>
        )),
      )}
      {isFetchingNextPage && (
        <div className="py-4">
          <LoadingIndicator />
        </div>
      )}
      <div ref={observerTarget} />
    </div>
  )
}

export default ReviewPage
