import { useEffect, useMemo, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext"
import { Branch } from "../../types/Branch"
import { SearchField } from "../../components/SearchField"
import { useLocation, useNavigate } from "react-router-dom"
import MembershipBranchList from "./MembershipBranchList.tsx"
import { useDebounce } from "../../hooks/useDebounce"

interface Props {
  onSelect?: (branch: Branch) => void
  brandCode?: string
  memberShipId?: string
}

const MembershipBranchSelectPage = ({
  onSelect,
  brandCode,
  memberShipId,
}: Props) => {
  const [query, setQuery] = useState("")
  const { setHeader, setNavigation } = useLayout()
  const location = useLocation()
  const navigate = useNavigate()
  const debouncedQuery = useDebounce(query, 300)
  const currentBrandCode = brandCode || location.state?.brand_code

  const memoizedState = useMemo(() => location.state, [location.state])

  // 헤더 설정
  useEffect(() => {
    setHeader({
      left: "back",
      title: "지점 선택",
      backgroundColor: "bg-white",
      display: true,
      onClickBack: () => {
        navigate(-1)
      },
    })
    setNavigation({ display: false })

    return () => {
      setHeader({ display: false })
      // 네비게이션 상태는 변경하지 않음
    }
  }, [setHeader, setNavigation, navigate, memoizedState])

  // 브랜드 코드 설정
  useEffect(() => {
    if (location.state?.brand_code !== currentBrandCode) {
      navigate(location.pathname, {
        replace: true, // 히스토리에 새 항목 추가하지 않고 현재 상태 교체
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
    <div className={"flex flex-col h-full"}>
      <div className={"px-5 pt-5 pb-6 border-b-8 border-gray-50"}>
        <SearchField
          onChange={(e) => setQuery(e.target.value)}
          placeholder={"지역 또는 지점명을 입력해주세요."}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <MembershipBranchList
          onSelect={onSelect}
          query={debouncedQuery}
          memberShipId={memberShipId}
        />
      </div>
    </div>
  )
}

export default MembershipBranchSelectPage
