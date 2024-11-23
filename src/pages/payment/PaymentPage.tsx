import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"

const PaymentPage = () => {
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      title: "결제 내역",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div>
      <h1>Payments</h1>
    </div>
  )
}

export default PaymentPage
