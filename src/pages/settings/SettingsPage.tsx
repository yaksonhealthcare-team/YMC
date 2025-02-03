import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import Switch from "@components/Switch.tsx"
import { useNotificationSettings } from "../../queries/useNotificationQueries"

const SettingsPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const { data: settings, isLoading } = useNotificationSettings()

  useEffect(() => {
    setHeader({
      left: "back",
      title: "알림설정",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  if (isLoading) {
    return (
      <div className={"flex flex-col px-5 divide-y divide-gray-100"}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between py-6">
            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-10 h-5 bg-gray-200 animate-pulse rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={"flex flex-col px-5 divide-y divide-gray-100"}>
      <div className={"flex justify-between py-6"}>
        <p>{"예약 알림"}</p>
        <Switch.IOS
          checked={settings?.reservations ?? false}
          onChange={() => {
            // TODO: 알림 설정 변경 API 구현 필요
            console.log("Toggle reservations")
          }}
        />
      </div>

      <div className={"flex justify-between py-6"}>
        <p>{"결제 알림"}</p>
        <Switch.IOS
          checked={settings?.payments ?? false}
          onChange={() => {
            // TODO: 알림 설정 변경 API 구현 필요
            console.log("Toggle payments")
          }}
        />
      </div>

      <div className={"flex justify-between py-6"}>
        <p>{"포인트 알림"}</p>
        <Switch.IOS
          checked={settings?.points ?? false}
          onChange={() => {
            // TODO: 알림 설정 변경 API 구현 필요
            console.log("Toggle points")
          }}
        />
      </div>

      <div className={"flex justify-between py-6"}>
        <p>{"공지 알림"}</p>
        <Switch.IOS
          checked={settings?.notices ?? false}
          onChange={() => {
            // TODO: 알림 설정 변경 API 구현 필요
            console.log("Toggle notices")
          }}
        />
      </div>
    </div>
  )
}

export default SettingsPage
