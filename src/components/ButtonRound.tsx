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
        className="h-9 px-3 bg-primary rounded-full font-sb text-12px text-white"
      >
        {title}
      </button>
    </>
  )
}
