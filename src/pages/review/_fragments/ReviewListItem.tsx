import { Review } from "../../../types/Review.ts"
import { formatDate, formatDateWithDay } from "../../../utils/date.ts"
import { getGradeLabel } from "../../../utils/grade.ts"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import StoreIcon from "@assets/icons/StoreIcon.svg?react"
import EditIcon from "@assets/icons/EditIcon.svg?react"
import { Image } from "@components/common/Image"

interface ReviewListItemProps {
  review: Review
}

export const ReviewListItem = ({ review }: ReviewListItemProps) => {
  return (
    <div className="flex flex-col">
      <div className="px-5 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <EditIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-gray-500 text-sm font-medium">
                {formatDate(review.date, "YYYY.MM.DD HH:mm")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-base font-bold">
                {review.visit}회차
              </span>
              <span className="text-gray-900 text-base font-bold">
                {review.programName} {review.totalCount}
              </span>
            </div>
            {review.serviceDate && (
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-500 text-sm font-medium">
                  {formatDateWithDay(review.serviceDate)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <StoreIcon className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-500 text-sm font-medium">
              {review.brandName}
            </span>
          </div>

          <div className="w-full h-px bg-gray-100" />

          <div className="flex flex-col gap-4">
            <div className="flex gap-1.5">
              {Object.entries(review.grade).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-tag-redBg rounded-full py-[3px] px-2"
                >
                  <span className="text-primary text-xs font-medium flex items-center justify-center">
                    {getGradeLabel(key)} {value}
                  </span>
                </div>
              ))}
            </div>

            {review.content && (
              <p className="text-gray-900 text-sm leading-[23.52px]">
                {review.content}
              </p>
            )}

            {review.imageUrls && review.imageUrls.length > 0 && (
              <div className="w-full flex gap-2 overflow-x-auto no-scrollbar">
                {review.imageUrls.map((image, index) => (
                  <div
                    key={index}
                    className="shrink-0 w-20 h-20 rounded-lg border border-gray-100"
                  >
                    <Image
                      src={image}
                      alt={`리뷰 이미지 ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-50" />
    </div>
  )
}

export default ReviewListItem
