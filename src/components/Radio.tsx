interface RadioProps {
  checked: boolean
  onChange: () => void
  label: string
  className?: string
}

export const Radio = ({
  checked,
  onChange,
  label,
  className = "",
}: RadioProps) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <div
        onClick={onChange}
        style={{
          width: "20px",
          height: "20px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "9999px",
            ...(checked
              ? { backgroundColor: "#F37165" }
              : { border: "2px solid #DDDDDD" }),
          }}
        />
        {checked && (
          <div
            style={{
              width: "8px",
              height: "8px",
              position: "absolute",
              top: "6px",
              left: "6px",
              backgroundColor: "bg-white",
              borderRadius: "9999px",
            }}
          />
        )}
      </div>
      <span className="font-sb text-14px text-gray-700">{label}</span>
    </label>
  )
}
