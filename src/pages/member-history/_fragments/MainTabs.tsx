import { useNavigate, useLocation } from "react-router-dom"
import { CustomTabs } from "@components/Tabs"
import { MemberHistoryTab, MemberHistoryState } from "types/MemberHistory"

const mainTabs = [
  { label: "예약", value: "reservation" },
  { label: "회원권", value: "membership" },
]

const MainTabs = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as MemberHistoryState
  const activeTab =
    state?.activeTab || (location.pathname.split("/").pop() as MemberHistoryTab)

  const handleOnChangeTab = (value: MemberHistoryTab) => {
    navigate(`/member-history/${value}`, {
      state: { ...state, activeTab: value },
    })
  }

  return (
    <CustomTabs
      type="1depth"
      tabs={mainTabs}
      onChange={(value) => handleOnChangeTab(value as MemberHistoryTab)}
      activeTab={activeTab}
      className="py-2"
    />
  )
}

export default MainTabs
