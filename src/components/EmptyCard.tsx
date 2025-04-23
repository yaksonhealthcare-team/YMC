import { ButtonRound } from "@components/ButtonRound.tsx"

interface EmptyCardProps {
  title: string
  button?: string
  onClick?: () => void
}

export const EmptyCard = (props: EmptyCardProps) => {
  const { title, button, onClick } = props

  return (
    <>
      <div className="min-h-[114px] flex flex-col justify-center items-center mt-2 pt-4 gap-5">
        <div className="flex flex-col justify-center items-center text-center">
          <span className="whitespace-pre-wrap font-m text-14px text-gray-400">
            {title}
          </span>
        </div>
        {button && <ButtonRound title={button} onClick={onClick} />}
      </div>
    </>
  )
}
