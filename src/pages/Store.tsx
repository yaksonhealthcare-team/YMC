import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Store = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.open("http://139.150.72.85:8081/", "_blank", "noopener,noreferrer")
    // 스토어 페이지를 새 창으로 연 후 이전 페이지로 돌아가기
    navigate(-1)
  }, [navigate])

  return null
}

export default Store
