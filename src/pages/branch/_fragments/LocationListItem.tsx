import PinIcon from "@assets/icons/PinIcon.svg?react"
import HeartEnabledIcon from "@assets/icons/HeartEnabledIcon.svg?react"

interface LocationListItemProps {
  type: "saved" | "search"
  title: string
  address: string
}

const LocationListItem = ({ type, title, address }: LocationListItemProps) => {
  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"flex w-full items-center"}>
        {type === "saved" && <div className={"flex mr-[6px]"}><PinIcon className={"w-4 h-4"} /></div>}
        <div className={"flex flex-grow"}>
          <p className={"font-b text-14px"}>{title}</p>
        </div>
        {type === "saved" && <div className={"flex"}><HeartEnabledIcon className={"w-5 h-5"} /></div>}
      </div>
      <div className={"flex"}>
        {type === "saved" && <div className={"w-[22px]"} />}
        <p className={"font-r text-14px text-gray-500"}>{address}</p>
      </div>
    </div>
  )
}

export default LocationListItem
