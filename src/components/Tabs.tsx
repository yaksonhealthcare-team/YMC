import { Tab, Tabs } from "@mui/material"
import clsx from "clsx"

const TAB_STYLES = {
  "1depth": {
    base: "font-sb text-16px px-[12px] py-[14px] min-w-0",
    active: "text-primary",
    inactive: "text-gray-700",
    indicator: {},
  },
  "2depth": {
    base: "font-sb text-14px",
    active: "text-gray-700",
    inactive: "text-gray-400 border-gray-200",
    indicator: { borderBottom: "2px solid black" },
  },
  "3depth": {
    base: "font-sb text-14px",
    active: "text-gray-700",
    inactive: "text-gray-400 border-gray-200",
    indicator: { borderBottom: "2px solid black" },
  },
  "scroll": {
    base: "font-sb text-14px whitespace-nowrap",
    active: "text-gray-700",
    inactive: "text-gray-400 border-gray-200",
    indicator: { borderBottom: "2px solid black" },
  },
  "fit": {
    base: "font-sb text-14px",
    active: "text-gray-700",
    inactive: "text-gray-400 border-gray-200",
    indicator: { borderBottom: "2px solid black" },
  },
} as const

const CONTAINER_STYLES = {
  "1depth": "",
  "2depth": "border-b border-gray-200 space-x-4",
  "3depth": "border-b border-gray-200 space-x-4",
  "scroll": "border-b border-gray-200 space-x-2",
  "fit": "border-b border-gray-200 space-x-4",
} as const

interface TabItem {
  label: string
  value: string
}

interface CustomTabsProps {
  type: keyof typeof TAB_STYLES
  tabs: TabItem[]
  onChange: (value: string) => void
  activeTab: string
}

export const CustomTabs = ({
  type,
  tabs,
  onChange,
  activeTab,
}: CustomTabsProps) => (
  <Tabs
    centered
    value={activeTab}
    onChange={(_, newValue) => onChange(newValue)}
    variant={type === "scroll" ? "scrollable" : "standard"}
    scrollButtons={type === "scroll" ? "auto" : undefined}
    TabIndicatorProps={{
      sx: TAB_STYLES[type].indicator,
    }}
    className={clsx("flex", CONTAINER_STYLES[type])}
  >
    {tabs.map((tab) => (
      <Tab
        key={tab.value}
        label={tab.label}
        value={tab.value}
        className={clsx(
          TAB_STYLES[type].base,
          activeTab === tab.value
            ? TAB_STYLES[type].active
            : TAB_STYLES[type].inactive,
          type === "fit" && `w-1/${tabs.length}`,
        )}
      />
    ))}
  </Tabs>
)

CustomTabs.displayName = "CustomTabs"
