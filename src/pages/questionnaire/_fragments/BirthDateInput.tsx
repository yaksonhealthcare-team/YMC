import { useEffect, useState } from "react"
import CustomTextField from "@components/CustomTextField"

interface BirthDateInputProps {
  value: string
  onChange: (value: string) => void
}

export const BirthDateInput = ({ value, onChange }: BirthDateInputProps) => {
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")
  const [age, setAge] = useState<number | null>(null)

  useEffect(() => {
    if (value) {
      setYear(value.substring(0, 4))
      setMonth(value.substring(4, 6))
      setDay(value.substring(6, 8))
      calculateAge(value)
    }
  }, [value])

  const calculateAge = (birthDate: string) => {
    if (birthDate.length === 8) {
      const year = parseInt(birthDate.substring(0, 4))
      const month = parseInt(birthDate.substring(4, 6))
      const day = parseInt(birthDate.substring(6, 8))

      const today = new Date()
      const birth = new Date(year, month - 1, day)

      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--
      }

      setAge(age)
    } else {
      setAge(null)
    }
  }

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

    // 변경된 필드의 값만 업데이트하여 조합
    const updatedValue =
      type === "year"
        ? sanitizedValue + month + day
        : type === "month"
          ? year + sanitizedValue + day
          : year + month + sanitizedValue

    // 모든 필드가 채워져 있을 때만 onChange 호출
    if (updatedValue.length === 8) {
      onChange(updatedValue)
      calculateAge(updatedValue)
    }
  }

  return (
    <div className="flex flex-col gap-2">
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
      {age !== null && (
        <div className="text-right text-gray-900 text-14px font-r">
          만 {age}세
        </div>
      )}
    </div>
  )
}
