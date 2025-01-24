import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import { useMembershipCategories } from "queries/useMembershipQueries"
import { MembershipCategory } from "types/Membership"

interface ProgramListProps {
  brandCode: string
}

const ProgramList = ({ brandCode }: ProgramListProps) => {
  const navigate = useNavigate()
  const { data: categoriesData } = useMembershipCategories(brandCode)

  if (!categoriesData?.body || categoriesData.body.length === 0) {
    return null
  }

  return (
    <div className="px-5 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900 text-lg font-semibold">프로그램</h2>
        <button
          className="text-gray-500 text-sm"
          onClick={() => navigate("/membership")}
        >
          전체보기
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categoriesData.body.slice(0, 4).map((category: MembershipCategory) => (
          <Button
            key={category.sc_code}
            variantType="grayLine"
            sizeType="m"
            className="h-[100px] flex flex-col items-center justify-center gap-1"
            onClick={() => navigate(`/membership?category=${category.sc_code}`)}
          >
            <span className="text-gray-900 font-medium">
              {category.sc_name}
            </span>
            {category.sc_pic && (
              <span className="text-gray-500 text-xs">{category.sc_pic}</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default ProgramList
