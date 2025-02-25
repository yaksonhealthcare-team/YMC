import { Brand } from "../types/Brand"
import { useBrands } from "../queries/useBrandQueries"

export function useDisplayBrands() {
  const { data: brands, ...rest } = useBrands()

  const displayedBrands = brands
    ?.filter((brand) => brand.displayYn)
    // 브랜드 코드별로 그룹화하고, 이미지가 있는 브랜드를 우선 선택
    .reduce<Record<string, Brand>>((acc, curr) => {
      // 이미 있는 브랜드인 경우, 이미지가 있는 것을 선택
      if (acc[curr.code] && !acc[curr.code].imageUrl && curr.imageUrl) {
        acc[curr.code] = curr
      }
      // 새로운 브랜드인 경우
      if (!acc[curr.code]) {
        acc[curr.code] = curr
      }
      return acc
    }, {})

  // 객체를 배열로 변환하고 정렬
  const sortedBrands = Object.values(displayedBrands ?? {}).sort((a, b) => {
    // prior로 먼저 정렬하고, prior가 같으면 csb_idx로 정렬
    const priorA = Number(a.prior)
    const priorB = Number(b.prior)
    if (priorA === priorB) {
      return Number(a.csbIdx) - Number(b.csbIdx)
    }
    return priorA - priorB
  })

  return { displayedBrands: sortedBrands, ...rest }
}
