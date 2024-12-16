import { ReactNode } from "react"
import clsx from "clsx"
import { Button } from "@components/Button.tsx"

export const LabeledForm = ({
  label,
  className = "",
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) => (
  <div className={"flex flex-col gap-3 items-stretch"}>
    <p className={"font-sb text-gray-500 self-start"}>{label}</p>
    <div className={clsx("w-full font-m text-18px", className)}>{children}</div>
  </div>
)

export const FieldWithButton = ({
  fieldValue,
  buttonLabel,
  onClick,
}: {
  fieldValue: string
  buttonLabel: string
  onClick: () => void
}) => (
  <div className={"flex items-center gap-1 h-14"}>
    <div
      className={"border border-gray-100 px-4 py-3.5 rounded-xl w-full h-full"}
    >
      <p className={"text-16px font-r"}>{fieldValue}</p>
    </div>
    <Button className={"px-5 h-full"} variantType={"primary"} onClick={onClick}>
      <p className={"text-nowrap"}>{buttonLabel}</p>
    </Button>
  </div>
)
