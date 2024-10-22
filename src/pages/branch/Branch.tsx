import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { Header } from "../../components/Header"

const Branch = () => {
  const { setHeader } = useLayout()

  useEffect(() => {
    setHeader({
      component: <BranchHeader />,
      display: true,
    })
  }, [])

  return (
    <div>
      <p>{"Content"}</p>
    </div>
  )
}

const BranchHeader = () => {
  return (
    <Header
      type="location"
      title="서울 강남구 테헤란로78길 14-10"
      onClickLocation={() => {
        alert("Location Clicked")
      }}
      onClickLeft={() => {
        alert("Left Icon Clicked")
      }}
      onClickRight={() => {
        alert("Right Icon Clicked")
      }}
    />
  )
}

export default Branch
