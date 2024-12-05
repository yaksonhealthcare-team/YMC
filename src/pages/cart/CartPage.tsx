import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"

const CartPage = () => {
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      title: "장바구니",
      left: "back",
      right: null,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])
  return (
    <div>
      <h1>Cart Page</h1>
    </div>
  )
}

export default CartPage
