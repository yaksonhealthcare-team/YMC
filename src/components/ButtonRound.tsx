interface ButtonRoundProps {
  title: string
  onClick?: () => void
}

export const ButtonRound = (props: ButtonRoundProps) => {
  const { title, onClick } = props

  return (
    <>
      <button
        onClick={onClick}
        className="h-9 flex flex-col justify-center items-center px-4 bg-primary rounded-full font-sb text-12px text-white"
      >
        <span className="whitespace-nowrap leading-[12px]">{title}</span>
      </button>
    </>
  )
}
