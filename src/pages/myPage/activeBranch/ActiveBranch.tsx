import { useLayout } from "../../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import InformationIcon from "@assets/icons/InformationIcon.svg?react"
import { useOverlay } from "../../../contexts/ModalContext.tsx"
import { Button } from "@components/Button.tsx"
import BranchCard from "@components/BranchCard.tsx"
import { useQuery } from "@tanstack/react-query"
import { Branch, getActiveBranches } from "@apis/branch"
import SplashScreen from "@components/Splash"

const InformationBottomSheet = ({ onClose }: { onClose: () => void }) => (
  <div className={"flex flex-col"}>
    <p className={"font-sb text-18px mt-5"}>{"이용 지점 변경 안내"}</p>
    <p className={"mt-2"}>
      {"지점 및 회원권 이동은 현재 이용 지점에"}
      <br />
      {"유선으로 문의하여 주세요."}
    </p>
    <div className={"mt-10 h-[1px] bg-gray-50 w-full"} />
    <div className={"flex gap-2 w-full justify-stretch mt-3"}>
      <Button className={"w-full"} variantType={"primary"} onClick={onClose}>
        <p>{"확인"}</p>
      </Button>
    </div>
  </div>
)

const ActiveBranch = () => {
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: ["activeBranches"],
    queryFn: getActiveBranches,
  })

  const handleClickInformation = () => {
    openBottomSheet(<InformationBottomSheet onClose={closeOverlay} />)
  }

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      title: "이용 중인 지점",
      right: (
        <button onClick={handleClickInformation}>
          <InformationIcon />
        </button>
      ),
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <div className={"w-full h-full p-5"}>
      <ul className={"space-y-3"}>
        {branches.map((branch, index) => (
          <li key={index} className={"p-5 rounded-2xl border border-gray-100"}>
            <BranchCard name={branch.name} address={branch.address} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActiveBranch
