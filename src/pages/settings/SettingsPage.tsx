import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import Switch from "@components/Switch.tsx"

const SettingsPage = () => {
  const { setHeader, setNavigation } = useLayout()

  const [notifications, setNotifications] = useState({
    reservations: true,
    payments: false,
    points: true,
    notices: true,
  })

  useEffect(() => {
    setHeader({
      left: "back",
      title: "알림설정",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className={"flex flex-col px-5 divide-y divide-gray-100"}>
      <div className={"flex justify-between py-6"}>
        <p>{"예약 알림"}</p>
        <Switch.IOS
          checked={notifications.reservations}
          onChange={(e) =>
            setNotifications((prev) => ({
              ...prev,
              reservations: e.target.checked,
            }))
          }
        />
      </div>

      <div className={"flex justify-between py-6"}>
        <p>{"결제 알림"}</p>
        <Switch.IOS
          checked={notifications.payments}
          onChange={(event) =>
            setNotifications((prev) => ({
              ...prev,
              payments: event.target.checked,
            }))
          }
        />
      </div>

      <div className={"flex justify-between py-6"}>
        <p>{"포인트 알림"}</p>
        <Switch.IOS
          checked={notifications.points}
          onChange={(event) =>
            setNotifications((prev) => ({
              ...prev,
              points: event.target.checked,
            }))
          }
        />
      </div>

      <div className={"flex justify-between py-6"}>
        <p>{"공지 알림"}</p>
        <Switch.IOS
          checked={notifications.notices}
          onChange={(event) =>
            setNotifications((prev) => ({
              ...prev,
              notices: event.target.checked,
            }))
          }
        />
      </div>
    </div>
  )
}

export default SettingsPage
