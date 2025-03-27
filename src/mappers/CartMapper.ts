import { CartItem, CartItemOption, CartItemResponse } from "../types/Cart"

export class CartMapper {
  private static toValidId(id: string): string {
    const numId = Number(id)
    if (isNaN(numId) || numId <= 0) {
      throw new Error(`Invalid cart ID: ${id}`)
    }
    return numId.toString()
  }

  /**
   * @Seyoung: This function maps `CartItemResponse[]` to `CartItem[]`.
   * - Basically this function classifies the items based on `membership.s_idx` and `option.ss_count`
   * - So this function creates the record to classify the items that have the same `membership.s_idx`
   *   - `{[membership.s_idx]: CartItem}`
   * - And for the items that have the same `membership.s_idx`, it classifies the items with `option.ss_count`.
   * - Next, it creates / updates the `CartItem` using dto that has same `membership.s_idx`
   * @param dtos
   */
  static toEntities(dtos: CartItemResponse[]): CartItem[] {
    const itemsMap = dtos.reduce(
      (acc, dto) => {
        if (Number(dto.amount) === 0) return acc

        const itemId = dto.membership.s_idx

        if (itemId in acc) {
          acc[itemId] = this.updateExistingItem(acc[itemId], dto)
        } else {
          acc[itemId] = this.createNewItem(dto)
        }

        return acc
      },
      {} as Record<string, CartItem>,
    )

    return Object.values(itemsMap)
  }

  private static createNewItem(dto: CartItemResponse): CartItem {
    return {
      id: dto.membership.s_idx,
      brand: dto.branch.brand_name,
      branchType: dto.branch.s_type,
      title: dto.membership.s_name,
      duration: Number(dto.membership.s_time) || 60,
      options: [this.createOption(dto)],
      branchId: dto.branch.b_idx,
      brandCode: dto.branch.brand_code,
      branchName: dto.branch.b_name,
    }
  }

  private static updateExistingItem(
    item: CartItem,
    dto: CartItemResponse,
  ): CartItem {
    const sessionCount = Number(dto.option.ss_count)
    const existingOptionIndex = item.options.findIndex(
      (option) => option.sessions === sessionCount,
    )

    if (existingOptionIndex === -1) {
      return {
        ...item,
        branchId: dto.branch.b_idx,
        brandCode: dto.branch.brand_code,
        branchName: dto.branch.b_name,
        options: [...item.options, this.createOption(dto)],
      }
    }

    return {
      ...item,
      branchId: dto.branch.b_idx,
      brandCode: dto.branch.brand_code,
      branchName: dto.branch.b_name,
      options: item.options.map((option, index) =>
        index === existingOptionIndex
          ? {
              ...option,
              items: [
                {
                  cartId: this.toValidId(dto.csc_idx),
                  count: Number(dto.amount),
                },
              ],
              price: Number(dto.option.ss_unit_price.replace(/,/g, "")),
              originalPrice:
                dto.origin_price ||
                Number(dto.option.ss_unit_price.replace(/,/g, "")),
            }
          : option,
      ),
    }
  }

  private static createOption(dto: CartItemResponse): CartItemOption {
    const price = Number(dto.option.ss_unit_price.replace(/,/g, ""))
    const originalPrice = dto.origin_price || price

    return {
      items: [
        {
          cartId: this.toValidId(dto.csc_idx),
          count: Number(dto.amount),
        },
      ],
      sessions: Number(dto.option.ss_count),
      price,
      originalPrice,
      ss_idx: dto.option.ss_idx,
    }
  }
}
