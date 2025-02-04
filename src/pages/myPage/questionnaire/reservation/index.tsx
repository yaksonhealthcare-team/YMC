import LoadingIndicator from "@components/LoadingIndicator"
import { useEffect } from "react"
import { useLayout } from "contexts/LayoutContext"
import { useUserReservationQuestionnaireResult } from "queries/useQuestionnaireQueries"
import { useLocation } from "react-router-dom"

const QuestionnaireReservationPage = () => {
  const { setHeader } = useLayout()
  const location = useLocation()

  const { data, isLoading, refetch } = useUserReservationQuestionnaireResult()

  useEffect(() => {
    // 페이지 진입할 때마다 강제로 refetch
    refetch()
  }, [location.key, refetch])

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약 문진",
      left: "back",
    })
  }, [setHeader])

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  // ... 나머지 컴포넌트 코드
}

export default QuestionnaireReservationPage
