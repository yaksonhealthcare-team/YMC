import { useEffect, useState } from "react"
import { Button } from "./Button"

const ErrorTest = () => {
  const [throwError, setThrowError] = useState(false)

  if (throwError) {
    throw new Error("이것은 테스트 에러입니다!")
  }

  return (
    <div className="p-4">
      <Button onClick={() => setThrowError(true)}>에러 발생시키기</Button>
    </div>
  )
}

export default ErrorTest
