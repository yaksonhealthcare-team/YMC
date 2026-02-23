import { Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import clsx from 'clsx';

interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CustomTabsProps {
  type?: '1depth' | '2depth' | '3depth' | 'scroll' | 'fit';
  tabs: TabItem[];
  onChange?: (value: string) => void;
  activeTab?: string;
  className?: string;
}

export const CustomTabs = ({ type = 'fit', tabs, onChange, activeTab: propActiveTab, className }: CustomTabsProps) => {
  const validActiveTab = tabs.some((tab) => tab.value === propActiveTab);
  const activeTab = validActiveTab ? propActiveTab : tabs[0]?.value || '';

  const handleChange = useCallback(
    (_: React.SyntheticEvent, newValue: string) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  const getTypeStyles = (type: string, isActive: boolean) => {
    switch (type) {
      case '1depth':
        return clsx('font-sb text-16px px-[12px] py-[14px] min-w-0', isActive ? 'text-primay' : 'text-gray-700');
      case '2depth':
        return clsx('font-sb text-14px', isActive ? 'text-gray-700' : 'text-gray-400 border-gray-200');
      case '3depth':
        return clsx('font-sb text-14px', isActive ? 'text-gray-700' : 'text-gray-400 border-gray-200');
      case 'scroll':
        return clsx(
          'font-sb text-14px',
          isActive ? 'text-gray-700' : 'text-gray-400 border-gray-200',
          'whitespace-nowrap'
        );
      case 'fit':
        return clsx(
          `font-sb text-14px w-1/${tabs.length}`,
          isActive ? 'text-gray-700' : 'text-gray-400 border-gray-200'
        );
      default:
        return '';
    }
  };

  const getIndicatorStyles = (type: string) => {
    switch (type) {
      case '1depth':
        return {};
      default:
        return { borderBottom: '2px solid black' };
    }
  };

  return (
    <div role="tablist" aria-label="탭 메뉴" className={clsx(className)}>
      <Tabs
        centered
        value={activeTab}
        onChange={handleChange}
        variant={type === 'scroll' ? 'scrollable' : 'standard'}
        scrollButtons={type === 'scroll' ? 'auto' : undefined}
        TabIndicatorProps={{
          sx: getIndicatorStyles(type)
        }}
        className={clsx(
          'flex',
          type === '1depth' ? undefined : 'border-b border-gray-200',
          type === 'scroll' ? 'space-x-2' : 'space-x-4'
        )}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            disabled={tab.disabled}
            role="tab"
            aria-selected={activeTab === tab.value}
            aria-controls={`tabpanel-${tab.value}`}
            className={clsx(getTypeStyles(type, activeTab === tab.value))}
          />
        ))}
      </Tabs>
    </div>
  );
};

CustomTabs.displayName = 'CustomTabs';
