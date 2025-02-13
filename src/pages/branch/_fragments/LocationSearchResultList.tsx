import { Location } from "../../../types/Location.ts"
import LocationSearchPlaceholder from "./LocationSearchPlaceholder.tsx"
import PinIcon from "@assets/icons/PinIcon.svg?react"
import HeartEnabledIcon from "@assets/icons/HeartEnabledIcon.svg?react"

interface LocationSearchResultListProps {
  type: "saved" | "search"
  locations: Location[]
  onClick: (location: Location) => void
  onDelete?: (id: string) => void
}

const LocationSearchResultList = ({
  type,
  locations,
  onClick,
  onDelete,
}: LocationSearchResultListProps) => {
  if (locations.length === 0) {
    return <LocationSearchPlaceholder />
  }

  return (
    <ul className={"px-5 divide-y divide-gray-100 overflow-y-scroll"}>
      {locations.map((location, index) => (
        <li key={location.csab_idx ?? index} className={"py-4"}>
          <div
            className={"flex items-center gap-2"}
            onClick={() => onClick(location)}
          >
            <PinIcon className={"w-4 h-4"} />
            <p className={"flex-1 font-b text-14px"}>{location.address}</p>
            {type === "saved" && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(location.csab_idx!)
                }}
              >
                <HeartEnabledIcon className={"w-5 h-5"} />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default LocationSearchResultList
