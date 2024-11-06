import { Location } from "../../../types/Location.ts"
import LocationSearchPlaceholder from "./LocationSearchPlaceholder.tsx"
import LocationListItem from "./LocationListItem.tsx"

interface LocationSearchResultListProps {
  locations: Location[];
  onClick: (location: Location) => void;
}

const LocationSearchResultList = ({ locations, onClick }: LocationSearchResultListProps) => {
  if (locations.length === 0) {
    return <LocationSearchPlaceholder />
  }

  return (
    <ul className={"px-5 divide-y divide-gray-100 overflow-y-scroll"}>
      {locations.map(({ title, address }, index) => (
        <li key={index} className={"py-4"} onClick={() => onClick(locations[index])}>
          <LocationListItem type={"search"} title={title} address={address} />
        </li>
      ))}
    </ul>
  )
}

export default LocationSearchResultList
