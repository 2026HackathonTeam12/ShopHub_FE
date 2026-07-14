import { useState, useCallback } from "react"
import { fetchDashboard, UnauthorizedError, type DashboardSuggestionCard } from "../api"
import { useExitApp } from "./useExitApp"

export function useFetchDashboardMutation() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [card, setCard] = useState<DashboardSuggestionCard | null>(null)
    const exitApp = useExitApp()

    const run = useCallback(
        async (storeId: string): Promise<boolean> => {
            setLoading(true)
            setError(null)
            try {
                const data = await fetchDashboard(storeId)
                setCard(data.suggestionCard)
                setLoading(false)
                return true
            } catch (err) {
                if (err instanceof UnauthorizedError) {
                    exitApp()
                    return false
                }
                setLoading(false)
                setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
                return false
            }
        },
        [exitApp],
    )

    return { loading, error, card, run }
}
