import { CustomTabs } from "@components/Tabs"
import { useLocation, useNavigate } from "react-router-dom"

type MemberHistoryTab = "reservation" | "membership"

const mainTabs = [
  { label: "예약", value: "reservation" },
  { label: "회원권", value: "membership" },
]

const TabsContent = ({ activeTab }: { activeTab: MemberHistoryTab }) => {
  const navigate = useNavigate()

  const handleOnChangeTab = (value: MemberHistoryTab) => {
    navigate(`/member-history/${value}`)
  }

  return (
    <CustomTabs
      type="1depth"
      tabs={mainTabs}
      onChange={(value) => handleOnChangeTab(value as MemberHistoryTab)}
      activeTab={activeTab}
    />
  )
}

const MainTabs = () => {
  const location = useLocation()
  const activeTab = location.pathname.split("/").pop() as MemberHistoryTab

  return <TabsContent activeTab={activeTab} />
}

export default MainTabs
