import { Branch } from "../../../types/Branch.ts"
import BranchPlaceholderImage from "@assets/images/BranchPlaceholderImage.png"
import HeartDisabledIcon from "@assets/icons/HeartDisabledIcon.svg?react"
import HeartEnabledIcon from "@assets/icons/HeartEnabledIcon.svg?react"
import useIntersection from "../../../hooks/useIntersection.tsx"
import {
  useBranchBookmarkMutation,
  useBranchUnbookmarkMutation,
} from "../../../queries/useBranchQueries.tsx"
import { useOverlay } from "../../../contexts/ModalContext.tsx"
import { Image } from "@components/common/Image"
import { useState, useCallback } from "react"
import LoadingIndicator from "@components/LoadingIndicator"

interface BranchFilterListProps {
  branches: Branch[]
  onIntersect: () => void
  onSelectBranch: (branch: Branch) => void
  isLoading?: boolean
}

const BranchFilterList = ({
  branches,
  onIntersect,
  onSelectBranch,
  isLoading = false,
}: BranchFilterListProps) => {
  const { observerTarget } = useIntersection({ onIntersect })
  const { showToast } = useOverlay()

  // 지역 상태로 북마크 상태를 관리합니다
  const [localBranchStates, setLocalBranchStates] = useState<
    Record<string, boolean>
  >({})

  const { mutate: addBookmark } = useBranchBookmarkMutation()
  const { mutate: removeBookmark } = useBranchUnbookmarkMutation()

  // 북마크 토글 함수
  const handleToggleFavorite = useCallback(
    (branch: Branch) => {
      // 로컬 상태 먼저 업데이트
      setLocalBranchStates((prev) => ({
        ...prev,
        [branch.b_idx]: !getIsFavorite(branch),
      }))

      if (getIsFavorite(branch)) {
        removeBookmark(branch.b_idx)
        showToast("즐겨찾기에서 삭제했어요.")
      } else {
        addBookmark(branch.b_idx)
        showToast("즐겨찾기에 추가했어요.")
      }
    },
    [addBookmark, removeBookmark, showToast],
  )

  // 브랜치의 실제 즐겨찾기 상태를 계산하는 함수
  const getIsFavorite = useCallback(
    (branch: Branch) => {
      // 로컬 상태가 존재하면 로컬 상태를, 없으면 서버 상태를 사용
      return branch.b_idx in localBranchStates
        ? localBranchStates[branch.b_idx]
        : branch.isFavorite
    },
    [localBranchStates],
  )

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center items-center h-full">
            <LoadingIndicator size={32} />
          </div>
        </div>
      </div>
    )
  }

  if (branches.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 flex-none bg-white">
          <p className="font-m text-14px text-gray-700">
            {"총 "}
            <span className="font-b">0</span>
            {"개의 지점을 찾았습니다."}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center items-center h-full">
            <p className="font-m text-14px text-gray-400">
              {"검색 결과가 없습니다."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 flex-none bg-white">
        <p className="font-m text-14px text-gray-700">
          {"총 "}
          <span className="font-b">{branches.length}</span>
          {"개의 지점을 찾았습니다."}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y px-5">
          {branches.map((branch, index) => (
            <BranchFilterListItem
              key={branch.b_idx}
              branch={branch}
              className={index === 0 ? "pt-1" : ""}
              onClick={() => onSelectBranch(branch)}
              onClickFavorite={() => handleToggleFavorite(branch)}
              isFavorite={getIsFavorite(branch)}
            />
          ))}
          <div ref={observerTarget} className="h-4" />
        </ul>
      </div>
    </div>
  )
}

export const BranchFilterListItem = ({
  branch,
  className = "",
  onClick,
  onClickFavorite,
  isFavorite,
}: {
  branch: Branch
  className?: string
  onClick: (branch: Branch) => void
  onClickFavorite: (branch: Branch) => void
  isFavorite: boolean
}) => (
  <li
    onClick={() => onClick(branch)}
    className={`cursor-pointer w-full flex ${className}`}
  >
    <div className="w-full py-4 gap-4 flex items-stretch">
      <Image
        className="border border-gray-100 rounded-xl h-[88px] aspect-square object-cover"
        src={BranchPlaceholderImage}
        alt="지점 사진"
      />
      <div className="w-full flex flex-col">
        <div className="flex justify-between mt-0.5">
          <p className="font-b text-16px">{branch.name}</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClickFavorite(branch)
            }}
          >
            {isFavorite ? <HeartEnabledIcon /> : <HeartDisabledIcon />}
          </button>
        </div>
        <div className="flex items-center gap-[2.5px]">
          {branch.canBookToday && (
            <>
              <p className="font-r text-12px text-tag-green">
                {"당일 예약 가능"}
              </p>
              <div className="w-0.5 h-0.5 rounded-xl bg-gray-400" />
            </>
          )}
          {branch.distanceInMeters && (
            <p className="font-r text-12px text-gray-400">
              {branch.distanceInMeters}
            </p>
          )}
        </div>
        <p className="font-r text-14px text-start">{branch.address}</p>
      </div>
    </div>
  </li>
)

export default BranchFilterList
