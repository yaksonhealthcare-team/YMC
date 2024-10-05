import ReloadIcon from "@components/icons/ReloadIcon"
import Button from "@components/Button"
import TextField from "@components/TextField"
import TextArea from "@components/TextArea"
import SearchField from "@components/SearchField"
import Tabs from "@components/Tabs"
import { ChangeEvent, useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"
import { useOverlay } from "../../contexts/ModalContext.tsx"

const Home = () => {
  const { setHeader, setNavigation } = useLayout()
  const { openMessageBox, openBottomSheet, showAlert } = useOverlay()

  const navigate = useNavigate()
  useEffect(() => {
    setHeader({
      display: true,
      title: "Home",
      right: <div>Header Right</div>,
      left: <div>Header Left</div>,
    })

    setNavigation({ display: true })
  }, [])

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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
        />
      </div>
      <div className="p-4">
        {"SearchField: "}
        <SearchField
          placeholder="도로명, 건물명, 지번으로 검색하세요."
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
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
        <Button
          variantType="primary"
          sizeType="s"
          onClick={() => navigate("logout")}
        >
          로그아웃
        </Button>
      </div>
      <div className="p-4 flex gap-2">
        <Button
          variant="contained"
          onClick={() => openMessageBox("이것은 메시지박스입니다.")}
        >
          메시지박스 열기
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            openBottomSheet(
              "지점 및 회원권 이동은 현재 이용 지점에 유선으로 문의하여 주세요.",
              {
                title: "이용 지점 변경 안내",
                buttons: [
                  {
                    text: "예약하기",
                    onClick: () => console.log("예약하기 클릭"),
                    variant: "contained",
                  },
                ],
              },
            )
          }
        >
          바텀시트 열기
        </Button>
        <Button
          variant="contained"
          onClick={() => showAlert("주의하세요!", { title: "경고" })}
        >
          알럿 보여주기
        </Button>
      </div>
    </>
  )
}

export default Home
