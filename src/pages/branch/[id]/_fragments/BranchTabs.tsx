import { CustomTabs as Tabs } from '@/shared/ui/tabs/Tabs';
import { BranchDetail as BranchDetailType } from '@/entities/branch/model/Branch';
import { memo } from 'react';
import BranchInformation from './BranchInformation';
import ProgramList from './ProgramList';

const BRANCH_DETAIL_TABS = {
  programs: '관리프로그램',
  information: '기본정보'
} as const;

type BranchDetailTab = keyof typeof BRANCH_DETAIL_TABS;

interface BranchTabsProps {
  selectedTab: BranchDetailTab;
  onChangeTab: (tab: BranchDetailTab) => void;
  branch: BranchDetailType;
}

const TabContent = memo(({ selectedTab, branch }: { selectedTab: BranchDetailTab; branch: BranchDetailType }) => {
  switch (selectedTab) {
    case 'programs':
      return <ProgramList brandCode={branch.brandCode} />;
    case 'information':
    default:
      return <BranchInformation branch={branch} />;
  }
});

const BranchTabs = memo(({ selectedTab, onChangeTab, branch }: BranchTabsProps) => {
  return (
    <>
      <Tabs
        type={'fit'}
        tabs={Object.entries(BRANCH_DETAIL_TABS).map(([value, label]) => ({
          value: value,
          label: label
        }))}
        onChange={(value: string) => onChangeTab(value as BranchDetailTab)}
        activeTab={selectedTab}
      />
      <TabContent selectedTab={selectedTab} branch={branch} />
    </>
  );
});

export default BranchTabs;
