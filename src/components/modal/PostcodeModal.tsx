import DaumPostcode from "react-daum-postcode"
import { Address } from "react-daum-postcode/lib/loadPostcode"

interface PostcodeModalProps {
  setIsPostcodeOpen: (isOpen: boolean) => void
  handleCompletePostcode: (address: Address) => void
}

const PostcodeModal = ({
  setIsPostcodeOpen,
  handleCompletePostcode,
}: PostcodeModalProps) => {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={() => setIsPostcodeOpen(false)}
      >
        <div
          className="w-[90%] max-w-[430px] h-[90%] min-h-[480px] max-h-[530px] bg-white overflow-hidden shadow-md !font-11px"
          onClick={(e) => e.stopPropagation()}
        >
          <DaumPostcode
            onComplete={handleCompletePostcode}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </>
  )
}

export default PostcodeModal
