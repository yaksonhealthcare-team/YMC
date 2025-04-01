import React, { useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNotice } from "../../queries/useContentQueries.tsx"
import { NoticeDetail as Notice } from "../../types/Content.ts"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { Image } from "@components/common/Image"

const NoticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = location.state?.from || "/mypage"
  const { setHeader, setNavigation } = useLayout()
  const { data: notice, isLoading, isError } = useNotice(id!)

  // 페이지 마운트 시 상위 스크롤 컨테이너 초기화
  useEffect(() => {
    // 스크롤 컨테이너 찾기
    const scrollContainer = document.querySelector('.max-w-\\[500px\\].mx-auto.bg-white.h-full.max-h-full.overflow-y-scroll');
    if (scrollContainer) {
      // 타이밍 이슈 방지를 위해 약간 지연시켜 실행
      setTimeout(() => {
        (scrollContainer as HTMLElement).scrollTop = 0;
      }, 0);
    }
  }, []);

  // 뒤로가기 클릭 핸들러 정의
  const handleBack = () => {
    // 먼저 상위 스크롤 컨테이너 초기화
    const scrollContainer = document.querySelector('.max-w-\\[500px\\].mx-auto.bg-white.h-full.max-h-full.overflow-y-scroll');
    if (scrollContainer) {
      (scrollContainer as HTMLElement).scrollTop = 0;
    }
    
    // 이후 페이지 이동
    navigate("/notice", { state: { from: fromPath } });
  };

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "bg-white",
      onClickBack: handleBack,
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation, navigate, fromPath])

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  if (isError || !notice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">공지사항을 불러올 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-5">
      <div className="flex flex-col gap-6">
        <NoticeHeader notice={notice} />
        <div className="w-full h-[1px] bg-[#ECECEC] rounded-[1px]"></div>
        <NoticeContent notice={notice} />
      </div>
    </div>
  )
}

const NoticeHeader: React.FC<{ notice: Notice }> = ({ notice }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-18px font-bold text-gray-900">{notice.title}</div>
      <div className="flex items-center gap-2">
        <CalendarIcon className={"w-[14px] h-[14px]"} />
        <div className="text-14px font-medium text-gray-500">
          {notice.regDate}
        </div>
      </div>
    </div>
  )
}

const NoticeContent: React.FC<{ notice: Notice }> = ({ notice }) => {
  if (!notice.contents) {
    return null
  }

  return (
    <div className="self-stretch flex flex-col gap-3">
      <div className="text-16px font-normal text-gray-900 leading-[26.88px] whitespace-pre-wrap">
        {notice.contents}
      </div>
      {notice.files?.length > 0 && notice.files[0].fileurl && (
        <div className="mt-4 mb-[24px]">
          <Image
            src={notice.files[0].fileurl}
            alt="공지사항 이미지"
            className="w-full rounded-lg"
          />
        </div>
      )}
    </div>
  )
}

export default NoticeDetailPage
