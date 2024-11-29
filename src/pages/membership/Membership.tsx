import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CustomTabs } from "@components/Tabs"
import { Button } from "@components/Button"
import { Tag } from "@components/Tag"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"

interface Brand {
  label: string
  value: string
}

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  brand: string
  title: string
  time: string
  price: number
  originalPrice?: number
  discountPrice?: number
  discountRate?: number
  isAllBranch: boolean
}

const MembershipPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      title: "회원권 구매",
      left: <div onClick={() => navigate(-1)} />,
    })
    setNavigation({ display: true })
  }, [setHeader, setNavigation, navigate])

  return (
    <div className="flex-1 flex-col h-auto bg-[#F8F5F2]">
      <div className="w-full px-4 py-2.5 bg-[#92443D] text-center">
        <span className="font-m text-14px text-white">
          이용하고 싶은 회원권을 담아주세요.
        </span>
      </div>

      <BrandSection />
      <CategorySection />
      <ProductList />
    </div>
  )
}

const BrandSection = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>("약손명가")

  const brands: Brand[] = [
    { label: "약손명가", value: "약손명가" },
    { label: "달리아스파", value: "달리아스파" },
    { label: "여리한다이어트", value: "여리한다이어트" },
  ]

  return (
    <div className="border-b border-gray-200 flex px-5">
      <CustomTabs
        type="2depth"
        tabs={brands.map((brand) => ({
          label: brand.label,
          value: brand.value,
        }))}
        onChange={(value) => setSelectedBrand(value)}
        activeTab={selectedBrand}
      />
    </div>
  )
}

const CategorySection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("얼굴테라피")

  const categories: Category[] = [
    { id: 1, name: "얼굴테라피" },
    { id: 2, name: "바디테라피" },
    { id: 3, name: "바디라인" },
    { id: 4, name: "체형테라피" },
    { id: 5, name: "스페셜테라피" },
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-5 h-[100px] scrollbar-hide">
      {categories.map((category) => (
        <div key={category.id} className="flex-shrink-0">
          <Button
            variantType={
              category.name === selectedCategory ? "primary" : "gray"
            }
            sizeType="s"
            onClick={() => setSelectedCategory(category.name)}
            className="w-[68px] aspect-square text-xs whitespace-nowrap"
            sx={{ borderRadius: "50% !important" }}
          >
            {category.name}
          </Button>
        </div>
      ))}
    </div>
  )
}

const ProductList = () => {
  const navigate = useNavigate()

  const products: Product[] = [
    {
      id: 1,
      brand: "약손명가",
      title: "K-BEAUTY 연예인관리",
      time: "120분",
      price: 200000,
      isAllBranch: true,
    },
    {
      id: 2,
      brand: "약손명가",
      title: "작은 얼굴 관리 (80분)",
      time: "120분",
      price: 200000,
      originalPrice: 240000,
      discountPrice: 200000,
      discountRate: 20,
      isAllBranch: true,
    },
  ]

  return (
    <div className="flex-1 px-5 ">
      <div className="flex flex-col gap-4 pb-32">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-full p-5 bg-white rounded-[20px] shadow-card border border-gray-100 cursor-pointer"
            onClick={() => navigate(`/membership/${product.id}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <Tag type="rect" title="전지점" />
              <div className="flex items-center gap-1">
                <ClockIcon className="text-primary" />
                <span className="font-r text-14px text-gray-500">
                  {product.time} 소요
                </span>
              </div>
            </div>

            <div className="mb-3">
              <p className="font-r text-14px text-gray-900 mb-1">
                {product.brand}
              </p>
              <p className="font-sb text-16px text-gray-900">{product.title}</p>
            </div>

            <div className="flex flex-col items-end">
              {product.originalPrice && (
                <span className="font-r text-14px text-gray-300 line-through">
                  {product.originalPrice.toLocaleString()}
                </span>
              )}
              <div className="w-full flex items-center justify-between gap-2">
                {product.discountRate && (
                  <span className="font-b text-16px text-primary">
                    {product.discountRate}%
                  </span>
                )}
                <div className="flex-1 text-right">
                  <span className="font-b text-16px text-gray-900 mr-[5px]">
                    {(product.discountPrice || product.price).toLocaleString()}
                    원
                  </span>
                  <span className="font-r text-12px text-gray-900">부터~</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MembershipPage
