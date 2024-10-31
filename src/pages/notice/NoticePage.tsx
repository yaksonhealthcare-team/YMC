import React, { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { useNavigate } from "react-router-dom"
import PageContainer from "@components/PageContainer.tsx"

interface Notice {
  id: string
  title: string
  date: string
}

const NoticePage: React.FC = () => {
  const { setHeader, setNavigation } = useLayout()
  const [notices, setNotices] = useState<Notice[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      title: "공지사항",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
    })
    setNavigation({ display: false })

    // 공지사항 데이터 가져오는 로직 추가
    const mockNotices: Notice[] = [
      {
        id: "1",
        title: "한줄 공지 제목입니다.",
        date: "2024.08.24",
      },
      {
        id: "2",
        title:
          "두줄 공지 제목입니다. 두줄 공지 제목입니다. 두줄 공지 제목입니다.",
        date: "2024.08.24",
      },
      // 더 많은 공지사항 데이터
    ]
    setNotices(mockNotices)
  }, [setHeader, setNavigation])

  return (
    <PageContainer>
      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white px-5 py-4 flex flex-col gap-2"
            onClick={() => navigate(`/notice/${notice.id}`)}
          >
            <div className="font-bold text-16px text-gray-900">
              {notice.title}
            </div>
            <div className="text-12px text-gray-400">{notice.date}</div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

export default NoticePage
