import { ReactNode } from "react"

const DynamicCustomSVGComponent = ({
  header,
  content,
}: {
  header: ReactNode
  content: ReactNode
}) => {
  return (
    <div className="relative flex flex-col w-full h-fit">
      <img src="/assets/home_card_header.png" alt="" className="w-full" />
      <div className="absolute top-0 left-0 w-full h-24 p-5">{header}</div>
      <div className={"w-full h-full bg-white px-5 pb-5 rounded-b-3xl"}>
        {content}
      </div>
    </div>
  )
}

export default DynamicCustomSVGComponent
