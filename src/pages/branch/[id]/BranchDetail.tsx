import { useNavigate, useParams } from "react-router-dom"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import { ReactNode, useEffect } from "react"
import DynamicHomeHeaderBackground from "../../home/_fragments/DynamicHomeHeaderBackground.tsx"
import { MockBranch } from "../../../types/Branch.ts"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import MembershipIcon from "@assets/icons/MembershipIcon.svg?react"
import PinIcon from "@assets/icons/PinIcon.svg?react"
import StoreIcon from "@assets/icons/StoreIcon.svg?react"
import ShareIcon from "@assets/icons/ShareIcon.svg?react"
import StaffSection from "./_fragments/StaffSection.tsx"
import DirectorCard from "./_fragments/DirectorCard.tsx"


const BranchDetail = () => {
  const { id } = useParams()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const branch = MockBranch(id || "1")

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  return (
    <div className={"bg-system-bg w-full h-full"}>
      <div className={"p-5"}>
        <DynamicHomeHeaderBackground
          header={(
            <>
              <div className={"flex flex-row items-center gap-2"}>
                <div onClick={() => navigate(-1)}>
                  <CaretLeftIcon className="w-5 h-5" />
                </div>
                <p className={"font-b text-20px"}>{branch.name}</p>
              </div>
              <div className={"flex flex-row items-center gap-1 mt-1.5"}>
                <IconLabel icon={<StoreIcon />} label={branch.brand} />
                {branch.location.distance && <IconLabel icon={<PinIcon />} label={branch.location.distance} />}
              </div>
            </>
          )}
          content={(
            <div className={"flex flex-col gap-4"}>
              <div className={"w-full h-[1px] bg-gray-200 rounded-sm"} />
              <StaffSection directorCount={1} staffCount={branch.staffs.length} />
              <DirectorCard
                name={branch.director.name}
                profileImageUrl={branch.director.profileImageUrl}
                description={branch.director.description}
              />
            </div>
          )}
          buttonArea={<ShareIcon />}
        />
      </div>
      <MembershipIcon />
      <p>{id}</p>
    </div>
  )
}

const IconLabel = ({ icon, label }: { icon: ReactNode, label: string }) => (
  <div className={"flex flex-row gap-0.5 items-center"}>
    {icon}
    <p className={"font-sb text-14px text-gray-500"}>{label}</p>
  </div>
)

export default BranchDetail
