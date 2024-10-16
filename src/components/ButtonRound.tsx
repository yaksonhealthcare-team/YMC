interface ButtonRoundProps {
  title: string
  onClick?: () => void
}

export const ButtonRound = (props: ButtonRoundProps) => {
  const { title } = props

  return (
    <>
      <button className="h-9 px-3 bg-primary rounded-full font-sb text-12px text-white">
        {title}
      </button>
    </>
  )
}
