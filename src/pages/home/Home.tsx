import { Button } from "@mui/material"
// import CustomButton from "../../components/CustomButton"
import ReloadIcon from "@components/icons/Reload"
import CustomButton from "@components/CustomButton"

const Home = () => {
  return (
    <>
      <div className="p-4">
        <Button variant="contained" color="secondary">
          MUI 버튼
        </Button>
      </div>

      <div className="p-4">
        {"Buttons: "}
        <CustomButton
          variantType="primary"
          sizeType="xs"
          iconLeft={<ReloadIcon />}
        >
          Button
        </CustomButton>
        <CustomButton
          variantType="secondary"
          sizeType="xs"
          iconLeft={<ReloadIcon />}
        >
          Button
        </CustomButton>
        <CustomButton
          variantType="line"
          sizeType="xs"
          iconRight={<ReloadIcon />}
        >
          Button
        </CustomButton>
        <CustomButton
          variantType="gray"
          sizeType="xs"
          iconRight={<ReloadIcon />}
        >
          Button
        </CustomButton>
        <CustomButton
          variantType="text"
          sizeType="xs"
          iconRight={<ReloadIcon />}
        >
          Button
        </CustomButton>
      </div>
    </>
  )
}

export default Home
