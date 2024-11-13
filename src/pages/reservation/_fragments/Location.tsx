import { ReactNode } from "react"
import PinIcon from "@assets/icons/PinIcon.svg?react"
import PhoneIcon from "@assets/icons/PhoneIcon.svg?react"
import { copyToClipboard } from "utils/copyUtils"

const InfoGroup = ({
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

const Location = () => {
  return (
    <div className="flex flex-col gap-[16px] mt-[40px]">
      <p className="font-b">오시는 길</p>
      <div className="aspect-[1.8]">
        <img
          className="min-h-[100%]"
          alt="placeholder"
          src="https://simg.pstatic.net/static.map/v2/map/staticmap.bin?caller=smarteditor&markers=color%3A0x11cc73%7Csize%3Amid%7Cpos%3A127.0492805%2037.504585%7CviewSizeRatio%3A0.7%7Ctype%3Ad&w=700&h=315&scale=2&dataversion=172.15"
        />
      </div>
      <div className="flex gap-[12px] flex-col mt-[16px]">
        <InfoGroup icon={<PinIcon />}>
          <div className={"flex w-full justify-between"}>
            <p>서울시 강남구 강남대로 78길 22 허브빌딩 206호</p>
            <button
              className={"text-tag-blue flex-shrink-0"}
              onClick={() =>
                copyToClipboard("서울시 강남구 강남대로 78길 22 허브빌딩 206호")
              }
            >
              복사
            </button>
          </div>
        </InfoGroup>
        <InfoGroup icon={<PhoneIcon />}>
          <div className={"flex w-full justify-between"}>
            <p>02-123-4556</p>
            <button
              className={"text-tag-blue flex-shrink-0"}
              onClick={() => copyToClipboard("02-123-4556")}
            >
              복사
            </button>
          </div>
        </InfoGroup>
      </div>
    </div>
  )
}

export default Location
