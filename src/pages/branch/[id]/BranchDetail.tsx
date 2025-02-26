import { useNavigate, useParams } from "react-router-dom"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import { useEffect, useState, useCallback, lazy, Suspense } from "react"
import {
  useBranch,
  useBranchBookmarkMutation,
  useBranchUnbookmarkMutation,
} from "../../../queries/useBranchQueries.tsx"
import { DEFAULT_COORDINATE } from "../../../types/Coordinate.ts"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { useOverlay } from "../../../contexts/ModalContext.tsx"
import { BranchDetail as BranchDetailType } from "../../../types/Branch.ts"

const MembershipAvailableBanner = lazy(
  () => import("./_fragments/MembershipAvailableBanner.tsx"),
)
const BranchHeader = lazy(() => import("./_fragments/BranchHeader"))
const BranchTabs = lazy(() => import("./_fragments/BranchTabs"))
const BranchActions = lazy(() => import("./_fragments/BranchActions"))

const branchDetailTabs = ["therapists", "programs", "information"] as const
type BranchDetailTab = (typeof branchDetailTabs)[number]

const BranchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { showToast } = useOverlay()
  const [selectedTab, setSelectedTab] = useState<BranchDetailTab>("information")

  const { data: branch, isLoading } = useBranch(id || "", {
    latitude: DEFAULT_COORDINATE.latitude,
    longitude: DEFAULT_COORDINATE.longitude,
  }) as { data: BranchDetailType | undefined; isLoading: boolean }
  const { mutate: addBookmark } = useBranchBookmarkMutation()
  const { mutate: removeBookmark } = useBranchUnbookmarkMutation()

  const handleShare = useCallback(async () => {
    try {
      if (!branch) return
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
  }, [branch])

  const handleBack = useCallback(() => navigate(-1), [navigate])

  const handleMembershipBannerClick = useCallback(() => {
    if (!branch) return
    navigate(`/membership?brand=${branch.brandCode}`)
  }, [branch, navigate])

  const handleReservation = useCallback(() => {
    if (!branch) return
    navigate(`/reservation/form?branchId=${branch.b_idx}`)
  }, [branch, navigate])

  const handleBookmark = useCallback(() => {
    if (!branch) return

    if (branch.isBookmarked) {
      removeBookmark(branch.b_idx, {
        onSuccess: () => {
          showToast("즐겨찾기에서 삭제했어요.")
        },
      })
    } else {
      addBookmark(branch.b_idx, {
        onSuccess: () => {
          showToast("즐겨찾기에 추가했어요.")
        },
      })
    }
  }, [branch, addBookmark, removeBookmark, showToast])

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  if (!branch || isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className={"relative flex-grow w-full bg-system-bg overflow-x-hidden"}>
      <div className={"flex flex-col gap-3 py-5"}>
        <Suspense fallback={<LoadingIndicator className="h-20" />}>
          <BranchHeader
            branch={branch}
            onShare={handleShare}
            onBack={handleBack}
          />
          {branch.availableMembershipCount > 0 && (
            <MembershipAvailableBanner
              availableMembershipCount={branch.availableMembershipCount}
              onClick={handleMembershipBannerClick}
            />
          )}
        </Suspense>
      </div>
      <Suspense fallback={<LoadingIndicator className="h-20" />}>
        <BranchTabs
          selectedTab={selectedTab}
          onChangeTab={(tab: BranchDetailTab) => setSelectedTab(tab)}
          branch={branch}
        />
      </Suspense>
      <div className={"h-20"} />
      <Suspense fallback={<LoadingIndicator className="h-20" />}>
        <BranchActions
          branch={branch}
          onBookmark={handleBookmark}
          onReservation={handleReservation}
        />
      </Suspense>
    </div>
  )
}

export default BranchDetail
