import React, { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"
import { useNotices } from "../../queries/useContentQueries.tsx"
import useIntersection from "../../hooks/useIntersection.tsx"

const NoticePage: React.FC = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  const {
    data: pages,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotices()
  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  const notices = (pages?.pages || []).flatMap((page) => page)

  useEffect(() => {
    setHeader({
      display: true,
      title: "공지사항",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  if (isFetching) {
    return <div className={"w-full text-center mt-20"}>로딩중...</div>
  }

  if (notices.length === 0) {
    return (
      <div className={"w-full text-center mt-20"}>공지사항이 없습니다.</div>
    )
  }

  return (
    <ul className={"divide-y divide-gray-100 px-5"}>
      {notices.map((notice) => (
        <li
          key={notice.code}
          onClick={() => navigate(`/notice/${notice.code}`)}
        >
          <div className={"flex flex-col gap-2 py-5"}>
            <p className={"font-semibold"}>{notice.title}</p>
            <p className={"text-12 text-gray-400"}>{notice.regDate}</p>
          </div>
        </li>
      ))}
      <div className={"h-1"} ref={observerTarget} />
    </ul>
  )
}

export default NoticePage
