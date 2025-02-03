import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SettingIcon from "@assets/icons/SettingIcon.svg?react"
import { Filter } from "@components/Filter.tsx"
import { NotificationCard } from "@components/NotificationCard.tsx"
import { Container } from "@mui/material"
import {
  getSearchType,
  NotificationFilter,
  NotificationSearchType,
} from "../../types/Notification.ts"
import { useNotifications } from "../../queries/useNotificationQueries.tsx"
import useIntersection from "../../hooks/useIntersection.tsx"

const filters = [
  { label: NotificationFilter.ALL, type: "default" },
  { label: NotificationFilter.RESERVATION, type: "default" },
  { label: NotificationFilter.MEMBERSHIP, type: "default" },
  { label: NotificationFilter.POINT, type: "default" },
  { label: NotificationFilter.NOTIFICATION, type: "default" },
]

export const Notification = () => {
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      title: "알림",
      right: (
        <div onClick={() => navigate("/settings/notifications")}>
          <SettingIcon className="w-6 h-6" />
        </div>
      ),
      left: "back",
      onClickBack: () => navigate(-1),
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [])

  const navigate = useNavigate()

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>(
    NotificationFilter.ALL,
  )

  const handleFilterClick = (label: NotificationFilter) => {
    setActiveFilter(label)
  }

  const {
    data: notifications,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useNotifications({
    page: 1,
    searchType: activeFilter
      ? getSearchType(activeFilter)
      : NotificationSearchType.ALL,
  })

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  return (
    <Container
      className={"relative w-full bg-system-bg py-4 h-full overflow-y-scroll"}
    >
      <div className="py-4 px-5 flex gap-2 justify-center">
        {filters.map((filter) => (
          <Filter
            key={filter.label}
            label={filter.label}
            type={filter.type as "default" | "arrow" | "reload"}
            state={
              activeFilter === filter.label
                ? "activeNoShrink"
                : "defaultNoShrink"
            }
            onClick={() => handleFilterClick(filter.label)}
          />
        ))}
      </div>

      <ul>
        {(notifications?.pages.flatMap((page) => page) || []).map(
          (notification, index) => (
            <li key={index} className={`${index && "mt-4"}`}>
              <NotificationCard notification={notification} />
            </li>
          ),
        )}
        <div ref={observerTarget} className={"h-4"} />
      </ul>
    </Container>
  )
}

export default Notification
