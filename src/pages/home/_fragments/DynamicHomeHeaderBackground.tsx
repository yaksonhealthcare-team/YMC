import { ReactNode, useEffect, useRef, useState } from "react"

const DynamicHomeHeaderBackground = ({
  header,
  content,
  buttonArea,
}: {
  header: ReactNode
  content: ReactNode
  buttonArea: ReactNode
}) => {
  return (
    <div
      className="relative flex flex-col"
      style={{
        width: "calc(100% + 20px)",
        marginLeft: "-10px",
      }}
    >
      <div className="relative w-full">
        <img src="/assets/home_card_top.png" alt="" className="w-full" />
        <div className="absolute top-3 left-3 w-full h-24">
          <div className="flex justify-between w-full">
            <div className={"px-5 pt-5 w-full"}>{header}</div>
            <DynamicSquareContainer>{buttonArea}</DynamicSquareContainer>
          </div>
        </div>
      </div>
      <div
        className="relative w-full bg-cover bg-center px-8 py-4"
        style={{ backgroundImage: `url("/assets/home_card_mid.png")` }}
      >
        {content}
      </div>
      <img src="/assets/home_card_bottom.png" alt="" className="w-full" />
    </div>
  )
}

interface DynamicSquareContainerProps {
  children: ReactNode
  className?: string
}

const DynamicSquareContainer = ({
  children,
  className = "",
}: DynamicSquareContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState(0)

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current?.offsetWidth
        setSize(width || 0)
      }
    }

    updateSize() // Initial size set
    window.addEventListener("resize", updateSize)

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative mr-5 pl-3 pb-3 w-[14%] ${className}`}
      style={{ height: `${size}px` }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}

export default DynamicHomeHeaderBackground
