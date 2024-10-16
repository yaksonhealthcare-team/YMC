interface BrandCardProps {
  brandSrc: string
  name?: string
  onClick?: () => void
}

export const BrandCard = (props: BrandCardProps) => {
  const { brandSrc, name, onClick } = props

  return (
    <>
      <button onClick={onClick} className="flex flex-col items-center gap-2">
        <div className="flex items-center w-[84px] h-[84px] px-[7px] py-[28px] bg-white rounded-full">
          <img src={brandSrc} alt={name || "Brand image"}></img>
        </div>
        <span className="font-m text-12px text-gray-600"> {name} </span>
      </button>
    </>
  )
}
