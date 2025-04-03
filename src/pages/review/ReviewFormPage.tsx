import { useLayout } from "contexts/LayoutContext"
import { useCallback, useEffect, useState } from "react"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import PlusIcon from "@assets/icons/PlusIcon.svg?react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import { TextArea } from "@components/TextArea"
import FixedButtonContainer from "@components/FixedButtonContainer"
import LoadingIndicator from "@components/LoadingIndicator"
import { useReviewSections } from "../../queries/useReviewQueries"
import { validateFile, escapeHtml } from "utils/sanitize"
import { Image } from "@components/common/Image"

interface ReviewSection {
  rs_idx: string
  sc_name: string
}

interface ReviewRating {
  rs_idx: string
  rs_grade: "L" | "M" | "H" | ""
}

interface UploadedImage {
  id: string
  file: File
  preview: string
}

const RATING_OPTIONS = [
  { label: "아쉬워요", value: "L" },
  { label: "보통이에요", value: "M" },
  { label: "최고예요!", value: "H" },
] as const

const ReviewFormPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { data: reviewSections, isLoading } = useReviewSections()

  const [ratings, setRatings] = useState<ReviewRating[]>([])
  const [review, setReview] = useState("")
  const [images, setImages] = useState<UploadedImage[]>([])

  useEffect(() => {
    setHeader({
      display: true,
      title: "만족도 작성",
      left: (
        <button
          onClick={() => navigate(-1)}
          className="focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2 rounded"
          aria-label="뒤로가기"
        >
          <CaretLeftIcon className="w-5 h-5" />
        </button>
      ),
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })

    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview))
    }
  }, [])

  useEffect(() => {
    if (reviewSections) {
      setRatings(
        reviewSections.map((section) => ({
          rs_idx: section.rs_idx,
          rs_grade: "",
        })),
      )
    }
  }, [reviewSections])

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
      const maxSize = 5 * 1024 * 1024 // 5MB

      const validFiles = Array.from(files).filter((file) => {
        const validation = validateFile(file, allowedTypes, maxSize)
        if (!validation.valid) {
          alert(validation.message)
          return false
        }
        return true
      })

      if (images.length + validFiles.length > 8) {
        alert("최대 8개까지 업로드 가능합니다.")
        return
      }

      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              file,
              preview: reader.result as string,
            },
          ])
        }
        reader.readAsDataURL(file)
      })

      e.target.value = ""
    },
    [images],
  )

  const handleImageDelete = useCallback((id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id))
  }, [])

  const isFormValid = ratings.every((rating) => rating.rs_grade !== "")

  const handleRatingChange = (
    rs_idx: string,
    newGrade: ReviewRating["rs_grade"],
  ) => {
    setRatings((prev) =>
      prev.map((rating) =>
        rating.rs_idx === rs_idx ? { ...rating, rs_grade: newGrade } : rating,
      ),
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid) return

    try {
      const formData = new FormData()

      formData.append("r_idx", "5453207")

      const reviewData = ratings
      formData.append("review", JSON.stringify(reviewData))

      formData.append("review_memo", escapeHtml(review))

      images.forEach((image) => {
        formData.append("upload", image.file)
      })
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
                rating.rs_grade === option.value
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

  // TODO: Add loading indicator
  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className="flex flex-col pb-[94px]">
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
        {reviewSections?.map((section) => (
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

          <div className="flex gap-2 overflow-x-auto no-scrollbar touch-pan-x">
            <label className="shrink-0 w-20 h-20 border border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                multiple
                className="hidden"
              />
              <PlusIcon className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-xs font-medium mt-1">
                {images.length} / 8
              </span>
            </label>
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative w-20 h-20 rounded-lg border border-gray-100"
              >
                <Image
                  src={image.preview}
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(image.id)}
                  className="absolute -top-2 -right-2 bg-gray-700 rounded-full bg-opacity-60 w-[24px] h-[24px] flex justify-center items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[16px] h-[16px] text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
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
