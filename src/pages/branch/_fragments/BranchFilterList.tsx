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
import clsx from "clsx"

interface BranchFilterListProps {
  branches: Branch[]
  onIntersect: () => void
  onSelectBranch: (branch: Branch) => void
  isLoading?: boolean
  className?: string
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
  <li role="option" aria-selected="false">
    <button
      onClick={() => onClick(branch)}
      className={clsx(
        "cursor-pointer w-full flex",
        "focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2 rounded-lg",
        className,
      )}
      aria-label={`${branch.name} 지점 선택 ${branch.distanceInMeters ? `${branch.distanceInMeters} 거리` : ""} ${branch.address}`}
    >
      <div className="w-full py-4 gap-4 flex items-stretch">
        <Image
          className="border border-gray-100 rounded-xl h-[88px] aspect-square object-cover"
          src={BranchPlaceholderImage}
          alt={`${branch.name} 지점 사진`}
          loading="lazy"
        />
        <div className="w-full flex flex-col">
          <div className="flex justify-between mt-0.5">
            <p className="font-b text-16px">{branch.name}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClickFavorite(branch)
              }}
              className={clsx(
                "focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2 rounded-lg p-1",
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
          <div
            className="flex items-center gap-[2.5px]"
            role="group"
            aria-label="지점 정보"
          >
            {branch.distanceInMeters && (
              <p className="font-r text-12px text-gray-400">
                {branch.distanceInMeters}
              </p>
            )}
          </div>
          <address className="font-r text-14px text-start not-italic">
            {branch.address}
          </address>
        </div>
      </div>
    </button>
  </li>
)

const BranchFilterList = ({
  branches,
  onIntersect,
  onSelectBranch,
  isLoading,
  className,
}: BranchFilterListProps) => {
  const { observerTarget } = useIntersection<HTMLLIElement>({
    onIntersect,
  })

  const { mutate: bookmark } = useBranchBookmarkMutation()
  const { mutate: unbookmark } = useBranchUnbookmarkMutation()
  const { openModal } = useOverlay()

  const [favoriteBranches, setFavoriteBranches] = useState<Set<string>>(
    new Set(),
  )

  const handleToggleFavorite = useCallback(
    (branch: Branch) => {
      if (favoriteBranches.has(branch.b_idx)) {
        unbookmark(branch.b_idx, {
          onSuccess: () => {
            setFavoriteBranches((prev) => {
              const next = new Set(prev)
              next.delete(branch.b_idx)
              return next
            })
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
            setFavoriteBranches((prev) => {
              const next = new Set(prev)
              next.add(branch.b_idx)
              return next
            })
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
    [bookmark, unbookmark, openModal, favoriteBranches],
  )

  const getIsFavorite = useCallback(
    (branch: Branch) => favoriteBranches.has(branch.b_idx),
    [favoriteBranches],
  )

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center h-full"
        role="status"
        aria-label="로딩 중"
      >
        <LoadingIndicator size={24} />
      </div>
    )
  }

  if (branches.length === 0) {
    return (
      <div className={clsx("flex flex-col h-full", className)}>
        <div className="px-5 flex-none bg-white">
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
      <div className="px-5 flex-none bg-white">
        <p
          className="font-m text-14px text-gray-700"
          role="status"
          aria-live="polite"
        >
          {"총 "}
          <span className="font-b">{branches.length}</span>
          {"개의 지점을 찾았습니다."}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul
          className="divide-y px-5"
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
              isFavorite={getIsFavorite(branch)}
            />
          ))}
          <li ref={observerTarget} className="h-4" aria-hidden="true" />
        </ul>
      </div>
    </div>
  )
}

export { BranchFilterListItem }
export default BranchFilterList
