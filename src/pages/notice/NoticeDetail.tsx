import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNotice } from "../../queries/useContentQueries.tsx"
import { NoticeDetail as Notice } from "../../types/Content.ts"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import SplashScreen from "@components/Splash.tsx"

const NoticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { setHeader, setNavigation } = useLayout()
  const { data: notice } = useNotice(id!)

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  // TODO: Add loading indicator
  if (!notice) {
    return <SplashScreen />
  }

  return (
    <div className="h-screen max-h-full bg-white p-5">
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
  return (
    <div className="self-stretch flex flex-col gap-3">
      <div className="text-16px font-normal text-gray-900 leading-[26.88px] whitespace-pre-wrap">
        {notice.contents}
      </div>
    </div>
  )
}

export default NoticeDetailPage
