import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMembershipCategories } from "../../../queries/useMembershipQueries"
import { MembershipCategory } from "../../../types/Membership"
import { Button } from "@components/Button"

export const ProgramList = () => {
  const navigate = useNavigate()
  const [brandCode] = useState("001") // 약손명가

  const { data: categoriesData } = useMembershipCategories(brandCode)

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
        {categoriesData?.items
          .slice(0, 4)
          .map((category: MembershipCategory) => (
            <Button
              key={category.sc_idx}
              variantType="grayLine"
              sizeType="m"
              className="h-[100px] flex flex-col items-center justify-center gap-1"
              onClick={() =>
                navigate(`/membership?category=${category.sc_idx}`)
              }
            >
              <span className="text-gray-900 font-medium">
                {category.category_name}
              </span>
              {category.category_description && (
                <span className="text-gray-500 text-xs">
                  {category.category_description}
                </span>
              )}
            </Button>
          ))}
      </div>
    </div>
  )
}
