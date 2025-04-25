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
import { useCallback } from "react"
import LoadingIndicator from "@components/LoadingIndicator"
import clsx from "clsx"

interface BranchFilterListProps {
  branches: Branch[]
  onIntersect: () => void
  onSelectBranch: (branch: Branch) => void
  isFetchingNextPage?: boolean
  className?: string
  totalCount?: number
  branchesLoading?: boolean
}

interface BranchFilterListItemProps {
  branch: Branch
  className?: string
  onClick: (branch: Branch) => void
  onClickFavorite: (branch: Branch) => void
  isFavorite: boolean
}

const BranchFilterListItem = ({
  branch,
  className = "",
  onClick,
  onClickFavorite,
  isFavorite,
}: BranchFilterListItemProps) => (
  <div
    onClick={() => onClick(branch)}
    className={clsx("cursor-pointer w-full flex", className)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onClick(branch)
      }
    }}
    aria-label={`${branch.name} 지점 선택 ${branch.distanceInMeters ? `${branch.distanceInMeters} 거리` : ""} ${branch.address}`}
  >
    <div className="w-full py-[20px] gap-4 flex items-stretch">
      <Image
        className="border border-gray-100 rounded-xl h-[88px] aspect-square object-cover"
        src={branch.thumbnailUrl ?? BranchPlaceholderImage}
        alt={`${branch.name} 지점 사진`}
      />
      <div className="w-full flex flex-col justify-between py-1">
        <div className="flex justify-between">
          <div>
            <p className="font-b text-16px">{branch.name}</p>
            {branch.distanceInMeters && (
              <p className="font-r text-14px text-gray-400 mt-0.5">
                {branch.distanceInMeters.includes("m")
                  ? branch.distanceInMeters
                  : `${Math.ceil(Number(branch.distanceInMeters))}m`}
              </p>
            )}
            <address className="font-r text-14px text-start not-italic ">
              {branch.address}
            </address>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClickFavorite(branch)
            }}
            className={clsx(
              "rounded-lg px-1 h-fit",
              "transition-transform hover:scale-110",
            )}
            aria-label={`${branch.name} 지점 ${isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}`}
            aria-pressed={isFavorite}
          >
            {isFavorite ? (
              <HeartEnabledIcon aria-hidden="true" />
            ) : (
              <HeartDisabledIcon aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)

const BranchFilterList = ({
  branches,
  onIntersect,
  onSelectBranch,
  isFetchingNextPage,
  className,
  totalCount = 0,
  branchesLoading,
}: BranchFilterListProps) => {
  const { observerTarget } = useIntersection<HTMLLIElement>({
    onIntersect,
  })

  const { mutate: bookmark } = useBranchBookmarkMutation()
  const { mutate: unbookmark } = useBranchUnbookmarkMutation()
  const { openModal, showToast } = useOverlay()

  const handleToggleFavorite = useCallback(
    (branch: Branch) => {
      if (branch.isFavorite) {
        unbookmark(branch.b_idx, {
          onSuccess: () => {
            showToast("즐겨찾기에서 삭제했어요.")
          },
          onError: () => {
            openModal({
              title: "즐겨찾기 해제 실패",
              message: "즐겨찾기 해제에 실패했습니다. 다시 시도해주세요.",
              onConfirm: () => {},
            })
          },
        })
      } else {
        bookmark(branch.b_idx, {
          onSuccess: () => {
            showToast("즐겨찾기에 추가했어요.")
          },
          onError: () => {
            openModal({
              title: "즐겨찾기 추가 실패",
              message: "즐겨찾기 추가에 실패했습니다. 다시 시도해주세요.",
              onConfirm: () => {},
            })
          },
        })
      }
    },
    [bookmark, unbookmark, openModal, showToast],
  )

  if (branchesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size={48} />
      </div>
    )
  }

  if (totalCount === 0) {
    return (
      <div className={clsx("flex flex-col h-full", className)}>
        <div className="pt-[16px] px-5 flex-none bg-white">
          <p
            className="font-m text-14px text-gray-700"
            role="status"
            aria-live="polite"
          >
            {"총 "}
            <span className="font-b">0</span>
            {"개의 지점을 찾았습니다."}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center items-center h-full">
            <p className="font-m text-14px text-gray-400" role="status">
              {"검색 결과가 없습니다."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto">
        <div className="pt-[16px] px-5 flex-none bg-white">
          <p
            className="font-m text-14px text-gray-700"
            role="status"
            aria-live="polite"
          >
            {"총 "}
            <span className="font-b">{totalCount}</span>
            {"개의 지점을 찾았습니다."}
          </p>
        </div>
        <ul
          className="divide-y px-5 pb-[82px]"
          role="listbox"
          aria-label="지점 목록"
          tabIndex={0}
        >
          {branches.map((branch, index) => (
            <BranchFilterListItem
              key={branch.b_idx}
              branch={branch}
              className={index === 0 ? "pt-1" : ""}
              onClick={onSelectBranch}
              onClickFavorite={handleToggleFavorite}
              isFavorite={branch.isFavorite ?? false}
            />
          ))}
          <li ref={observerTarget} className="h-4" aria-hidden="true">
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <LoadingIndicator className="w-6 h-6" />
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  )
}

export { BranchFilterListItem }
export default BranchFilterList
