import { useState, useEffect } from "react"
import { fetchVisitedStores } from "../apis/user.api"
import { BranchResponse } from "../types/Branch"
import { ListResponse } from "../types/Common"

export const useVisitedStores = () => {
  const [data, setData] = useState<ListResponse<BranchResponse> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const getVisitedStores = async () => {
      try {
        setIsLoading(true)
        const response = await fetchVisitedStores()
        setData(response)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch visited stores"),
        )
      } finally {
        setIsLoading(false)
      }
    }

    getVisitedStores()
  }, [])

  return { data, isLoading, error }
}
