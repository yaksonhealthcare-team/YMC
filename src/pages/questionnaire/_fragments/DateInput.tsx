import { useEffect, useState } from "react"
import CustomTextField from "@components/CustomTextField"

interface DateInputProps {
  value: string
  onChange: (value: string) => void
}

export const DateInput = ({ value, onChange }: DateInputProps) => {
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")

  useEffect(() => {
    if (value) {
      setYear(value.substring(0, 4))
      setMonth(value.substring(4, 6))
      setDay(value.substring(6, 8))
    }
  }, [value])

  const handleChange = (type: "year" | "month" | "day", newValue: string) => {
    let sanitizedValue = newValue.replace(/\D/g, "")

    switch (type) {
      case "year":
        sanitizedValue = sanitizedValue.slice(0, 4)
        setYear(sanitizedValue)
        break
      case "month":
        sanitizedValue = sanitizedValue.slice(0, 2)
        if (parseInt(sanitizedValue) > 12) sanitizedValue = "12"
        setMonth(sanitizedValue)
        break
      case "day":
        sanitizedValue = sanitizedValue.slice(0, 2)
        if (parseInt(sanitizedValue) > 31) sanitizedValue = "31"
        setDay(sanitizedValue)
        break
    }

    const combinedValue = `${type === "year" ? sanitizedValue : year}${
      type === "month" ? sanitizedValue : month
    }${type === "day" ? sanitizedValue : day}`

    onChange(combinedValue)
  }

  return (
    <div className="flex gap-2">
      <div className="grow">
        <CustomTextField
          value={year}
          onChange={(e) => handleChange("year", e.target.value)}
          placeholder="YYYY"
          state="default"
          type="tel"
        />
      </div>
      <div className="grow">
        <CustomTextField
          value={month}
          onChange={(e) => handleChange("month", e.target.value)}
          placeholder="MM"
          state="default"
          type="tel"
        />
      </div>
      <div className="grow">
        <CustomTextField
          value={day}
          onChange={(e) => handleChange("day", e.target.value)}
          placeholder="DD"
          state="default"
          type="tel"
        />
      </div>
    </div>
  )
}
