import { Branch } from "../../types/Branch.ts"
import BranchItem from "./BranchItem.tsx"

interface SelectedBranchListProps {
  selectedBranches: Branch[]
}

const Step2SelectedBranchList = ({
  selectedBranches,
}: SelectedBranchListProps) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="px-[20px] mt-[20px]">
        <p className="text-gray-700 font-bold text-20px">
          총{" "}
          <span className="text-primary-300">{selectedBranches.length}개</span>
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
            key={branch.b_idx}
            className={`p-[20px] border border-primary-300 rounded-[20px] ${index !== 0 && "mt-[16px]"}`}
          >
            <BranchItem branch={branch} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Step2SelectedBranchList
