import LocationListItem from "./LocationListItem.tsx"
import { Location } from "../../../types/Location.ts"

const SavedLocationList = () => {
  const locations: Location[] = Array.from({ length: 30 }, () => ({
    title: "약손명가 선릉점",
    address: "서울 강남구 테헤란로",
  }))

  return (
    <div className={"flex flex-col py-6 h-full overflow-y-scroll"}>
      <p className={"px-5 font-sb text-16px"}>{"자주 쓰는 주소"}</p>
      {locations.length === 0 ? (
        <div className={"w-full h-full flex flex-col items-center justify-center"}>
          <p className={"font-sb text-16px text-gray-300"}>{"자주 쓰는 주소가 없어요."}</p>
        </div>
      ) : (
        <ul className={"px-5 divide-y divide-gray-100"}>
          {locations.map(({ title, address }, index) => (
            <li key={index} className={"py-4"}>
              <LocationListItem type={"saved"} title={title} address={address} />
            </li>
          ))
          }
        </ul>
      )}
    </div>
  )
}

export default SavedLocationList
