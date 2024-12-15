import { BranchDetail } from "../../../../types/Branch.ts"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"
import PinIcon from "@assets/icons/PinIcon.svg?react"
import PhoneIcon from "@assets/icons/PhoneIcon.svg?react"
import CopyIcon from "@assets/icons/CopyIcon.svg?react"
import { ReactNode, useState } from "react"
import { copyToClipboard } from "../../../../utils/copyUtils.ts"
import { Tag } from "@components/Tag.tsx"
import BranchImageCarousel from "./BranchImageCarousel.tsx"
import MapView from "@components/MapView.tsx"

const IconSection = ({
  icon,
  children,
}: {
  icon: ReactNode
  children: ReactNode
}) => (
  <div className={"flex items-start gap-2 font-r text-14px w-full"}>
    <div className={"h-5 content-center"}>{icon}</div>
    {children}
  </div>
)

const LabelSection = ({
  label,
  type,
  children,
}: {
  label: string
  type: "heading" | "title"
  children: ReactNode
}) => (
  <div
    className={`flex flex-col items-start ${type === "heading" ? "gap-4" : "gap-3"} text-r text-14px`}
  >
    <p
      className={`${type === "heading" ? "font-b text-16px" : "font-sb text-14px"}`}
    >
      {label}
    </p>
    {children}
  </div>
)

const BranchInformation = ({ branch }: { branch: BranchDetail }) => {
  const [openImageModal, setOpenImageModal] = useState(false)

  const { weekday, saturday, holiday } = branch.operatingHours

  const renderOperatingHours = ({
    label,
    start,
    end,
  }: {
    label: string
    start: string
    end: string
  }) => <p>{`${label} ${start} - ${end}`}</p>

  return (
    <>
      {openImageModal && (
        <BranchImageCarousel
          images={branch.images}
          onClose={() => setOpenImageModal(false)}
        />
      )}
      <div className={"flex flex-col p-5 gap-6"}>
        <div className={"flex flex-col gap-4"}>
          <div className={"flex flex-col gap-3"}>
            <IconSection icon={<ClockIcon />}>
              <div className={"flex flex-col gap-1"}>
                {renderOperatingHours({ ...weekday, label: "평일" })}
                {renderOperatingHours({ ...saturday, label: "토요일" })}
                {renderOperatingHours({ ...holiday, label: "일요일" })}
              </div>
            </IconSection>
            <IconSection icon={<PinIcon />}>
              <p>{branch.location.address}</p>
            </IconSection>
            <IconSection icon={<PhoneIcon />}>
              <p>{branch.phoneNumber}</p>
            </IconSection>
          </div>
          {branch.images.length > 0 && branch.images[0] !== "" && (
            <button
              className={"relative"}
              onClick={() => setOpenImageModal(true)}
            >
              <img
                className={"rounded-3xl w-full h-[100px] object-cover"}
                src={branch.images[0]}
                alt={"image"}
              />
              <CopyIcon className={"absolute top-2 right-3 text-white"} />
            </button>
          )}
        </div>
        <div className={"h-[1px] w-full bg-gray-200"} />
        <div className={"flex flex-col gap-6"}>
          <LabelSection label={"오시는 길"} type={"heading"}>
            <div className={"w-full h-48 flex"}>
              <MapView
                currentLocation={{
                  latitude: branch.location.latitude,
                  longitude: branch.location.longitude,
                }}
                options={{ showCurrentLocationButton: false }}
              />
            </div>
            <IconSection icon={<PinIcon />}>
              <div className={"flex w-full justify-between"}>
                <p>{branch.location.address}</p>
                <button
                  className={"text-tag-blue flex-shrink-0"}
                  onClick={() => copyToClipboard(branch.location.address)}
                >
                  {"복사"}
                </button>
              </div>
            </IconSection>
          </LabelSection>
          <LabelSection label={"일반 버스"} type={"title"}>
            <div className={"flex flex-col gap-2"}>
              <p>{branch.directions.bus.description}</p>
              <div className={"flex flex-wrap gap-1"}>
                {branch.directions.bus.routes.map((route, index) => (
                  <Tag key={index} type={"rect"} title={route} />
                ))}
              </div>
            </div>
          </LabelSection>
          <LabelSection label={"지하철 안내"} type={"title"}>
            <p>{branch.directions.subway.description}</p>
          </LabelSection>
          <LabelSection label={"자동차 안내"} type={"title"}>
            <p>{branch.directions.car.description}</p>
          </LabelSection>
        </div>
        <div className={"h-4"} />
      </div>
    </>
  )
}

export default BranchInformation
