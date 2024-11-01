import React, { useEffect } from "react"
import { Button } from "@components/Button"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"

const PurchaseDetailPage = () => {
  const { setHeader, setNavigation } = useLayout()

  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      title: "",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
      right: <>{/* TODO: 장바구니 아이콘 추가*/}</>,
    })
    setNavigation({ display: false })
  }, [])

  const PurchaseInfo = () => (
    <div className="flex flex-col px-5 py-6 gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-primary font-sb text-14px">약손명가</span>
          <h1 className="text-gray-900 font-sb text-16px">
            K-BEAUTY 연예인관리
          </h1>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-primary font-b text-18px">20%</span>
          <div className="flex items-baseline gap-1">
            <span className="text-gray-900 font-b text-18px">200,000원</span>
            <span className="text-gray-900 font-r text-12px">부터~</span>
          </div>
          <span className="text-gray-400 font-r text-14px line-through">
            240,000
          </span>
        </div>
      </div>
      <div className="h-px bg-gray-100" />
      <p className="text-gray-900 font-r text-14px leading-[24px]">
        회원권 설명입니다. 약손명가를 다니는 많은 연예인들이 받는 관리로 자신감
        있는 모습으로 변하고 싶거나 부드러운 인상으로 사진이 잘 나오기를
        바라시는 분들을 위해 만든 프로그램입니다. 새로 개발한 에너지 세럼을 바른
        후 약손테라피 관리를 통해 최고의 시너지 효과를 볼 수 있도록 관리해
        드립니다.
      </p>
    </div>
  )

  const PurchaseDetail = () => (
    <div className="flex flex-col px-5 py-6 gap-4">
      <h2 className="text-gray-800 font-b text-16px">상세정보</h2>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5">
            <img
              src="/assets/icons/branch.svg"
              alt="지점"
              className="w-full h-full"
            />
          </div>
          <span className="text-gray-800 font-m text-14px">
            전지점 사용가능
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5">
            <img
              src="/assets/icons/time.svg"
              alt="시간"
              className="w-full h-full"
            />
          </div>
          <span className="text-gray-800 font-m text-14px">120분 소요</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5">
            <img
              src="/assets/icons/course.svg"
              alt="코스"
              className="w-full h-full"
            />
          </div>
          <span className="text-gray-800 font-m text-14px">관리 코스</span>
        </div>
        <p className="text-gray-900 font-r text-14px leading-[24px]">
          관리코스 설명이 노출되는 곳입니다. 관리코스 설명이 노출되는
          곳입니다.관리코스 설명이 노출되는 곳입니다.관리코스 설명이 노출되는
          곳입니다.관리코스 설명이 노출되는 곳입니다.관리코스 설명이 노출되는
          곳입니다.관리코스 설명이 노출되는 곳입니다.
        </p>
      </div>
    </div>
  )

  return (
    <div className="pb-[94px]">
      <div className="w-full h-[280px] bg-gray-200">
        <img
          src="https://via.placeholder.com/375x280"
          alt="회원권 이미지"
          className="w-full h-full object-cover"
        />
      </div>

      <PurchaseInfo />

      <div className="w-full h-2 bg-gray-50" />

      <PurchaseDetail />

      {/* Bottom Fixed Button */}

      <div className="fixed bottom-0 left-0 right-0 h-[94px] bg-white border-t border-gray-50">
        <div className="px-5 pt-3">
          <Button variantType="primary" sizeType="l" className="w-full">
            구매하기
          </Button>
        </div>
        <div className="h-[30px] flex justify-center items-center">
          <div className="w-[130px] h-[5px] bg-gray-900 rounded-[2px]" />
        </div>
      </div>
    </div>
  )
}

export default PurchaseDetailPage
