const calculateDiscountRate = (
  price: number,
  originalPrice: number,
): number => {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export default calculateDiscountRate
