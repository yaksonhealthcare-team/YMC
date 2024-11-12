interface BrandCardProps {
  brandSrc: string
  name?: string
  onClick?: () => void
  selected?: boolean
}

export const BrandCard = (props: BrandCardProps) => {
  const { brandSrc, name, onClick, selected = false } = props

  return (
    <>
      <button onClick={onClick} className="flex flex-col items-center gap-2">
        <div
          className={`flex items-center w-[84px] h-[84px] px-[7px] py-[28px] bg-white rounded-full border ${
            selected ? "border-primary bg-primary-100" : "border-gray-100"
          }`}
        >
          <img src={brandSrc} alt={name || "Brand image"} />
        </div>
        <span className="font-m text-12px text-gray-600"> {name} </span>
      </button>
    </>
  )
}
