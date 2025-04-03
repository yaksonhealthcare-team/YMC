import { useEffect, useState } from "react"
import CustomTextField from "../../../components/CustomTextField"
import { isInRange } from "../../../utils/number"

interface BirthDateInputProps {
  value: string | undefined
  onChange: (value: string) => void
  onValidationChange: (isValid: boolean) => void
}

const BirthDateInput = ({
  value,
  onChange,
  onValidationChange,
}: BirthDateInputProps) => {
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")

  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }

    return age
  }

  const validateDate = (y: string, m: string, d: string): boolean => {
    if (!y || !m || !d) return false

    const yearNum = parseInt(y)
    const monthNum = parseInt(m)
    const dayNum = parseInt(d)

    if (!isInRange(yearNum, 1900, new Date().getFullYear())) return false
    if (!isInRange(monthNum, 1, 12)) return false

    const date = new Date(yearNum, monthNum - 1, dayNum)
    if (date.getMonth() !== monthNum - 1) return false

    const age = calculateAge(date)
    return age >= 14
  }

  useEffect(() => {
    if (!value) {
      setYear("")
      setMonth("")
      setDay("")
      return
    }

    const [y, m, d] = value.split("-")
    if (y !== year) setYear(y || "")
    if (m !== month && m !== month.padStart(2, "0")) setMonth(m || "")
    if (d !== day && d !== day.padStart(2, "0")) setDay(d || "")
  }, [value])

  useEffect(() => {
    const isValid = validateDate(year, month, day)
    onValidationChange(isValid)

    if (isValid) {
      onChange(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`)
    }
  }, [year, month, day, onChange, onValidationChange])

  return (
    <div className="flex gap-3">
      <CustomTextField
        placeholder="YYYY"
        value={year}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 4)
          setYear(val)
        }}
        className="flex-1"
        type="tel"
        state="default"
      />
      <CustomTextField
        placeholder="MM"
        value={month}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 2)
          setMonth(val)
        }}
        className="flex-1"
        type="tel"
        state="default"
      />
      <CustomTextField
        placeholder="DD"
        value={day}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 2)
          setDay(val)
        }}
        className="flex-1"
        type="tel"
        state="default"
      />
    </div>
  )
}

export default BirthDateInput
