import { useEffect, useState } from "react"
import { useLayout } from "contexts/LayoutContext"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { TextArea } from "../../../components/TextArea"
import { Button } from "../../../components/Button"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import PlusIcon from "@assets/icons/PlusIcon.svg?react"
import clsx from "clsx"
import {
  useCreateReviewMutation,
  useReviewQuestions,
} from "../../../queries/useReviewQueries"
import { formatDate } from "../../../utils/date"
import LoadingIndicator from "../../../components/LoadingIndicator"

type SatisfactionPageParams = {
  id: string
}

type Grade = "L" | "M" | "H"

interface ReservationInfo {
  r_idx: string
  r_date: string
  b_name: string
  ps_name: string
  review_items: Array<{
    rs_idx: string
    rs_type: string
  }>
}

interface SatisfactionForm {
  [key: string]: Grade | string | File[] | null
  content: string
  images: File[]
}

const GRADE_TEXT = {
  L: "아쉬워요",
  M: "보통이에요",
  H: "최고예요!",
} as const

const SatisfactionPage = () => {
  const { id } = useParams<SatisfactionPageParams>()
  const location = useLocation()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const createReviewMutation = useCreateReviewMutation()
  const {
    data: reviewQuestions,
    isLoading,
    isError,
  } = useReviewQuestions(id || "")
  const reservationInfo = location.state as ReservationInfo
  const [form, setForm] = useState<SatisfactionForm>({
    content: "",
    images: [],
  })

  useEffect(() => {
    if (!reservationInfo) {
      navigate("/member-history/reservation")
      return
    }

    setHeader({
      display: true,
      title: "만족도 작성",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation, navigate, reservationInfo])

  const handleGradeSelect = (key: string, grade: Grade) => {
    setForm((prev) => ({
      ...prev,
      [key]: grade,
    }))
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      content: e.target.value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + form.images.length > 8) {
      alert("최대 8장까지 업로드 가능합니다.")
      return
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))
  }

  const handleImageDelete = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const isFormValid = () => {
    if (!reviewQuestions) return false
    return reviewQuestions.every(
      (question) =>
        form[question.rs_idx] !== undefined && form[question.rs_idx] !== null,
    )
  }

  const handleSubmit = () => {
    if (!id || !isFormValid() || !reviewQuestions) return

    const review = reviewQuestions.map((question) => ({
      rs_idx: question.rs_idx,
      rs_grade: form[question.rs_idx] as Grade,
    }))

    createReviewMutation.mutate({
      r_idx: id,
      review,
      review_memo: form.content || undefined,
      images: form.images.length > 0 ? form.images : undefined,
    })
  }

  if (!reservationInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">예약 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">만족도 질문을 불러오는데 실패했습니다.</p>
        <Button variantType="primary" sizeType="m" onClick={() => navigate(-1)}>
          이전으로 돌아가기
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 p-5 pb-[120px] space-y-6 overflow-y-auto">
        {/* 예약 정보 */}
        <div className="bg-white rounded-[20px] space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-14px font-medium text-gray-500">
                {formatDate(new Date(reservationInfo.r_date))}
              </span>
            </div>
            <h2 className="text-18px font-bold text-gray-900">
              {reservationInfo.b_name}
            </h2>
          </div>
          <p className="text-14px font-medium text-gray-500">
            {reservationInfo.ps_name}
          </p>
        </div>

        <div className="h-2 bg-gray-50 -mx-5" />

        {/* 만족도 평가 */}
        <div className="space-y-8 pt-2">
          {reviewQuestions?.map((question) => (
            <div key={question.rs_idx} className="space-y-4">
              <h3 className="text-16px font-sb text-gray-900">
                {question.sc_name}
              </h3>
              <div className="flex gap-2">
                {(["L", "M", "H"] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() =>
                      handleGradeSelect(question.rs_idx, grade as Grade)
                    }
                    className={clsx(
                      "flex-1 h-10 rounded-lg text-14px font-m",
                      form[question.rs_idx] === grade
                        ? "bg-primary text-white font-m"
                        : "border border-gray-100 text-gray-900",
                    )}
                  >
                    {GRADE_TEXT[grade]}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* 종합 평가 */}
          <div className="space-y-4">
            <h3 className="text-16px font-sb text-gray-900">
              종합적인 평가를 작성해주세요. (선택)
            </h3>
            <TextArea
              value={form.content}
              onChange={handleContentChange}
              placeholder="관리에 대한 평가를 자유롭게 작성해주세요."
              maxLength={1000}
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-4">
            <h3 className="text-16px font-sb text-gray-900">
              사진을 올려서 테라피 히스토리를 관리하세요. (선택)
            </h3>
            <div className="flex flex-wrap gap-2">
              <label className="w-20 h-20 flex flex-col items-center justify-center border border-gray-200 rounded-lg cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <PlusIcon className="w-6 h-6 text-gray-400" />
                <span className="text-12px font-m text-gray-400 mt-1">
                  {form.images.length} / 8
                </span>
              </label>
              {form.images.map((image, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`업로드 이미지 ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleImageDelete(index)}
                    className="absolute top-1 right-1 w-4 h-4 bg-black bg-opacity-60 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-12px">×</span>
                  </button>
                </div>
              ))}
            </div>
            <p className="text-14px font-r text-gray-500 flex items-start gap-1">
              <span>*</span>
              <span>5Mb 이하의 jpg, jpeg, png 파일만 등록 가능합니다.</span>
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100">
        <Button
          variantType="primary"
          sizeType="l"
          disabled={!isFormValid()}
          onClick={handleSubmit}
           className="w-full"
        >
          작성 완료
        </Button>
      </div>
    </div>
  )
}

export default SatisfactionPage
