import { useLayout } from "contexts/LayoutContext"
import { useEffect } from "react"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { useNavigate } from "react-router-dom"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import StoreIcon from "@assets/icons/StoreIcon.svg?react"

interface ReviewDetailResponse {
  courseInfo: {
    nth: number
    name: string
    totalCount: number
    additionalCourses: string[]
  }
  location: string
  date: string
  ratings: {
    rs_grade: "H" | "M" | "L"
    count: number
  }[]
  evaluations: {
    question: string
    rs_grade: "H" | "M" | "L"
  }[]
  review_memo?: string
  images?: string[]
}

const RATING_LABEL: Record<"H" | "M" | "L", string> = {
  H: "최고예요!",
  M: "보통이에요",
  L: "아쉬워요",
} as const

const RATING_TYPE_LABEL: Record<"H" | "M" | "L", string> = {
  H: "만족",
  M: "보통",
  L: "불만족",
} as const

const ReviewDetailPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      title: "만족도 보기",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  // TODO: Fetch review data from API
  const reviewData: ReviewDetailResponse = {
    courseInfo: {
      nth: 2,
      name: "K-BEAUTY 연예인관리",
      totalCount: 20,
      additionalCourses: [
        "추가 관리 항목명",
        "추가 관리 항목명",
        "추가 관리 항목명",
      ],
    },
    location: "약손명가 강남구청역점",
    date: "2024년 10월 26일 (토)",
    ratings: [
      { rs_grade: "H", count: 2 },
      { rs_grade: "M", count: 1 },
      { rs_grade: "L", count: 1 },
    ],
    evaluations: [
      { question: "상체관리는 어떠셨나요?", rs_grade: "H" },
      { question: "하체관리는 어떠셨나요?", rs_grade: "H" },
      { question: "얼굴관리는 어떠셨나요?", rs_grade: "M" },
      { question: "마무리 관리는 어떠셨나요?", rs_grade: "H" },
    ],
    review_memo:
      "10월 결혼식을 앞두고 관리를 받으려고 알아보다가 집근처 약손명가로 가게 되었어요. 처음에는 드레스 핏이 목적이었기 때문에 승모근과 어깨라인 위주로 관리를 받았는데, 효과가 너무 좋아서 다른 부위도 관리를 받고 있습니다.",
    images: Array(8).fill("https://via.placeholder.com/80"),
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-4">
        <div className="flex flex-col gap-5 bg-white rounded-[20px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500 text-sm font-medium">
                {reviewData.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-lg font-bold">
                {reviewData.courseInfo.nth}회차
              </span>
              <span className="text-gray-700 text-lg font-bold">
                {reviewData.courseInfo.name} {reviewData.courseInfo.totalCount}
                회
              </span>
            </div>
            <div className="flex items-center gap-2">
              {reviewData.courseInfo.additionalCourses.map((course, index) => (
                <>
                  {index > 0 && (
                    <div className="w-[1px] h-3 border border-gray-200" />
                  )}
                  <span className="text-gray-500 text-xs font-medium">
                    {course}
                  </span>
                </>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <StoreIcon className={"w-[14px] h-[14px] text-gray-500"} />
            <span className="text-gray-500 text-sm font-medium">
              {reviewData.location}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-50 mt-6" />

      <div className="px-5 py-6">
        <div className="flex gap-1.5">
          {reviewData.ratings.map((rating) => (
            <div
              key={rating.rs_grade}
              className="px-2 py-[3px] bg-tag-redBg rounded-full"
            >
              <span className="text-primary text-xs font-medium">
                {RATING_TYPE_LABEL[rating.rs_grade]} {rating.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        <h3 className="text-gray-700 text-sm font-semibold">만족도 평가</h3>
        <div className="flex flex-col gap-2">
          {reviewData.evaluations.map((evaluation) => (
            <div
              key={evaluation.question}
              className="flex justify-between items-center"
            >
              <span className="text-gray-700 text-sm">
                {evaluation.question}
              </span>
              <span className="text-gray-700 text-sm">
                {RATING_LABEL[evaluation.rs_grade]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {reviewData.review_memo && (
        <>
          <div className="w-full h-px bg-gray-100 my-6" />
          {/* 종합 평가 */}
          <div className="px-5 flex flex-col gap-3">
            <h3 className="text-gray-700 text-sm font-semibold">종합 평가</h3>
            <p className="text-gray-700 text-sm leading-normal">
              {reviewData.review_memo}
            </p>
          </div>
        </>
      )}

      {reviewData.images && reviewData.images.length > 0 && (
        <>
          <div className="w-full h-px bg-gray-100 my-6" />
          <div className="px-5 flex flex-col gap-3">
            <h3 className="text-gray-700 text-sm font-semibold">
              업로드한 사진
            </h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar touch-pan-x">
              {reviewData.images.map((image, index) => (
                <div
                  key={index}
                  className="shrink-0 w-20 h-20 rounded-lg border border-gray-100"
                >
                  <img
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReviewDetailPage
