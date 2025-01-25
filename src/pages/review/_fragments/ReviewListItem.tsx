import { Review } from "../../../types/Review.ts"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import StoreIcon from "@assets/icons/StoreIcon.svg?react"
import { useNavigate } from "react-router-dom"

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

interface Props {
  review: Review
}

export const ReviewListItem = ({ review }: Props) => {
  const navigate = useNavigate()

  const ratings = [
    { rs_grade: "H" as const, count: review.grade.H },
    { rs_grade: "M" as const, count: review.grade.M },
    { rs_grade: "L" as const, count: review.grade.L },
  ]

  return (
    <div
      className="flex flex-col gap-5 bg-white rounded-[20px] p-5 cursor-pointer"
      onClick={() => navigate(`/review/${review.id}`)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-gray-500 text-sm font-medium">
            {review.date}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary text-lg font-bold">
            {review.visit}회차
          </span>
          <span className="text-gray-700 text-lg font-bold">
            {review.programName} {review.totalCount}회
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <StoreIcon className={"w-[14px] h-[14px] text-gray-500"} />
        <span className="text-gray-500 text-sm font-medium">
          {review.brandName}
        </span>
      </div>
      <div className="flex gap-1.5">
        {ratings.map((rating) => (
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
      {review.content && (
        <p className="text-gray-700 text-sm line-clamp-2">{review.content}</p>
      )}
      {review.imageUrls && review.imageUrls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar touch-pan-x">
          {review.imageUrls.map((image, index) => (
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
      )}
    </div>
  )
}

export default ReviewListItem
