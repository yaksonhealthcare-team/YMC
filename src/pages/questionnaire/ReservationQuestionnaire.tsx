import { useEffect } from "react"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import { useOverlay } from "contexts/ModalContext"
import { useLayout } from "contexts/LayoutContext"
import {
  useReservationQuestionnaire,
  useSubmitReservationQuestionnaire,
} from "queries/useQuestionnaireQueries"
import { QuestionItem } from "./_fragments/QuestionItem"

const ReservationQuestionnaire = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { showAlert } = useOverlay()
  const { data: questions, isLoading } = useReservationQuestionnaire()
  const submitMutation = useSubmitReservationQuestionnaire()

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약 문진",
      left: "back",
    })
    setNavigation({ display: false })
  }, [])

  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try {
        await submitMutation.mutateAsync(values)
        showAlert("문진이 완료되었습니다")
        navigate("/")
      } catch (error) {
        showAlert("문진 제출에 실패했습니다")
      }
    },
  })

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">로딩중...</div>
    )

  return (
    <div className="p-5 pb-24">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
        {questions?.map((question) => (
          <QuestionItem
            key={question.cssq_idx}
            question={question}
            formik={formik}
          />
        ))}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t">
          <Button
            type="submit"
            variantType="primary"
            sizeType="l"
            className="w-full"
          >
            완료
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReservationQuestionnaire
