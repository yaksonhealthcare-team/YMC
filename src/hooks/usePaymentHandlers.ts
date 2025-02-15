import { usePaymentStore } from "./usePaymentStore"
import { useOverlay } from "contexts/ModalContext"
import { axiosClient } from "queries/clients"

export const usePaymentHandlers = () => {
  const { points, setPoints } = usePaymentStore()
  const { showToast } = useOverlay()

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    if (!value) {
      setPoints(0)
      return
    }

    const numValue = Number(value)
    if (numValue > points.availablePoints) {
      showToast("사용 가능한 포인트를 초과했습니다.")
      setPoints(points.availablePoints)
      return
    }

    setPoints(numValue)
  }

  const handleUseAllPoints = () => {
    setPoints(points.availablePoints)
  }

  const handleCountChange = async (cartId: string, newCount: number) => {
    try {
      // 로컬 상태만 업데이트
      usePaymentStore.setState((state) => ({
        items: state.items.map((item) =>
          item.ss_idx.toString() === cartId
            ? { ...item, amount: newCount }
            : item,
        ),
      }))
    } catch (error) {
      console.error("수량 변경 실패:", error)
      showToast("수량 변경에 실패했습니다. 다시 시도해주세요.")
    }
  }

  const handleDelete = async (cartId: string) => {
    try {
      await axiosClient.delete(`/carts/${cartId}`)
      showToast("상품이 장바구니에서 삭제되었습니다.")
    } catch (error) {
      console.error("삭제 실패:", error)
      showToast("삭제에 실패했습니다.")
    }
  }

  return {
    handlePointChange,
    handleUseAllPoints,
    handleCountChange,
    handleDelete,
  }
}
