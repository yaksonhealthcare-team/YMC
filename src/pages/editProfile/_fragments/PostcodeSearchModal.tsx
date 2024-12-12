import DaumPostcode from "react-daum-postcode"
import { Address } from "react-daum-postcode/lib/loadPostcode"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"

interface PostcodeSearchModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  onComplete: (address: Address) => void
}

const PostcodeSearchModal = ({
  open,
  setOpen,
  onComplete,
}: PostcodeSearchModalProps) => {
  if (!open) return null

  return (
    <div
      className={
        "fixed top-0 left-0 w-screen h-screen flex flex-col justify-stretch z-50"
      }
    >
      <div className={"w-full bg-white px-5 py-3 flex"}>
        <button className={"basis-1/4"} onClick={() => setOpen(false)}>
          <CaretLeftIcon className={"w-5 h-5"} />
        </button>
        <p className={"basis-1/2 text-center font-sb"}>{"주소 검색"}</p>
      </div>
      <DaumPostcode
        className={"w-full h-full"}
        onComplete={(address) => {
          onComplete({ ...address })
          setOpen(false)
        }}
      />
    </div>
  )
}

export default PostcodeSearchModal
