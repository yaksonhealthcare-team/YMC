import React, { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"
import { Notice } from "types/Content"
import { EmptyCard } from "@components/EmptyCard"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchNotices } from "apis/contents.api"

const NoticePage: React.FC = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  const {
    data: pages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Notice[]>({
    queryKey: ["notices"],
    queryFn: async ({ pageParam }) => fetchNotices(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
    initialPageParam: 1,
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

  if (isFetchingNextPage) {
    return <div className={"w-full text-center mt-20"}>로딩중...</div>
  }

  return (
    <div className="flex flex-col gap-6 pb-[100px]">
      {notices && notices.length > 0 ? (
        <div className="flex flex-col gap-3 px-5">
          {notices.map((notice: Notice) => (
            <div
              key={notice.code}
              className="flex flex-col gap-4 bg-white pb-4 rounded-[20px] border border-gray-100"
              onClick={() => navigate(`/notice/${notice.code}`)}
            >
              <div className="flex flex-col px-5 gap-1.5">
                <span className="font-b text-16px text-gray-700">
                  {notice.title}
                </span>
                <span className="font-r text-12px text-gray-600">
                  {notice.regDate}
                </span>
              </div>
            </div>
          ))}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-2 text-gray-600 text-14px font-m"
            >
              {isFetchingNextPage ? "로딩중..." : "더보기"}
            </button>
          )}
        </div>
      ) : (
        <EmptyCard
          title={`등록된 공지사항이 없어요.\n새로운 공지사항이 등록되면 알려드릴게요.`}
        />
      )}
    </div>
  )
}

export default NoticePage
