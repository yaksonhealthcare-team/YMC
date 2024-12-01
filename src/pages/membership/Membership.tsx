import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CustomTabs } from "@components/Tabs"
import { Button } from "@components/Button"
import { Tag } from "@components/Tag"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"
import { useBrands } from "queries/useBrandQueries.tsx"
import { Brand } from "types/Brand.ts"
import {
  useMemberships,
  useServiceCategories,
} from "queries/useMembershipQuires.tsx"
import {
  Membership,
  MembershipOption,
  ServiceCategory,
} from "types/Membership.ts"
import useIntersection from "hooks/useIntersection.tsx"
import SplashScreen from "@components/Splash.tsx"

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
  const [selectedBrandCode, setSelectedBrandCode] = useState<string>("")
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>("")
  const { data: brands } = useBrands()
  const { data: serviceCategories } = useServiceCategories(selectedBrandCode)
  const {
    data: memberships,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useMemberships(selectedBrandCode, selectedCategoryCode)

  const flattenedMemberships = memberships?.pages.flatMap((page) => page) || []

  const handleSelectedBrand = (value: string) => {
    setSelectedBrandCode(value)
  }

  const handleSelectedCategory = (value: string) => {
    setSelectedCategoryCode(value)
  }

  useEffect(() => {
    if (brands && brands.length > 0 && !selectedBrandCode) {
      setSelectedBrandCode(brands[0].code)
    }

    if (
      serviceCategories &&
      serviceCategories.length > 0 &&
      !selectedCategoryCode
    ) {
      setSelectedCategoryCode(serviceCategories[0].serviceCategoryCode)
    }
  }, [brands, selectedBrandCode])

  useEffect(() => {
    setHeader({
      display: true,
      title: "회원권 구매",
      left: <div onClick={() => navigate(-1)} />,
    })
    setNavigation({ display: true })
  }, [setHeader, setNavigation, navigate])

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <div className="flex-1 flex-col h-auto bg-[#F8F5F2]">
      <div className="w-full px-4 py-2.5 bg-[#92443D] text-center">
        <span className="font-m text-14px text-white">
          이용하고 싶은 회원권을 담아주세요.
        </span>
      </div>

      <BrandSection
        brands={brands}
        selectedBrandCode={selectedBrandCode}
        handleSelectedBrand={handleSelectedBrand}
      />
      <CategorySection
        categories={serviceCategories}
        selectedCategoryCode={selectedCategoryCode}
        handleSelectedCategory={handleSelectedCategory}
      />
      <ProductList
        memberships={flattenedMemberships}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  )
}

interface BrandSectionProps {
  brands: Brand[] | undefined
  selectedBrandCode: string
  handleSelectedBrand: (value: string) => void
}

const BrandSection = ({
  brands,
  selectedBrandCode,
  handleSelectedBrand,
}: BrandSectionProps) => {
  return (
    <div className="flex ">
      {brands && brands.length > 0 && (
        <CustomTabs
          type="scroll"
          tabs={brands.map((brand) => ({
            label: brand.name,
            value: brand.code,
          }))}
          onChange={handleSelectedBrand}
          activeTab={selectedBrandCode}
        />
      )}
    </div>
  )
}

interface CategorySectionProps {
  categories?: ServiceCategory[]
  selectedCategoryCode: string
  handleSelectedCategory: (value: string) => void
}

const CategorySection = ({
  categories,
  selectedCategoryCode,
  handleSelectedCategory,
}: CategorySectionProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-5 h-[100px] scrollbar-hide">
      {categories?.map((category) => (
        <div key={category.serviceCategoryCode} className="flex-shrink-0">
          <Button
            variantType={
              category.serviceCategoryCode === selectedCategoryCode
                ? "primary"
                : "gray"
            }
            sizeType="s"
            onClick={() => handleSelectedCategory(category.serviceCategoryCode)}
            className="w-[68px] aspect-square text-xs whitespace-nowrap"
            sx={{ borderRadius: "50% !important" }}
          >
            {category.serviceCategoryName}
          </Button>
        </div>
      ))}
    </div>
  )
}

interface ProductListProps {
  memberships: Membership[]
  hasNextPage?: boolean
  fetchNextPage: () => void
  isFetchingNextPage: boolean
}

const ProductList = ({
  memberships,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: ProductListProps) => {
  const navigate = useNavigate()

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  const getLowestOptionPrice = (options: MembershipOption[]) => {
    if (!options || options.length === 0) return null

    return options.reduce((lowest, current) => {
      const lowestCount = parseInt(lowest.subscriptionCount)
      const currentCount = parseInt(current.subscriptionCount)
      return lowestCount < currentCount ? lowest : current
    })
  }

  return (
    <div className="flex-1 px-5 ">
      <div className="flex flex-col gap-4 pb-32">
        {memberships?.map((membership) => (
          <div
            key={membership.serviceIndex}
            className="w-full p-5 bg-white rounded-[20px] shadow-card border border-gray-100 cursor-pointer"
            onClick={() => navigate(`/membership/${membership.serviceIndex}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <Tag type="rect" title="전지점" />
              <div className="flex items-center gap-1">
                <ClockIcon className="text-primary" />
                <span className="font-r text-14px text-gray-500">
                  {membership.serviceTime} 소요
                </span>
              </div>
            </div>

            <div className="mb-3">
              <p className="font-r text-14px text-gray-900 mb-1">
                {membership.brandName}
              </p>
              <p className="font-sb text-16px text-gray-900">
                {membership.serviceName}
              </p>
            </div>

            <div className="flex flex-col items-end">
              {(() => {
                const lowestOption = getLowestOptionPrice(membership.options)
                if (!lowestOption) return null

                return (
                  <div className="w-full flex items-center justify-end gap-2">
                    {lowestOption.subscriptionOriginalPrice && (
                      <span className="font-r text-14px text-gray-300 line-through">
                        {lowestOption.subscriptionOriginalPrice}원
                      </span>
                    )}
                    <span className="font-b text-16px text-gray-900 mr-[5px]">
                      {lowestOption.subscriptionPrice}원
                    </span>
                    <span className="font-r text-12px text-gray-900">
                      부터~
                    </span>
                  </div>
                )
              })()}
            </div>
          </div>
        ))}
      </div>
      <div ref={observerTarget} className={"h-4"} />
      {isFetchingNextPage && (
        <p className="text-center text-gray-500 py-4">로딩 중...</p>
      )}
    </div>
  )
}

export default MembershipPage
