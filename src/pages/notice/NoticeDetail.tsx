import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"

interface Notice {
  id: string
  title: string
  content: string
  date: string
}

const NoticeDetailPage: React.FC = () => {
  // const { id } = useParams<{ id: string }>()
  const { setHeader, setNavigation } = useLayout()
  const [notice, setNotice] = useState<Notice | null>(null)

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
    })
    setNavigation({ display: false })

    // 공지사항 데이터 가져오는 로직 추가
    const mockNotice: Notice = {
      id: "1",
      title: "공지사항 입니다.",
      content: `안녕하세요.
약손명가를 이용해주시는 사용자 분들께 2023년 9월 18일 진행된 정기 업데이트 내역 및 변동 사항을 안내드립니다.

국회에 제출된 법률안 기타의 의안은 회기중에 의결되지 못한 이유로 폐기되지 아니한다. 다만, 국회의원의 임기가 만료된 때에는 그러하지 아니하다. 누구든지 체포 또는 구속을 당한 때에는 즉시 변호인의 조력을 받을 권리를 가진다.

다만, 형사피고인이 스스로 변호인을 구할 수 없을 때에는 법률이 정하는 바에 의하여 국가가 변호인을 붙인다.

의무교육은 무상으로 한다. 재의의 요구가 있을 때에는 국회는 재의에 붙이고, 재적의원과반수의 출석과 출석의원 3분의 2 이상의 찬성으로 전과 같은 의결을 하면 그 법률안은 법률로서 확정된다.`,
      date: "2024.08.24",
    }
    setNotice(mockNotice)
  }, [setHeader, setNavigation])

  if (!notice) {
    return <div>Loading...</div>
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
        {/*TODO: 아이콘 추가*/}
        <div className="text-14px font-medium text-gray-500">{notice.date}</div>
      </div>
    </div>
  )
}

const NoticeContent: React.FC<{ notice: Notice }> = ({ notice }) => {
  return (
    <div className="self-stretch flex flex-col gap-3">
      <div className="text-16px font-normal text-gray-900 leading-[26.88px] whitespace-pre-wrap">
        {notice.content}
      </div>
    </div>
  )
}

export default NoticeDetailPage
