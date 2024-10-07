import React from "react"
import { Tabs, Tab } from "@mui/material"
import clsx from "clsx"

interface TabItem {
  label: string
  value: string
}

interface CustomTabsProps {
  type: "1depth" | "2depth" | "3depth" | "scroll" // 탭 타입
  tabs: TabItem[] // 동적으로 받을 탭 데이터
  onChange: (value: string) => void // 탭 변경 시 호출할 함수
  activeTab: string // 현재 활성화된 탭
}

export const CustomTabs = (props: CustomTabsProps) => {
  const { type, tabs, onChange, activeTab } = props

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onChange(newValue)
  }

  // 타입에 따른 스타일을 동적으로 적용
  const getTypeStyles = (type: string, isActive: boolean) => {
    switch (type) {
      case "1depth":
        return clsx(
          "font-sb text-16px px-[12px] py-[14px] min-w-0",
          isActive ? "text-primay" : "text-gray-700",
        )
      case "2depth":
        return clsx(
          "font-sb text-14px",
          isActive ? "text-gray-700" : "text-gray-400 border-gray-200",
        )
      case "3depth":
        return clsx(
          "font-sb text-14px",
          isActive ? "text-gray-700" : "text-gray-400 border-gray-200",
        )
      case "scroll":
        return clsx(
          "font-sb text-14px",
          isActive ? "text-gray-700" : "text-gray-400 border-gray-200",
          "whitespace-nowrap",
        )
      default:
        return ""
    }
  }

  // MUI의 Tab 컴포넌트에 직접 sx 속성으로 border-bottom을 제어
  const getIndicatorStyles = (type: string) => {
    switch (type) {
      case "1depth":
        return {}
      default:
        return { borderBottom: "2px solid black" } // 검정색 밑줄
    }
  }

  return (
    <div>
      <Tabs
        centered
        value={activeTab}
        onChange={handleChange}
        variant={type === "scroll" ? "scrollable" : "standard"} // 스크롤 여부 설정
        scrollButtons={type === "scroll" ? "auto" : undefined}
        TabIndicatorProps={{
          sx: getIndicatorStyles(type), // 밑줄 스타일 설정
        }}
        className={clsx(
          "flex",
          type === "1depth" ? undefined : "border-b border-gray-200",
          type === "scroll" ? "space-x-2" : "space-x-4",
        )}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            className={clsx(getTypeStyles(type, activeTab === tab.value))}
          />
        ))}
      </Tabs>
    </div>
  )
}
