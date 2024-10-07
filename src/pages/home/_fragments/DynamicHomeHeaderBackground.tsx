import { ReactNode } from "react"

const DynamicHomeHeaderBackground = ({
  header,
  content,
}: {
  header: ReactNode
  content: ReactNode
}) => {
  return (
    <div className="relative flex flex-col w-full">
      <div className="relative">
        <img src="/assets/home_card_top.png" alt="" className="w-full" />
        <div className="absolute top-3 left-3 w-full h-24 px-5 pt-5">
          {header}
        </div>
      </div>
      <div
        className="relative w-full bg-cover bg-center px-8 py-4"
        style={{ backgroundImage: `url("/assets/home_card_mid.png")` }}
      >
        {content}
      </div>
      <img src="/assets/home_card_bottom.png" alt="" className="w-full" />
    </div>
  )
}

export default DynamicHomeHeaderBackground
