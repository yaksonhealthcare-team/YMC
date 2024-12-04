import { Review } from "../../../types/Review.ts"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import StoreIcon from "@assets/icons/StoreIcon.svg?react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

const Chip = ({ children }: { children: ReactNode }) => (
  <div
    className={
      "py-1 px-2 bg-tag-redBg text-12px text-primary font-m rounded-full"
    }
  >
    {children}
  </div>
)

const ReviewListItem = ({ review }: { review: Review }) => {
  const navigate = useNavigate()

  return (
    <div
      className={"flex flex-col"}
      onClick={() => navigate(`/review/${review.id}`)}
    >
      <div className={"flex gap-1.5 items-center text-gray-500 mx-5"}>
        <CalendarIcon className={"w-3.5 h-3.5"} />
        <p className={"text-14px"}>
          {format(review.date, "yyyy년 M월 d일 (EEE)", { locale: ko })}
        </p>
      </div>

      <div className={"font-b mt-2 flex gap-2 mx-5"}>
        <p className={"text-primary"}>{`${review.visit}회차`}</p>
        <p>{review.programName}</p>
      </div>

      <div className={"mt-3 text-gray-500 flex gap-1.5 items-center mx-5"}>
        <StoreIcon className={"w-3.5 h-3.5"} />
        <p className={"text-14px"}>{review.brandName}</p>
      </div>

      <div className={"h-[1px] bg-gray-100 mt-4 mx-5"} />

      <div className={"flex gap-1.5 mt-4 mx-5"}>
        <Chip>{`만족 ${review.grade.high}`}</Chip>
        <Chip>{`보통 ${review.grade.medium}`}</Chip>
        <Chip>{`불만족 ${review.grade.low}`}</Chip>
      </div>

      {review.content.length > 0 && (
        <div className={"mt-4 mx-5"}>
          <p className={"line-clamp-2 text-14px"}>{review.content}</p>
        </div>
      )}

      {review.imageUrls.length > 0 && (
        <div
          className={
            "w-full overflow-x-scroll mt-4 px-5 flex gap-2 scrollbar-hide"
          }
        >
          {review.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={"Image"}
              className={"w-20 h-20 rounded-xl"}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewListItem
