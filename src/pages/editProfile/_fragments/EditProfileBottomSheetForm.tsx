import { Button } from "@components/Button.tsx"

const BottomSheetForm = ({
  title,
  content,
  confirmOptions,
  cancelOptions,
}: {
  title: string
  content: string
  confirmOptions: {
    text: string
    onClick: () => void
  }
  cancelOptions: {
    text: string
    onClick: () => void
  }
}) => (
  <div className={"flex flex-col px-5"}>
    <p className={"font-sb text-18px mt-5"}>{title}</p>
    <p className={"mt-2"}>{content}</p>
    <div className={"mt-10 h-[1px] bg-gray-50 -mx-5"} />
    <div className={"flex gap-2 w-full justify-stretch mt-3 mb-5"}>
      <Button
        className={"w-full"}
        variantType={"line"}
        onClick={cancelOptions.onClick}
      >
        {cancelOptions.text}
      </Button>
      <Button
        className={"w-full"}
        variantType={"primary"}
        onClick={confirmOptions.onClick}
      >
        {confirmOptions.text}
      </Button>
    </div>
  </div>
)

export default BottomSheetForm
