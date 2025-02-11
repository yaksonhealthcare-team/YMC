import { useRouteError, useNavigate } from "react-router-dom"
import { Button } from "./Button"

const ErrorPage = () => {
  const error = useRouteError() as Error
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">죄송합니다</h1>
      <p className="text-gray-600 mb-2">예상치 못한 오류가 발생했습니다.</p>
      <p className="text-gray-500 text-sm mb-6">
        {error?.message || "알 수 없는 오류가 발생했습니다."}
      </p>
      <div className="flex gap-2">
        <Button variantType="line" onClick={() => navigate("/")}>
          홈으로 이동
        </Button>
        <Button onClick={() => window.location.reload()}>
          페이지 새로고침
        </Button>
      </div>
    </div>
  )
}

export default ErrorPage
