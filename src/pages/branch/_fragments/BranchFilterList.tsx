import { Branch } from "../../../types/Branch.ts"
import BranchPlaceholderImage from "@assets/images/BranchPlaceholderImage.png"
import HeartDisabledIcon from "@assets/icons/HeartDisabledIcon.svg?react"
import HeartEnabledIcon from "@assets/icons/HeartEnabledIcon.svg?react"

interface BranchFilterListProps {
  branches: Branch[],
}

const BranchFilterList = ({ branches }: BranchFilterListProps) => {
  return (
    <div className={"px-5 mt-4 overflow-hidden"}>
      <p className={"font-m text-14px"}>
        {"총 "}
        <span>{branches.length}</span>
        {"개의 지점을 찾았습니다."}
      </p>
      <ul className={"divide-y"}>
        {branches.map((branch) => (
          <BranchFilterListItem key={branch.id} branch={branch} onClickFavorite={() => {
            console.log("TOGGLE FAVORITE")
          }} />
        ))}
      </ul>
    </div>
  )
}

const BranchFilterListItem = ({
  branch,
  onClickFavorite,
}: {
  branch: Branch,
  onClickFavorite: (branch: Branch) => void
}) => (
  <li>
    <div className={"w-full py-4 gap-4 flex items-stretch"}>
      <img
        className={"border border-gray-100 rounded-xl h-[88px] aspect-square object-cover"}
        src={BranchPlaceholderImage}
        alt={"지점 사진"}
      />
      <div className={"w-full flex flex-col"}>
        <div className={"flex justify-between mt-0.5"}>
          <p className={"font-b text-16px"}>{branch.name}</p>
          <button onClick={() => onClickFavorite(branch)}>
            {branch.isFavorite ? <HeartEnabledIcon /> : <HeartDisabledIcon />}
          </button>
        </div>
        <div className={"flex items-center gap-[2.5px]"}>
          {branch.canBookToday && (
            <>
              <p className={"font-r text-12px text-tag-green"}>{"당일 예약 가능"}</p>
              <div className={"w-0.5 h-0.5 rounded-xl bg-gray-400"} />
            </>
          )}
          {branch.distanceInMeters && (
            <p className={"font-r text-12px text-gray-400"}>{`${branch.distanceInMeters}m`}</p>
          )}
        </div>
        <p className={"font-r text-14px"}>{branch.address}</p>
      </div>
    </div>
  </li>
)

export default BranchFilterList
