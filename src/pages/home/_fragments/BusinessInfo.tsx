import { useNavigate } from "react-router-dom"

export const BusinessInfo = () => {
  const navigate = useNavigate()

  return (
    <div className="mt-12 px-6 pt-8 pb-10 flex flex-col gap-4 bg-white relative">
      <span className="font-b text-16px text-gray-600">
        (주) 약손명가 헬스케어
      </span>
      <div className="flex flex-col gap-1">
        <span className="font-r text-12px text-gray-500">대표자 : 홍길동</span>
        <span className="font-r text-12px text-gray-500">
          주소 : 서울특별시 강남구 테헤란로 10길, 동성빌딩
        </span>
        <span className="font-r text-12px text-gray-500">
          번호 : 02-1234-1234
        </span>
        <span className="font-r text-12px text-gray-500">
          통신판매업 번호 : 0000-0000-0000
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
