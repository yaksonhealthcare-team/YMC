import ReloadIcon from "@components/icons/ReloadIcon"
import Button from "@components/Button"
import TextField from "@components/TextField"
import TextArea from "@components/TextArea"
import SearchField from "@components/SearchField"
import { useState } from "react"

const Home = () => {
  const [value, setValue] = useState("")

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
          onClear={(e: any) => setValue("")}
        />
      </div>
    </>
  )
}

export default Home
