import CustomTextField from "@components/CustomTextField.tsx"
import SearchIcon from "@components/icons/SearchIcon.tsx"
import { IconButton } from "@mui/material"
import React, { useState } from "react"
import CloseGrayFillIcon from "@assets/icons/CloseGrayFillIcon.svg?react"
import { Branch } from "../../types/Branch.ts"
import CheckIcon from "@components/icons/CheckIcon.tsx"
import { useBranches } from "../../queries/useBranchQueries.tsx"
import useIntersection from "../../hooks/useIntersection.tsx"
import BranchItem from "./BranchItem.tsx"
import { useGeolocation } from "../../hooks/useGeolocation.tsx"
import { DEFAULT_COORDINATE } from "../../types/Coordinate.ts"

interface SearchBranchListProps {
  selectedBranches: Branch[]
  setSelectedBranches: React.Dispatch<React.SetStateAction<Branch[]>>
}

const Step1SearchBranchList = ({
  selectedBranches,
  setSelectedBranches,
}: SearchBranchListProps) => {
  const [searchText, setSearchText] = useState("")
  const { location } = useGeolocation()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBranches({
      search: searchText || undefined,
      latitude: location?.latitude || DEFAULT_COORDINATE.latitude,
      longitude: location?.longitude || DEFAULT_COORDINATE.longitude,
    })

  const branches =
    data?.pages.flatMap((page) =>
      page.body.result.map((branch) => ({
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
      })),
    ) || []

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const handleSearchClear = () => {
    setSearchText("")
  }

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranches((prevSelected) => {
      if (prevSelected.some((b) => b.b_idx === branch.b_idx)) {
        return prevSelected.filter((b) => b.b_idx !== branch.b_idx)
      }
      return [...prevSelected, branch]
    })
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="px-[20px] mt-[20px]">
        <p className="text-gray-700 font-bold text-20px">
          기존에 이용하셨던
          <br />
          지점을 선택해주세요
        </p>
        <p className="mt-[12px] text-gray-400">
          지점명을 검색해 이용하셨던 매장을 알려주세요
        </p>

        <div className="mt-[40px]">
          <CustomTextField
            type={"text"}
            value={searchText}
            onChange={handleSearchChange}
            placeholder="지점명 검색"
            iconLeft={<SearchIcon className="ml-[2px] w-[24px] h-[24px]" />}
            iconRight={
              searchText && (
                <IconButton
                  className="px-0 py-[15px] mr-[2px] h-full"
                  onClick={handleSearchClear}
                >
                  <CloseGrayFillIcon />
                </IconButton>
              )
            }
          />
        </div>

        <div className="mt-[28px]">
          <p className="text-gray-800 font-semibold mb-4">선택한 지점</p>
          <div className="flex mt-[16px] space-x-2 overflow-x-auto whitespace-nowrap no-scrollbar">
            {selectedBranches.map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center px-[8px] py-[5px] bg-[#f8f8f8] rounded-full text-gray-600 font-medium text-[14px]"
              >
                {item.name}
                <button
                  onClick={() => handleSelectBranch(item)}
                  className="ml-[4px] text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F7F8FB] h-[8px] mt-[24px]"></div>

      <div className="flex-auto h-[0px] min-h-[200px] px-[20px] overflow-y-auto">
        {!isLoading && (
          <>
            {branches.map((branch) => (
              <button
                key={branch.b_idx}
                className="w-full flex justify-between py-[16px] cursor-pointer border-b border-b-[#ECECEC] text-left"
                onClick={() => handleSelectBranch(branch)}
                aria-label={`${branch.name} 지점 선택`}
              >
                <BranchItem branch={branch} />

                {selectedBranches.some((b) => b.b_idx === branch.b_idx) && (
                  <CheckIcon htmlColor="#F37165" />
                )}
              </button>
            ))}
            <div ref={observerTarget} className={"h-4"} />
            {isFetchingNextPage && (
              <p className="text-center text-gray-500 py-4">로딩 중...</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Step1SearchBranchList
