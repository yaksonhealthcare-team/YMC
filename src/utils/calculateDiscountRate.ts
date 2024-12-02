const calculateDiscountRate = (price: string, originalPrice: string) => {
  const p = parseInt(price.replace(/,/g, ""), 10)
  const op = parseInt(originalPrice.replace(/,/g, ""), 10)
  if (!op) return 0
  return Math.round(((op - p) / op) * 100)
}

export default calculateDiscountRate
