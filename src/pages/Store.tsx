import { useEffect } from "react"
import { useLayout } from "../contexts/LayoutContext"

const Store = () => {
  const { setHeader } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      title: "스토어",
      left: "back",
      backgroundColor: "bg-white",
    })

    return () => {
      setHeader({ display: true })
    }
  }, [setHeader])

  return (
    <div className="w-full h-[calc(100vh-82px)]">
      <iframe
        src="http://139.150.72.85:8081/"
        className="w-full h-full border-none"
        title="스토어"
      />
    </div>
  )
}

export default Store
