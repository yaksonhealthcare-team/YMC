import { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button.tsx"
import { Branch } from "../../types/Branch.ts"
import Step1SearchBranchList from "./Step1SearchBranchList.tsx"
import Step2SelectedBranchList from "./Step2SelectedBranchList.tsx"
import Step3Finish from "./Step3Finish.tsx"

const AddUsingBranch = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const [pageStep, setPageStep] = useState(1)
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([])

  const handleBack = () => {
    if (pageStep === 1) {
      navigate(-1)
    } else {
      setPageStep(pageStep - 1)
    }
  }

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      onClickBack: handleBack,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation, pageStep])

  const handleNextStep = () => {
    if (pageStep === 3) {
      navigate("/questionnaire/common")
    }

    setPageStep(pageStep + 1)
  }

  const handleSkip = () => {
    navigate("/")
  }

  return (
    <>
      {pageStep === 1 && (
        <Step1SearchBranchList
          selectedBranches={selectedBranches}
          setSelectedBranches={setSelectedBranches}
        />
      )}
      {pageStep === 2 && (
        <Step2SelectedBranchList selectedBranches={selectedBranches} />
      )}
      {pageStep === 3 && <Step3Finish />}

      <div className="w-full px-[20px] pt-[12px] pb-[30px] bg-[#FFFFFF] border-t border-[#F8F8F8]">
        {pageStep === 3 && (
          <button
            className="w-full bg-transparent text-primary-300 mb-[8px] h-[48px] font-semibold text-[16px]"
            onClick={handleSkip}
          >
            나중에 등록할래요
          </button>
        )}

        <Button className="w-full" onClick={handleNextStep}>
          {pageStep === 1 && "다음"}
          {pageStep === 2 && "회원 정보 연동하기"}
          {pageStep === 3 && "문진 작성하기"}
        </Button>
      </div>
    </>
  )
}

export default AddUsingBranch
