import { useLayout } from "contexts/LayoutContext"
import { useEffect, useState } from "react"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import PlusIcon from "@assets/icons/PlusIcon.svg?react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import { TextArea } from "@components/TextArea"
import FixedButtonContainer from "@components/FixedButtonContainer"

interface ReviewSection {
  rs_idx: string
  sc_name: string
}

interface ReviewRating {
  rs_idx: string
  rating: "disappointed" | "normal" | "great" | ""
}

interface ReviewApiResponse {
  resultCode: string
  resultMessage: string
  resultCount: number
  body: ReviewSection[]
}

const RATING_OPTIONS = [
  { label: "아쉬워요", value: "disappointed" },
  { label: "보통이에요", value: "normal" },
  { label: "최고예요!", value: "great" },
] as const

const ReviewFormPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  // API로부터 받아온 리뷰 섹션 목록
  const [reviewSections, setReviewSections] = useState<ReviewSection[]>([])
  // 각 섹션별 평가 상태
  const [ratings, setRatings] = useState<ReviewRating[]>([])
  const [review, setReview] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setHeader({
      display: true,
      title: "만족도 작성",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })

    // API 데이터 fetch 모의 구현
    const fetchReviewSections = async () => {
      try {
        // TODO: 실제 API 호출로 대체
        const mockResponse: ReviewApiResponse = {
          resultCode: "00",
          resultMessage: "SUCCESS",
          resultCount: 8,
          body: [
            { rs_idx: "24223470", sc_name: "클렌징" },
            { rs_idx: "24223471", sc_name: "등또는가슴복부" },
            { rs_idx: "24223472", sc_name: "두상" },
            { rs_idx: "24223473", sc_name: "데콜테" },
            { rs_idx: "24223474", sc_name: "피부" },
            { rs_idx: "24223475", sc_name: "얼굴팩" },
            { rs_idx: "24223476", sc_name: "팔관리" },
            { rs_idx: "24223477", sc_name: "마무리" },
          ],
        }

        if (mockResponse.resultCode === "00") {
          setReviewSections(mockResponse.body)
          // 초기 ratings 상태 설정
          setRatings(
            mockResponse.body.map((section) => ({
              rs_idx: section.rs_idx,
              rating: "",
            })),
          )
        }
      } catch (error) {
        console.error("Failed to fetch review sections:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviewSections()
  }, [])

  const isFormValid = ratings.every((rating) => rating.rating !== "")

  const handleRatingChange = (
    rs_idx: string,
    newRating: ReviewRating["rating"],
  ) => {
    setRatings((prev) =>
      prev.map((rating) =>
        rating.rs_idx === rs_idx ? { ...rating, rating: newRating } : rating,
      ),
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid) return

    try {
      // TODO: 실제 API 전송 구현
      const reviewData = {
        ratings,
        review,
        images,
      }
      console.log("Submitting review:", reviewData)
      // const response = await api.submitReview(reviewData)
      // if (response.success) navigate("/review/complete")
    } catch (error) {
      console.error("Failed to submit review:", error)
    }
  }

  const ReviewSectionComponent = ({
    section,
    rating,
  }: {
    section: ReviewSection
    rating: ReviewRating
  }) => {
    const displayName = section.sc_name.endsWith("관리")
      ? section.sc_name
      : `${section.sc_name} 관리`

    return (
      <div className="flex flex-col gap-4">
        <div className="text-gray-700 text-base font-semibold">
          {displayName}는 어떠셨나요?
        </div>
        <div className="flex gap-2">
          {RATING_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleRatingChange(section.rs_idx, option.value)}
              className={`flex-1 h-10 rounded-lg flex items-center justify-center ${
                rating.rating === option.value
                  ? "bg-primary text-white font-medium"
                  : "bg-white border border-gray-100 text-gray-700"
              }`}
            >
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-[94px]">
      {/* 방문 정보 */}
      <div className="px-5 pt-4">
        <div className="flex flex-col gap-5 bg-white rounded-[20px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500 text-sm font-medium">
                2024년 10월 26일 (토)
              </span>
            </div>
            <h2 className="text-gray-700 text-lg font-bold">
              약손명가 강남구청역점
            </h2>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            K-beauty 연예인 관리 A 코스
          </p>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-50 mt-6" />

      <div className="px-5 py-8 flex flex-col gap-8">
        {reviewSections.map((section) => (
          <ReviewSectionComponent
            key={section.rs_idx}
            section={section}
            rating={ratings.find((r) => r.rs_idx === section.rs_idx)!}
          />
        ))}

        <div className="flex flex-col gap-4">
          <div className="text-gray-700 text-base font-semibold">
            종합적인 평가를 작성해주세요. (선택)
          </div>
          <TextArea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="관리에 대한 평가를 자유롭게 작성해주세요."
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-gray-700 text-base font-semibold">
            사진을 올려서 테라피 히스토리를 관리하세요. (선택)
          </div>
          <div className="flex gap-2">
            <button className="w-20 h-20 border border-gray-200 rounded-lg flex flex-col items-center justify-center">
              <PlusIcon className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-xs font-medium mt-1">
                {images.length} / 8
              </span>
            </button>
            {images.map((image, index) => (
              <div
                key={index}
                className="w-20 h-20 border border-gray-100 rounded-lg"
              >
                <img src={image} alt={`업로드 이미지 ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="flex items-start gap-1 text-gray-500 text-sm">
            <span>*</span>
            <span>5Mb 이하의 jpg, jpeg, png 파일만 등록 가능합니다.</span>
          </div>
        </div>
      </div>

      <FixedButtonContainer className="bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          disabled={!isFormValid}
          onClick={handleSubmit}
          className="w-full"
        >
          {isFormValid ? "등록하기" : "예약하기"}
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default ReviewFormPage
