import { useLayout } from "../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button.tsx"
import ReloadIcon from "@components/icons/ReloadIcon.tsx"
import TextField from "@components/CustomTextField.tsx"
import { TextArea } from "@components/TextArea.tsx"
import { SearchField } from "@components/SearchField.tsx"
import { CustomTabs as Tabs } from "@components/Tabs.tsx"
import { Filter } from "@components/Filter.tsx"
import { Tag } from "@components/Tag.tsx"
import { FloatingButton } from "@components/FloatingButton.tsx"
import { SearchFloatingButton } from "@components/SearchFloatingButton.tsx"
import { Divider } from "@components/Divider.tsx"
import { Title } from "@components/Title.tsx"
import { Header } from "@components/Header.tsx"
import ShareIcon from "@assets/icons/ShareIcon.svg?react"
import { Indicator } from "@components/Indicator.tsx"
import { Notice } from "@components/Notice.tsx"
import { Number } from "@components/Number.tsx"

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

  // Indicator
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 3 // 총 슬라이드 수 (예시로 3개 설정)
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
  }

  // Number
  const [number, setNumber] = useState(3)
  const handleClickMinus = (count: number) => {
    if (count > 0) setNumber(--count)
  }
  const handleClickPlus = (ount: number) => {
    setNumber(++ount)
  }

  return (
    <>
      <div className="p-4 border-t">
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
      <div className="p-4 border-t">
        {"TextFields: "}
        <TextField
          placeholder="Enter your name"
          label="Label goes here"
          helperText="Hint message goes here"
          value={value}
          state="default"
          iconRight={<ReloadIcon />}
          button
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
        />
      </div>
      <div className="p-4 border-t">
        {"TextArea: "}
        <TextArea
          placeholder="Enter your name"
          label="Label goes here"
          helperText="Hint message goes here"
          maxLength={100}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
        />
      </div>
      <div className="p-4 border-t">
        {"SearchField: "}
        <SearchField
          placeholder="도로명, 건물명, 지번으로 검색하세요."
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          onClear={() => setValue("")}
        />
      </div>
      <div className="p-4 border-t">
        {"Tab: "}
        <Tabs
          type="1depth" // 원하는 탭 타입 설정
          tabs={tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>
      <div className="p-4 border-t">
        {"Filters: "}
        <Filter type="default" state="default" label="브랜드" />
        <Filter type="arrow" state="default" label="브랜드" />
        <Filter type="default" state="active" label="브랜드" />
        <Filter type="arrow" state="active" label="브랜드" />
        <Filter type="reload" />
      </div>
      <div className="p-4 border-t">
        {"Tags: "}
        <Tag type="used" title="사용완료" />
        <Tag type="unused" title="사용가능" />
        <Tag type="rect" title="전체지점" />
        <Tag type="round" title="전체지점" />
        <Tag type="green" title="Free" />
        <Tag type="blue" title="사용" />
        <Tag type="red" title="적립" />
      </div>
      <div className="p-4 border-t">
        {"FloatingButton: "}
        <div className="flex">
          <FloatingButton
            type="location"
            onClick={() => {
              alert("FloatingButton Clicked")
            }}
          />
          <FloatingButton
            type="top"
            onClick={() => {
              alert("FloatingButton Clicked")
            }}
          />
          <FloatingButton
            type="search"
            onClick={() => {
              alert("FloatingButton Clicked")
            }}
          />
          <FloatingButton
            type="reserve"
            onClick={() => {
              alert("FloatingButton Clicked")
            }}
          />
          <FloatingButton
            type="membership"
            onClick={() => {
              alert("FloatingButton Clicked")
            }}
          />
        </div>
      </div>
      <div className="p-4 border-t">
        {"SearchFloatingButton: "}
        <div className="flex">
          <SearchFloatingButton
            type="list"
            title="목록보기"
            onClick={() => {
              alert("FloatingButton Clicked")
            }}
          />
          <SearchFloatingButton
            type="search"
            title="지도보기"
            onClick={() => {
              alert("FloatingButton Clicked")
            }}
          />
        </div>
      </div>
      <div className="p-4 border-t">
        {"Dividers: "}
        <div className="p-4 bg-black text-white flex flex-col gap-2 items-center">
          <Divider type="m" />
          <Divider type="s_100" />
          <Divider type="s_200" />
          <Divider type="r" />
        </div>
      </div>
      <div className="p-4 border-t">
        {"Title: "}
        <Title
          type="arrow"
          title="예정된 예약"
          count="3건"
          onClick={() => {
            alert("button clicked")
          }}
        />
        <Title title="예정된 예약" />
      </div>
      <div className="p-4 border-t bg-gray-200">
        {"Header: "}
        <Header
          type="location"
          title="서울 강남구 테헤란로78길 14-10"
          onClickLocation={() => {
            alert("Location Clicked")
          }}
          onClickLeft={() => {
            alert("Left Icon Clicked")
          }}
          onClickRight={() => {
            alert("Right Icon Clicked")
          }}
        />
        <Header type="back_w" />
        <Header type="back_b" />
        <Header type="back_title" title="Title" />
        <Header
          type="back_title_icon"
          iconRight={<ShareIcon />}
          title="Title"
        />
        <Header
          type="two_icon"
          iconLeft={<ShareIcon />}
          iconRight={<ShareIcon />}
        />
        <Header type="back_title_text" title="Title" textRight="저장" />
        <Header
          type="title_right_icon"
          title="Title"
          iconRight={<ShareIcon />}
        />
      </div>
      <div className="p-4 border-t">
        {"Indicator: "}
        <Indicator
          total={totalSlides}
          current={currentSlide}
          onChange={handleSlideChange}
        />
      </div>
      <div className="p-4 border-t">
        {"Notice: "}
        <Notice
          title="9월 1일 회원권 변경사항 안내드립니다."
          onClick={() => {
            alert("Button Clicked")
          }}
        />
      </div>
      <div className="p-4 border-t">
        {"Number: "}
        <Number
          count={number}
          onClickMinus={() => handleClickMinus(number)}
          onClickPlus={() => handleClickPlus(number)}
        />
      </div>
      <div className="p-4 border-t">
        <Button
          variantType="primary"
          sizeType="s"
          onClick={() => navigate("/logout")}
        >
          로그아웃
        </Button>
      </div>
    </>
  )
}

export default DevPage
