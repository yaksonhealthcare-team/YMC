import { memo } from "react"
import { CustomTabs as Tabs } from "@components/Tabs"
import TherapistList from "./TherapistList"
import ProgramList from "./ProgramList"
import BranchInformation from "./BranchInformation"
import { BranchDetail as BranchDetailType } from "types/Branch"

const branchDetailTabs = ["programs", "information"] as const
type BranchDetailTab = (typeof branchDetailTabs)[number]

const BranchDetailTabs: Record<BranchDetailTab, string> = {
  "programs": "관리프로그램",
  "information": "기본정보",
}

interface BranchTabsProps {
  selectedTab: BranchDetailTab
  onChangeTab: (tab: BranchDetailTab) => void
  branch: BranchDetailType
}

const TabContent = memo(
  ({
    selectedTab,
    branch,
  }: {
    selectedTab: BranchDetailTab
    branch: BranchDetailType
  }) => {
    switch (selectedTab) {
      case "programs":
        return <ProgramList brandCode={branch.brandCode} />
      case "information":
      default:
        return <BranchInformation branch={branch} />
    }
  },
)

const BranchTabs = memo(
  ({ selectedTab, onChangeTab, branch }: BranchTabsProps) => {
    return (
      <>
        <Tabs
          type={"fit"}
          tabs={Object.entries(BranchDetailTabs).map(([value, label]) => ({
            value: value,
            label: label,
          }))}
          onChange={(value: string) => onChangeTab(value as BranchDetailTab)}
          activeTab={selectedTab}
        />
        <TabContent selectedTab={selectedTab} branch={branch} />
      </>
    )
  },
)

export default BranchTabs
