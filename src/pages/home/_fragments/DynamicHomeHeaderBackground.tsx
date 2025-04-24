import { memo, ReactNode, useEffect, useRef, useState } from "react"

const ContentNode = memo(({ content }: { content: ReactNode }) => {
  return (
    <div className="relative w-full bg-cover bg-center px-5">{content}</div>
  )
})

const DynamicHomeHeaderBackground = memo(
  ({
    header,
    content,
    contents,
    buttonArea,
  }: {
    header: ReactNode
    content?: ReactNode
    contents?: ReactNode[]
    buttonArea: ReactNode
  }) => {
    return (
      <div
        className="relative flex flex-col px-5 py-2"
        style={{
          width: "calc(100%)",
          filter: "drop-shadow(0px 1px 4px rgba(46, 43, 41, 0.12))",
        }}
      >
        {/* 상단 SVG - 가로 사이즈에 맞추고 비율 유지 */}
        <div className="relative w-full mt-1">
          <svg
            width="100%"
            viewBox="0 0 335 81"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M259 0C270.046 7.08729e-07 279 8.95431 279 20V24C279 41.6731 293.327 56 311 56H315C326.046 56 335 64.9543 335 76V81H0V20C6.76515e-07 8.95431 8.95431 4.22794e-07 20 0H259Z"
              fill="white"
            />
          </svg>
          <div className="absolute top-3 left-3 w-full h-24">
            <div className="flex justify-between w-full">
              <div className={"px-2 py-2 w-full max-w-[84%]"}>{header}</div>
              <DynamicSquareContainer>{buttonArea}</DynamicSquareContainer>
            </div>
          </div>
        </div>

        {/* 중간 부분 - 가변적인 높이, 위쪽 1px 겹침 */}
        <div className="relative w-full bg-white" style={{ marginTop: "-1px" }}>
          {content && <ContentNode content={content} />}
          {contents &&
            contents.map((item, i) => <ContentNode key={i} content={item} />)}
        </div>

        {/* 하단 SVG - 가로 사이즈에 맞추고 비율 유지, 위쪽 1px 겹침 */}
        <div className="relative w-full mb-1" style={{ marginTop: "-1px" }}>
          <svg
            width="100%"
            viewBox="0 0 335 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M335 6C335 17.0457 326.046 26 315 26H20C8.95431 26 0 17.0457 0 6V0H335V6Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    )
  },
)

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
      className={`relative mb-2 mt-[-10px] mr-2 w-[14%] ${className}`}
      style={{ height: `${size}px` }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}

export default DynamicHomeHeaderBackground
