import clsx from "clsx"
import { useNavigate } from "react-router-dom"

export const BusinessInfo = () => {
  const navigate = useNavigate()

  return (
    <div
      className={clsx(
        "mt-12 px-6 pt-8 pb-[calc(82px+40px)] flex flex-col gap-4 bg-white relative",
        "max-w-[500px] mx-auto",
      )}
    >
      <span className="font-b text-16px text-gray-600">
        (주) 약손명가 헬스케어
      </span>
      <div className="flex flex-col gap-1">
        <span className="font-r text-12px text-gray-500">대표자 : 이석진</span>
        <span className="font-r text-12px text-gray-500">
          주소 : 서울특별시 강남구 봉은사로 68길 8, DECKS 빌딩 2층
        </span>
        <span className="font-r text-12px text-gray-500">
          번호 : 02-518-0408
        </span>
        <span className="font-r text-12px text-gray-500">
          통신판매업 번호 : 제2021-서울강남-05818호
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="font-sb text-14px text-gray-400 cursor-pointer hover:text-gray-600"
          onClick={() => navigate("/terms/privacy")}
        >
          개인정보처리방침
        </span>
        <div className="h-3.5 border-l border-gray-300"></div>
        <span
          className="font-sb text-14px text-gray-400 cursor-pointer hover:text-gray-600"
          onClick={() => navigate("/terms")}
        >
          이용약관
        </span>
      </div>
      <span className="font-r text-12px text-gray-300">
        © 2024. yaksonhouse. All Rights Reserved.
      </span>
    </div>
  )
}
