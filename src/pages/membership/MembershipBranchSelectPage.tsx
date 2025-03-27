import { useEffect, useMemo, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext"
import { Branch } from "../../types/Branch"
import { SearchField } from "../../components/SearchField"
import { useLocation, useNavigate } from "react-router-dom"
import MembershipBranchList from "./MembershipBranchList.tsx"

interface Props {
  onSelect?: (branch: Branch) => void
  brandCode?: string
}

const MembershipBranchSelectPage = ({ onSelect, brandCode }: Props) => {
  const [query, setQuery] = useState("")
  const { setHeader, setNavigation } = useLayout()
  const location = useLocation()
  const navigate = useNavigate()

  const memoizedState = useMemo(() => location.state, [location.state])
  const currentBrandCode = brandCode || location.state?.brand_code

  // 헤더 설정
  useEffect(() => {
    setHeader({
      left: "back",
      title: "지점 선택",
      backgroundColor: "bg-white",
      display: true,
      onClickBack: () => {
        // 복잡한 네비게이션 상태 관리 대신, 
        // 지점 선택 -> 예약 폼 사이의 무한 루프를 방지하기 위해
        // 예약 폼으로 돌아갈 때는 예약 관련 정보만 전달
        if (memoizedState?.returnPath) {
          // 필요한 예약 정보만 전달
          const { fromReservation, originalPath, fromReservationDetail } = memoizedState
          navigate(memoizedState.returnPath, {
            state: {
              fromReservation,
              fromBranchSelect: true, // 지점 선택 페이지에서 왔음을 표시
              originalPath, // 원래 온 경로 정보 유지
              fromReservationDetail // 예약 상세에서 왔는지 여부 유지
            },
            replace: true // 히스토리 스택에 추가하지 않고 교체
          })
        } else {
          // 일반 뒤로가기
          navigate(-1)
        }
      },
    })
    setNavigation({ display: false })

    return () => {
      setHeader({ display: false })
      setNavigation({ display: true })
    }
  }, [setHeader, setNavigation, navigate, memoizedState])

  // 브랜드 코드 설정
  useEffect(() => {
    if (location.state?.brand_code !== currentBrandCode) {
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location.state,
          brand_code: currentBrandCode,
        },
      })
    }
  }, [
    currentBrandCode,
    location.pathname,
    location.state?.brand_code,
    navigate,
  ])

  return (
    <div className={"flex flex-col overflow-y-hidden"}>
      <div className={"px-5 pt-5 pb-6 border-b-8 border-gray-50"}>
        <SearchField
          onChange={(e) => setQuery(e.target.value)}
          placeholder={"지역 또는 지점명을 입력해주세요."}
        />
      </div>

      <MembershipBranchList onSelect={onSelect} query={query} />
    </div>
  )
}

export default MembershipBranchSelectPage
