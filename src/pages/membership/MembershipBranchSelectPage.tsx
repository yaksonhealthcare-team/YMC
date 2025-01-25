import { useLayout } from "../../contexts/LayoutContext"
import { useEffect, useState } from "react"
import { useBranches } from "../../queries/useBranchQueries"
import { DEFAULT_COORDINATE } from "../../types/Coordinate"
import { SearchField } from "../../components/SearchField"
import useIntersection from "../../hooks/useIntersection"
import BranchPlaceholderImage from "../../assets/images/BranchPlaceholderImage.png"
import { useGeolocation } from "../../hooks/useGeolocation"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions"
import { useNavigate } from "react-router-dom"
import { MembershipActiveBranchList } from "./_fragments/MembershipActiveBranchList"

const MembershipBranchSelectPage = () => {
  const [query, setQuery] = useState("")

  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { location } = useGeolocation()
  const { setSelectedBranch } = useMembershipOptionsStore()

  const {
    data: branchPages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useBranches({
    latitude: location?.latitude || DEFAULT_COORDINATE.latitude,
    longitude: location?.longitude || DEFAULT_COORDINATE.longitude,
    search: query,
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
    })
    setNavigation({ display: false })
  }, [])

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
        <MembershipActiveBranchList />
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
                onClick={() => {
                  setSelectedBranch({
                    id: branch.b_idx,
                    name: branch.b_name,
                    address: branch.b_addr,
                    brandCode: branch.brand_code,
                    latitude: Number(branch.b_lat),
                    longitude: Number(branch.b_lon),
                    canBookToday: branch.reserve === "Y",
                    distanceInMeters: branch.distance,
                    isFavorite: branch.b_bookmark === "Y",
                    brand: "therapist",
                  })
                  navigate(-1)
                }}
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
