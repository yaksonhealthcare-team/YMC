import { useNavigate, useParams } from "react-router-dom"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import { ReactNode, useEffect, useState } from "react"
import DynamicHomeHeaderBackground from "../../home/_fragments/DynamicHomeHeaderBackground.tsx"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import PinIcon from "@assets/icons/PinIcon.svg?react"
import StoreIcon from "@assets/icons/StoreIcon.svg?react"
import ShareIcon from "@assets/icons/ShareIcon.svg?react"
import StaffSection from "./_fragments/StaffSection.tsx"
import MembershipAvailableBanner from "./_fragments/MembershipAvailableBanner.tsx"
import { CustomTabs as Tabs } from "@components/Tabs.tsx"
import TherapistList from "./_fragments/TherapistList.tsx"
import ProgramList from "./_fragments/ProgramList.tsx"
import BranchInformation from "./_fragments/BranchInformation.tsx"
import ProfileCard from "@components/ProfileCard.tsx"
import BranchDetailBottomActionBar from "./_fragments/BranchDetailBottomActionBar.tsx"
import { useBranch } from "../../../queries/useBranchQueries.tsx"
import { DEFAULT_COORDINATE } from "../../../types/Coordinate.ts"
import LoadingIndicator from "@components/LoadingIndicator.tsx"

const branchDetailTabs = ["therapists", "programs", "information"] as const
type BranchDetailTab = (typeof branchDetailTabs)[number]

const BranchDetailTabs: Record<BranchDetailTab, string> = {
  "therapists": "테라피스트",
  "programs": "관리프로그램",
  "information": "기본정보",
}

const BranchDetail = () => {
  const { id } = useParams()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<string>("therapists")
  // TODO: INITIAL_CENTER에 현재위치 반영하기
  const { data: branch, isLoading } = useBranch(id!, {
    latitude: DEFAULT_COORDINATE.latitude,
    longitude: DEFAULT_COORDINATE.longitude,
  })

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  if (!branch || isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: branch.name,
          text: `${branch.brand} ${branch.name}\n${branch.location.address}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert("주소가 복사되었습니다.")
      }
    } catch (error) {
      console.error("공유하기 실패:", error)
    }
  }

  const handleMembershipBannerClick = () => {
    navigate(`/membership?brand=${branch.brandCode}`)
  }

  const renderTab = () => {
    switch (selectedTab) {
      case "therapists":
        return <TherapistList therapists={branch.staffs} />
      case "programs":
        return <ProgramList brandCode={branch.brandCode} />
      case "information":
      default:
        return <BranchInformation branch={branch} />
    }
  }

  return (
    <div className={"relative flex-grow w-full bg-system-bg overflow-x-hidden"}>
      <div className={"flex flex-col gap-3 p-5"}>
        <DynamicHomeHeaderBackground
          header={
            <>
              <div className={"flex flex-row items-center gap-2"}>
                <div onClick={() => navigate(-1)}>
                  <CaretLeftIcon className="w-5 h-5" />
                </div>
                <p className={"font-b text-20px"}>{branch.name}</p>
              </div>
              <div className={"flex flex-row items-center gap-1 mt-1.5"}>
                <IconLabel
                  icon={<StoreIcon className={"text-gray-500"} />}
                  label={branch.brand}
                />
                {branch.location.distance && (
                  <IconLabel
                    icon={<PinIcon className={"text-gray-500"} />}
                    label={branch.location.distance}
                  />
                )}
              </div>
            </>
          }
          content={
            (branch.staffs.length > 0 || branch.director) && (
              <div className={"flex flex-col gap-4 -mb-4 py-4"}>
                <div className={"w-full h-[1px] bg-gray-200 rounded-sm"} />

                {branch.staffs.length > 0 && (
                  <StaffSection
                    directorCount={
                      branch.staffs.filter((staff) => staff.grade === "원장")
                        .length
                    }
                    staffCount={
                      branch.staffs.filter(
                        (staff) => staff.grade === "테라피스트",
                      ).length
                    }
                  />
                )}
                {branch.director && (
                  <ProfileCard type={"primary"} {...branch.director} />
                )}
              </div>
            )
          }
          buttonArea={
            <button
              className={
                "flex w-10 h-10 rounded-full bg-primary justify-center items-center text-white shadow-md"
              }
              onClick={handleShare}
            >
              <ShareIcon className={"w-6 h-6"} />
            </button>
          }
        />
        {branch.availableMembershipCount > 0 && (
          <MembershipAvailableBanner
            availableMembershipCount={branch.availableMembershipCount}
            onClick={handleMembershipBannerClick}
          />
        )}
      </div>
      <Tabs
        type={"fit"}
        tabs={Object.entries(BranchDetailTabs).map(([value, label]) => ({
          value: value,
          label: label,
        }))}
        onChange={setSelectedTab}
        activeTab={selectedTab}
      />
      {renderTab()}
      <div className={"h-20"} />
      <div
        className={
          "fixed left-1/2 -translate-x-1/2 min-w-[375px] max-w-[500px] w-full bottom-0 bg-system-bg border-t border-gray-100 py-3 px-5"
        }
      >
        <BranchDetailBottomActionBar
          isBookmarked={branch.isBookmarked || false}
          bookmarkCount={branch.favoriteCount}
          onBookmark={() => {}}
          onClickReservation={() => {}}
        />
      </div>
    </div>
  )
}

const IconLabel = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <div className={"flex flex-row gap-0.5 items-center"}>
    {icon}
    <p className={"font-m text-14px text-gray-500"}>{label}</p>
  </div>
)

export default BranchDetail
