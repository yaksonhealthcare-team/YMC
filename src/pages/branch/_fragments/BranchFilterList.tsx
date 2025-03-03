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

interface BranchFilterListProps {
  branches: Branch[]
  onIntersect: () => void
  onSelectBranch: (branch: Branch) => void
}

const BranchFilterList = ({
  branches,
  onIntersect,
  onSelectBranch,
}: BranchFilterListProps) => {
  const { observerTarget } = useIntersection({ onIntersect })
  const { showToast } = useOverlay()

  const { mutate: addBookmark } = useBranchBookmarkMutation()
  const { mutate: removeBookmark } = useBranchUnbookmarkMutation()

  return (
    <div className={"px-5 mt-4 overflow-hidden"}>
      <p className={"font-m text-14px"}>
        {"총 "}
        <span>{branches.length}</span>
        {"개의 지점을 찾았습니다."}
      </p>
      <ul className={"divide-y"}>
        {branches.map((branch) => (
          <BranchFilterListItem
            key={branch.b_idx}
            branch={branch}
            onClick={() => onSelectBranch(branch)}
            onClickFavorite={() => {
              if (branch.isFavorite) {
                removeBookmark(branch.b_idx)
                showToast("즐겨찾기에서 삭제했어요.")
              } else {
                addBookmark(branch.b_idx)
                showToast("즐겨찾기에 추가했어요.")
              }
            }}
          />
        ))}
        <div ref={observerTarget} className={"h-4"} />
      </ul>
    </div>
  )
}

export const BranchFilterListItem = ({
  branch,
  onClick,
  onClickFavorite,
}: {
  branch: Branch
  onClick: (branch: Branch) => void
  onClickFavorite: (branch: Branch) => void
}) => (
  <li onClick={() => onClick(branch)} className={"cursor-pointer w-full flex"}>
    <div className={"w-full py-4 gap-4 flex items-stretch"}>
      <Image
        className={
          "border border-gray-100 rounded-xl h-[88px] aspect-square object-cover"
        }
        src={BranchPlaceholderImage}
        alt={"지점 사진"}
      />
      <div className={"w-full flex flex-col"}>
        <div className={"flex justify-between mt-0.5"}>
          <p className={"font-b text-16px"}>{branch.name}</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClickFavorite(branch)
            }}
          >
            {branch.isFavorite ? <HeartEnabledIcon /> : <HeartDisabledIcon />}
          </button>
        </div>
        <div className={"flex items-center gap-[2.5px]"}>
          {branch.canBookToday && (
            <>
              <p className={"font-r text-12px text-tag-green"}>
                {"당일 예약 가능"}
              </p>
              <div className={"w-0.5 h-0.5 rounded-xl bg-gray-400"} />
            </>
          )}
          {branch.distanceInMeters && (
            <p className={"font-r text-12px text-gray-400"}>
              {branch.distanceInMeters}
            </p>
          )}
        </div>
        <p className={"font-r text-14px text-start"}>{branch.address}</p>
      </div>
    </div>
  </li>
)

export default BranchFilterList
