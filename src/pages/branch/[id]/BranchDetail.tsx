import { useNavigate, useParams } from "react-router-dom"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import { useEffect, useState, useCallback, lazy, Suspense } from "react"
import {
  useBranch,
  useBranchBookmarkMutation,
  useBranchUnbookmarkMutation,
} from "../../../queries/useBranchQueries.tsx"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { useOverlay } from "../../../contexts/ModalContext.tsx"
import { useGeolocation } from "../../../hooks/useGeolocation.tsx"

// const MembershipAvailableBanner = lazy(
//   () => import("./_fragments/MembershipAvailableBanner.tsx"),
// )
const BranchHeader = lazy(() => import("./_fragments/BranchHeader"))
const BranchTabs = lazy(() => import("./_fragments/BranchTabs"))
const BranchActions = lazy(() => import("./_fragments/BranchActions"))

const branchDetailTabs = ["programs", "information"] as const
type BranchDetailTab = (typeof branchDetailTabs)[number]

const BRANCH_SHARE_URL = {
  "123": "https://abr.ge/xzzcc1",
  "114": "https://abr.ge/noitue",
  "118": "https://abr.ge/lh3bdz",
}

const BranchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { location: currentLocation } = useGeolocation()
  const { showToast } = useOverlay()
  const [activeTab, setActiveTab] = useState<BranchDetailTab>("programs")

  const { data: branch, isLoading } = useBranch(
    id!,
    currentLocation || undefined,
    {
      enabled: !!currentLocation,
    },
  )
  const { mutate: addBookmark } = useBranchBookmarkMutation()
  const { mutate: removeBookmark } = useBranchUnbookmarkMutation()

  const handleShare = useCallback(async () => {
    try {
      if (!branch) return

      if (navigator.share) {
        // 일반 웹 환경에서 Web Share API 사용
        await navigator.share({
          title: branch.name,
          text: `${branch.brand} ${branch.name}\n${branch.location.address}`,
          url: BRANCH_SHARE_URL[branch.b_idx as keyof typeof BRANCH_SHARE_URL],
        })
        return
      }

      if (window.ReactNativeWebView) {
        // 네이티브 앱으로 공유 요청 메시지 전송
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "SHARE_CONTENT",
            payload: {
              title: branch.name,
              text: `${branch.brand} ${branch.name}\n${branch.location.address}`,
              url:
                BRANCH_SHARE_URL[
                  branch.b_idx as keyof typeof BRANCH_SHARE_URL
                ] || window.location.href,
            },
          }),
        )

        return
      }
      // 공유 API를 지원하지 않는 환경에서는 클립보드에 복사
      await navigator.clipboard.writeText(window.location.href)
      alert("주소가 복사되었습니다.")
    } catch (error) {
      console.error("공유하기 실패:", error)
    }
  }, [branch])

  const handleBack = useCallback(() => {
    // 세션 스토리지를 확인하여 예약 페이지에서 돌아왔는지 확인
    const fromReservation = sessionStorage.getItem("fromReservation")

    if (fromReservation === id) {
      // 예약 페이지에서 돌아온 경우, 세션 스토리지를 초기화
      sessionStorage.removeItem("fromReservation")

      // 현재 위치 객체에서 상태 정보 확인
      const locationState = window.history.state?.usr || {}

      // 원래 경로가 지정되어 있으면 해당 경로로 이동
      if (
        locationState?.originalPath &&
        locationState?.originalPath !== `/branch/${id}`
      ) {
        navigate(locationState.originalPath)
      } else {
        // 지점 목록 페이지로 이동
        navigate("/branch")
      }
    } else {
      // 그 외의 경우 일반적인 뒤로가기
      navigate(-1)
    }
  }, [navigate, id])

  // const handleMembershipBannerClick = useCallback(() => {
  //   if (!branch) return
  //   navigate(`/membership?brand=${branch.brandCode}`)
  // }, [branch, navigate])

  const handleReservation = useCallback(() => {
    if (!branch) return

    // 예약 페이지로 이동하기 전에 세션 스토리지에 현재 지점 ID 저장
    sessionStorage.setItem("fromReservation", branch.b_idx)

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
      display: true,
      left: "back",
      title: branch?.name || "지점 정보",
      onClickBack: handleBack,
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [])

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
          {/* {branch.availableMembershipCount > 0 && (
            <MembershipAvailableBanner
              availableMembershipCount={branch.availableMembershipCount}
              onClick={handleMembershipBannerClick}
            />
          )} */}
        </Suspense>
      </div>
      <Suspense fallback={<LoadingIndicator className="h-20" />}>
        <BranchTabs
          selectedTab={activeTab}
          onChangeTab={(tab: BranchDetailTab) => setActiveTab(tab)}
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
