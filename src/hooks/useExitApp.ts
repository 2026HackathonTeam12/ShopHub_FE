import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useSetStores, useSetSelectedStoreId, useSetUser } from "../store"
import { clearAccessToken } from "../api"

export function useExitApp() {
    const navigate = useNavigate()
    const setStores = useSetStores()
    const setSelectedStoreId = useSetSelectedStoreId()
    const setUser = useSetUser()

    return useCallback(() => {
        clearAccessToken()
        setUser(null)
        setStores([])
        setSelectedStoreId("")
        navigate("/login")
    }, [navigate, setStores, setSelectedStoreId, setUser])
}
