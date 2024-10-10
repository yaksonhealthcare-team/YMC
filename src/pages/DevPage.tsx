import { useLayout } from "../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button.tsx"
import ReloadIcon from "@components/icons/ReloadIcon.tsx"
import TextField from "@components/TextField.tsx"
import { TextArea } from "@components/TextArea.tsx"
import { SearchField } from "@components/SearchField.tsx"
import { CustomTabs as Tabs } from "@components/Tabs.tsx"
import { Tag } from "@components/Tag.tsx"

const DevPage = () => {
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      title: "Home",
      right: <div>Header Right</div>,
      left: <div onClick={() => navigate(-1)}>{"<"} Back</div>,
    })
    setNavigation({ display: true })
  }, [])

  const navigate = useNavigate()

  const [value, setValue] = useState("")

  const [activeTab, setActiveTab] = useState("reservation")

  const tabs = [
    { label: "예약", value: "reservation" },
    { label: "회원권", value: "membership" },
  ]

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <>
      <div className="p-4">
        {"Buttons: "}
        <Button variantType="primary" sizeType="xs" iconLeft={<ReloadIcon />}>
          Button
        </Button>
        <Button variantType="secondary" sizeType="xs" iconLeft={<ReloadIcon />}>
          Button
        </Button>
        <Button variantType="line" sizeType="xs" iconRight={<ReloadIcon />}>
          Button
        </Button>
        <Button variantType="gray" sizeType="xs" iconRight={<ReloadIcon />}>
          Button
        </Button>
        <Button variantType="text" sizeType="xs" iconRight={<ReloadIcon />}>
          Button
        </Button>
      </div>
      <div className="p-4">
        {"TextFields: "}
        <TextField
          placeholder="Enter your name"
          label="Label goes here"
          helperText="Hint message goes here"
          value={value}
          state="default"
          iconRight={<ReloadIcon />}
          button
          onChange={(e: any) => setValue(e.target.value)}
        />
      </div>
      <div className="p-4">
        {"TextArea: "}
        <TextArea
          placeholder="Enter your name"
          label="Label goes here"
          helperText="Hint message goes here"
          maxLength={100}
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
        />
      </div>
      <div className="p-4">
        {"SearchField: "}
        <SearchField
          placeholder="도로명, 건물명, 지번으로 검색하세요."
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          onClear={() => setValue("")}
        />
      </div>
      <div className="p-4">
        {"Tab: "}
        <Tabs
          type="1depth" // 원하는 탭 타입 설정
          tabs={tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>
      <div className="p-4">
        {"Tag: "}
        <Tag type="used" title="사용완료" />
        <Tag type="unused" title="사용가능" />
        <Tag type="rect" title="전체지점" />
        <Tag type="round" title="전체지점" />
        <Tag type="green" title="Free" />
        <Tag type="blue" title="사용" />
        <Tag type="red" title="적립" />
      </div>
      <div className="p-4">
        <Button
          variantType="primary"
          sizeType="s"
          onClick={() => navigate("logout")}
        >
          로그아웃
        </Button>
      </div>
    </>
  )
}

export default DevPage
