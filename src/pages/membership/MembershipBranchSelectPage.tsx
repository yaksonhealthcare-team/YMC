import { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext"
import { useGeolocation } from "../../hooks/useGeolocation"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions"
import { useBranches } from "../../queries/useBranchQueries.tsx"
import { DEFAULT_COORDINATE } from "../../types/Coordinate"
import { Branch, BranchSearchResult } from "../../types/Branch"
import { SearchField } from "../../components/SearchField"
import useIntersection from "../../hooks/useIntersection"
import BranchPlaceholderImage from "../../assets/images/BranchPlaceholderImage.png"
import { MembershipActiveBranchList } from "./_fragments/MembershipActiveBranchList"
import LoadingIndicator from "@components/LoadingIndicator"
import { useLocation, useNavigate } from "react-router-dom"

interface Props {
  onSelect?: (branch: Branch) => void
  onClose: () => void
}

const DEFAULT_BRAND_CODE = "001" // 약손명가

const MembershipBranchSelectPage = ({ onSelect, onClose }: Props) => {
  const [query, setQuery] = useState("")
  const { setHeader, setNavigation } = useLayout()
  const location = useLocation()
  const navigate = useNavigate()
  const { location: geolocationLocation, error: geolocationError } =
    useGeolocation()
  const { setSelectedBranch, setIsBottomSheetOpen } =
    useMembershipOptionsStore()

  const coordinates = geolocationLocation
    ? {
        latitude: geolocationLocation.latitude,
        longitude: geolocationLocation.longitude,
      }
    : geolocationError
      ? DEFAULT_COORDINATE
      : DEFAULT_COORDINATE

  const {
    data: branchPages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useBranches({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    search: query,
    brandCode: location.state?.brand_code || DEFAULT_BRAND_CODE,
  })

  const branches = branchPages?.pages.flatMap((page) => page.body.result) || []

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  useEffect(() => {
    setHeader({
      left: "back",
      title: "지점 선택",
      backgroundColor: "bg-white",
      display: true,
      onClickBack: () => {
        if (location.state?.returnPath) {
          navigate(location.state.returnPath, {
            state: {
              ...location.state,
            },
          })
        } else {
          onClose()
        }
      },
    })
    setNavigation({ display: false })

    navigate(location.pathname, {
      replace: true,
      state: location.state,
    })

    return () => {
      setHeader({ display: false })
      setNavigation({ display: true })
    }
  }, [setHeader, setNavigation, onClose, navigate, location])

  const handleBranchSelect = (branch: BranchSearchResult | Branch) => {
    const branchData: Branch =
      "b_idx" in branch && "b_name" in branch
        ? {
            b_idx: branch.b_idx,
            name: branch.b_name,
            address: branch.b_addr,
            latitude: Number(branch.b_lat),
            longitude: Number(branch.b_lon),
            canBookToday: branch.reserve === "Y",
            distanceInMeters: branch.distance,
            isFavorite: branch.b_bookmark === "Y",
            brandCode: branch.brand_code,
            brand: "therapist",
          }
        : branch

    if (onSelect) {
      onSelect(branchData)
    } else {
      setSelectedBranch(branchData)
      if (location.state?.returnPath) {
        navigate(location.state.returnPath, {
          state: {
            ...location.state,
            selectedBranch: branchData,
          },
        })
      } else {
        setIsBottomSheetOpen(true)
        onClose()
      }
    }
  }

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className={"flex flex-col overflow-y-hidden"}>
      <div className={"px-5 pt-5 pb-6 border-b-8 border-gray-50"}>
        <SearchField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={"지역 또는 지점명을 입력해주세요."}
        />
      </div>
      {query.length === 0 ? (
        <MembershipActiveBranchList onBranchSelect={handleBranchSelect} />
      ) : branches.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      ) : (
        <ul className={"overflow-y-scroll h-full divide-y divide-gray-100"}>
          {branches.map((branch) => (
            <li key={branch.b_idx}>
              <div
                className={"w-full px-5 py-4 gap-4 flex items-stretch"}
                onClick={() => handleBranchSelect(branch)}
              >
                <img
                  className={
                    "border border-gray-100 rounded-xl h-[88px] aspect-square object-cover"
                  }
                  src={BranchPlaceholderImage}
                  alt={"지점 사진"}
                />
                <div className={"w-full flex flex-col"}>
                  <div className={"mt-0.5"}>
                    <p className={"font-b text-16px"}>{branch.b_name}</p>
                  </div>
                  <div className={"flex items-center gap-[2.5px]"}>
                    {branch.reserve === "Y" && (
                      <>
                        <p className={"font-r text-12px text-tag-green"}>
                          {"당일 예약 가능"}
                        </p>
                        <div className={"w-0.5 h-0.5 rounded-xl bg-gray-400"} />
                      </>
                    )}
                    {branch.distance && (
                      <p className={"font-r text-12px text-gray-400"}>
                        {branch.distance}
                      </p>
                    )}
                  </div>
                  <p className={"font-r text-14px text-start"}>
                    {branch.b_addr}
                  </p>
                </div>
              </div>
            </li>
          ))}
          <div ref={observerTarget} className={"h-1"} />
        </ul>
      )}
    </div>
  )
}

export default MembershipBranchSelectPage
