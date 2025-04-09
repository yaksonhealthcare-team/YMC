import { BrandCard } from "@components/BrandCard.tsx"
import { useDisplayBrands } from "../hooks/useDisplayBrands"
import { useRef, useState, useEffect } from "react"
import { Box } from "@mui/material"

interface SwiperBrandCardProps {
  className?: string
  onBrandClick: (brandCode: string, brandName: string) => void
  selectedBrandCodes?: string[]
}

export const SwiperBrandCard = ({
  className,
  onBrandClick,
  selectedBrandCodes,
}: SwiperBrandCardProps) => {
  const { displayedBrands } = useDisplayBrands()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const scroll = scrollLeft - (x - startX)
    containerRef.current.scrollLeft = scroll
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return
    const x = e.touches[0].pageX - containerRef.current.offsetLeft
    const scroll = scrollLeft - (x - startX)
    containerRef.current.scrollLeft = scroll
  }

  const stopDragging = () => {
    setIsDragging(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!containerRef.current) return
    if (e.key === "ArrowRight") {
      containerRef.current.scrollLeft += 100
    } else if (e.key === "ArrowLeft") {
      containerRef.current.scrollLeft -= 100
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", stopDragging)
    document.addEventListener("touchend", stopDragging)
    return () => {
      document.removeEventListener("mouseup", stopDragging)
      document.removeEventListener("touchend", stopDragging)
    }
  }, [])

  // 브랜드 데이터가 없을 경우 렌더링하지 않음
  if (!displayedBrands || displayedBrands.length === 0) {
    return null
  }

  return (
    <Box
      ref={containerRef}
      className={`w-full overflow-x-auto scrollbar-hide cursor-grab ${className} ${isDragging ? "cursor-grabbing" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopDragging}
      onKeyDown={handleKeyDown}
      aria-label="브랜드 스와이퍼"
    >
      <div className="flex pb-2 pr-5">
        {displayedBrands.map((brand, index) => (
          <div
            key={`${brand.code}-${index}`}
            className={index === displayedBrands.length - 1 ? "pr-5" : ""}
          >
            <BrandCard
              name={brand.name}
              brandSrc={brand.imageUrl ?? ""}
              onClick={() => onBrandClick(brand.code, brand.name)}
              selected={
                selectedBrandCodes
                  ? selectedBrandCodes?.includes(brand.code)
                  : false
              }
            />
          </div>
        ))}
      </div>
    </Box>
  )
}
