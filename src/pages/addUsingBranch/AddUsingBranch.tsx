import React, { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"
import CustomTextField from "@components/CustomTextField.tsx"
import { IconButton } from "@mui/material"
import SearchIcon from "@components/icons/SearchIcon.tsx"
import CloseGrayFillIcon from "@assets/icons/CloseGrayFillIcon.svg?react"
import CheckIcon from "@assets/icons/CheckIcon.svg?react"
import { Button } from "@components/Button.tsx"
import BranchIcon from "@components/icons/BranchIcon.tsx"

const SEARCH_HISTORY_KEY = "search/branches"

interface Branch {
  id: number
  name: string
  address: string
}

const MOCK_BRANCHES: Branch[] = [
  {
    id: 150,
    name: "달리아에스테틱 건대점",
    address: "서울 광진구 아차산로34길 26 (자양동) 4층",
  },
  {
    id: 123,
    name: "약손명가 테스트지점",
    address: "서울 강남구 영동대로142길 27 (청담동) 3층",
  },
  {
    id: 169,
    name: "약손명가 상봉역점",
    address:
      "서울 중랑구 망우로 353 (상봉동, 상봉 프레미어스 엠코) C동 303호, 304호",
  },
  {
    id: 168,
    name: "약손명가 헬스케어",
    address: "서울 강남구 봉은사로68길 8 (삼성동, DECKS 빌딩) 2층",
  },
  {
    id: 162,
    name: "약손명가 당산역점",
    address: "서울 영등포구 양평로 20 (당산동6가) 4층",
  },
  {
    id: 125,
    name: "약손명가 서울대입구역점",
    address:
      "서울 관악구 관악로 195 (봉천동, 관악위버폴리스) 제3층 306호, 307호",
  },
  {
    id: 1502,
    name: "달리아에스테틱 건대점",
    address: "서울 광진구 아차산로34길 26 (자양동) 4층",
  },
  {
    id: 1232,
    name: "약손명가 테스트지점",
    address: "서울 강남구 영동대로142길 27 (청담동) 3층",
  },
  {
    id: 1692,
    name: "약손명가 상봉역점",
    address:
      "서울 중랑구 망우로 353 (상봉동, 상봉 프레미어스 엠코) C동 303호, 304호",
  },
  {
    id: 1682,
    name: "약손명가 헬스케어",
    address: "서울 강남구 봉은사로68길 8 (삼성동, DECKS 빌딩) 2층",
  },
  {
    id: 1622,
    name: "약손명가 당산역점",
    address: "서울 영등포구 양평로 20 (당산동6가) 4층",
  },
  {
    id: 1252,
    name: "약손명가 서울대입구역점",
    address:
      "서울 관악구 관악로 195 (봉천동, 관악위버폴리스) 제3층 306호, 307호",
  },
]

const AddUsingBranch = () => {
  const { setHeader, setNavigation } = useLayout()
  const [branches] = useState(MOCK_BRANCHES)
  const navigate = useNavigate()
  const [pageStep, setPageStep] = useState(1)

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      right: (
        <button
          className="font-medium text-gray-500 text-[16px]"
          onClick={() => navigate("/")}
        >
          건너뛰기
        </button>
      ),
      backgroundColor: "white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  const [searchText, setSearchText] = useState("")
  const [searchHistories, setSearchHistories] = useState<string[]>(() => {
    const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY)
    return storedHistory ? JSON.parse(storedHistory) : []
  })

  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([])

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranches((prevSelected) => {
      if (prevSelected.some((b) => b.id === branch.id)) {
        return prevSelected.filter((b) => b.id !== branch.id)
      }
      return [...prevSelected, branch]
    })
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const handleSearchClear = () => {
    setSearchText("")
  }

  const handleSearchSubmit = () => {
    const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY)

    const updatedSearchHistories = storedHistory
      ? JSON.parse(storedHistory)
      : []

    updatedSearchHistories.unshift(searchText)

    localStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(updatedSearchHistories),
    )

    setSearchHistories(updatedSearchHistories)
  }

  const handleRemoveSearch = (itemToRemove: string) => {
    const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY)

    const updatedSearchHistories = storedHistory
      ? JSON.parse(storedHistory).filter(
          (item: string) => item !== itemToRemove,
        )
      : []

    localStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(updatedSearchHistories),
    )

    setSearchHistories(updatedSearchHistories)
  }

  const handleNextStep = () => {
    if (pageStep === 3) {
      return
    }

    setPageStep(pageStep + 1)
  }

  return (
    <>
      {pageStep === 1 && (
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
                iconLeft={
                  <IconButton
                    className="px-0 py-[15px] mr-[2px] h-full"
                    onClick={handleSearchSubmit}
                  >
                    <SearchIcon className="ml-[2px] w-[24px] h-[24px]" />
                  </IconButton>
                }
                iconRight={
                  <>
                    {searchText && (
                      <IconButton
                        className="px-0 py-[15px] mr-[2px] h-full"
                        onClick={handleSearchClear}
                      >
                        <CloseGrayFillIcon />
                      </IconButton>
                    )}
                  </>
                }
              />
            </div>

            <div className="mt-[28px]">
              <p className="text-gray-800 font-semibold mb-4">선택한 지점</p>
              <div className="flex mt-[16px] space-x-2 overflow-x-auto whitespace-nowrap">
                {searchHistories.map((item, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-[8px] py-[5px] bg-[#f8f8f8] rounded-full text-gray-600 font-medium text-[14px]"
                  >
                    {item}
                    <button
                      onClick={() => handleRemoveSearch(item)}
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
            {branches.map((branch, index) => (
              <div
                key={branch.id}
                className={`flex justify-between py-[16px] cursor-pointer ${index != branches.length - 1 && "border-b border-b-[#ECECEC]"}`}
                onClick={() => handleSelectBranch(branch)}
              >
                <div className="flex gap-[6px]">
                  <BranchIcon className="w-[16px] h-[16px] mt-[3px]" />
                  <div className="text-[14px]">
                    <p className="font-bold text-gray-700">{branch.name}</p>
                    <p className="font-normal text-gray-500 mt-[8px]">
                      {branch.address}
                    </p>
                  </div>
                </div>

                {selectedBranches.some((b) => b.id === branch.id) && (
                  <CheckIcon />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {pageStep === 2 && (
        <div className="flex flex-col justify-between h-full">
          <div className="px-[20px] mt-[20px]">
            <p className="text-gray-700 font-bold text-20px">
              총{" "}
              <span className="text-primary-300">
                {selectedBranches.length}개
              </span>
              의 지점을
              <br />
              이용하고 계시군요!
            </p>
            <p className="mt-[12px] text-gray-400">
              이용중이신 지점과 회원 정보 연동을 진행해주세요
            </p>
          </div>

          <div className="flex-auto h-[0px] min-h-[200px] px-[20px] overflow-y-auto mt-[40px]">
            {selectedBranches.map((branch, index) => (
              <div
                key={branch.id}
                className={`p-[20px] border border-primary-300 rounded-[20px] ${index !== 0 && "mt-[16px]"}`}
              >
                <div className="flex gap-[6px]">
                  <BranchIcon className="w-[16px] h-[16px] mt-[3px]" />
                  <div className="text-[14px]">
                    <p className="font-bold text-gray-700">{branch.name}</p>
                    <p className="font-normal text-gray-500 mt-[8px]">
                      {branch.address}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full px-[20px] pt-[12px] pb-[30px] bg-[#FFFFFF] border-t border-[#F8F8F8]">
        <Button className="w-full" onClick={handleNextStep}>
          {pageStep === 1
            ? "다음"
            : pageStep === 2
              ? "회원 정보 연동하기"
              : "문진 작성하기"}
        </Button>
      </div>
    </>
  )
}

export default AddUsingBranch
