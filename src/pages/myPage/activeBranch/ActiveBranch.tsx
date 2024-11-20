import { useLayout } from "../../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import InformationIcon from "@assets/icons/InformationIcon.svg?react"
import { useOverlay } from "../../../contexts/ModalContext.tsx"
import { Button } from "@components/Button.tsx"
import BranchCard from "@components/BranchCard.tsx"

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

  const handleClickInformation = () => {
    openBottomSheet(<InformationBottomSheet onClose={closeOverlay} />)
  }

  const branches: { name: string; address: string }[] = Array(5)
    .fill([
      {
        name: "약손명가 강남구청역점",
        address: "서울특별시 강남구 테헤란로78길 14-10 1층",
      },
      {
        name: "달리아 스파 강남점",
        address: "서울특별시 강남구 테헤란로78길 14-10 1층",
      },
      {
        name: "여리한 다이어트 신림점",
        address: "서울특별시 강남구 테헤란로78길 14-10 1층",
      },
    ])
    .flat()

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

  return (
    <div className={"w-full h-full p-5"}>
      <ul className={"space-y-3"}>
        {branches.map((branch) => (
          <li className={"p-5 rounded-2xl border border-gray-100"}>
            <BranchCard name={branch.name} address={branch.address} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActiveBranch
